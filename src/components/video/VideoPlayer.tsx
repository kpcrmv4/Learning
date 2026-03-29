import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/config/supabase'
import { VIDEO_SIGNED_URL_EXPIRY } from '@/config/constants'
import { Loader2, AlertCircle, Lock } from 'lucide-react'

interface VideoPlayerProps {
  storagePath: string
  lastPosition?: number
  onTimeUpdate?: (seconds: number) => void
  onEnded?: () => void
}

export function VideoPlayer({ storagePath, lastPosition = 0, onTimeUpdate, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getSignedUrl() {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase.storage
        .from('videos')
        .createSignedUrl(storagePath, VIDEO_SIGNED_URL_EXPIRY)
      if (err) {
        setError('ไม่สามารถโหลดวิดีโอได้')
        setLoading(false)
        return
      }
      setUrl(data.signedUrl)
      setLoading(false)
    }
    getSignedUrl()
  }, [storagePath])

  useEffect(() => {
    if (videoRef.current && url && lastPosition > 0) {
      videoRef.current.currentTime = lastPosition
    }
  }, [url, lastPosition])

  const handleTimeUpdate = () => {
    if (videoRef.current && onTimeUpdate) {
      onTimeUpdate(Math.floor(videoRef.current.currentTime))
    }
  }

  if (loading) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-white animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 text-red-400" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative aspect-video bg-black rounded-lg overflow-hidden select-none"
      onContextMenu={e => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={url!}
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
      />
      {/* Watermark overlay to discourage screen recording */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
        <div className="text-white text-6xl font-bold rotate-[-30deg] select-none">
          <Lock className="h-24 w-24" />
        </div>
      </div>
    </div>
  )
}
