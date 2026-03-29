import { useState, useRef } from 'react'
import { supabase } from '@/config/supabase'
import { Upload, X, CheckCircle2, Loader2, FileVideo, Image } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  bucket: string
  folder: string
  accept: string
  currentPath?: string
  onUploaded: (path: string, publicUrl?: string) => void
  onRemoved?: () => void
  label?: string
  icon?: 'video' | 'image'
  maxSizeMB?: number
}

export function FileUpload({
  bucket,
  folder,
  accept,
  currentPath,
  onUploaded,
  onRemoved,
  label = 'อัปโหลดไฟล์',
  icon = 'image',
  maxSizeMB = 500,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedPath, setUploadedPath] = useState(currentPath || '')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`ไฟล์ใหญ่เกินไป (สูงสุด ${maxSizeMB} MB)`)
      return
    }

    setUploading(true)
    setProgress(0)

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`
    const path = `${folder}/${fileName}`

    // Simulate progress since supabase-js doesn't support upload progress natively
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90))
    }, 200)

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    clearInterval(progressInterval)

    if (error) {
      toast.error('อัปโหลดไม่สำเร็จ: ' + error.message)
      setProgress(0)
      setUploading(false)
      return
    }

    setProgress(100)

    // Get public URL for public buckets (thumbnails)
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)

    setUploadedPath(path)
    onUploaded(path, urlData?.publicUrl)
    toast.success('อัปโหลดสำเร็จ!')

    setTimeout(() => {
      setUploading(false)
      setProgress(0)
    }, 500)
  }

  const handleRemove = async () => {
    if (!uploadedPath) return

    await supabase.storage.from(bucket).remove([uploadedPath])
    setUploadedPath('')
    onRemoved?.()
    toast.success('ลบไฟล์แล้ว')

    // Reset file input
    if (inputRef.current) inputRef.current.value = ''
  }

  const IconComponent = icon === 'video' ? FileVideo : Image

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {uploadedPath ? (
        // Uploaded state
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 truncate">{uploadedPath}</p>
            <p className="text-xs text-green-600">อัปโหลดสำเร็จ</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
            title="ลบไฟล์"
          >
            <X className="h-4 w-4 text-green-700" />
          </button>
        </div>
      ) : uploading ? (
        // Uploading state
        <div className="p-4 border-2 border-primary-200 bg-primary-50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
            <span className="text-sm font-medium text-primary-700">กำลังอัปโหลด...</span>
            <span className="text-sm text-primary-500 ml-auto">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        // Empty state - click to upload
        <label className="block cursor-pointer">
          <div className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50/50 transition-colors">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <IconComponent className="h-6 w-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                <Upload className="h-4 w-4 inline mr-1" />
                คลิกเพื่ออัปโหลด
              </p>
              <p className="text-xs text-gray-500 mt-1">สูงสุด {maxSizeMB} MB</p>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      )}
    </div>
  )
}
