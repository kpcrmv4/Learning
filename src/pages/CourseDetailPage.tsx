import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { PromptPayQR } from '@/components/payment/PromptPayQR'
import { formatPrice, formatDuration } from '@/lib/format'
import { DIFFICULTY_LEVELS } from '@/config/constants'
import {
  Clock, BookOpen, Signal, Play, Lock, ShoppingCart,
  Upload, Loader2, ArrowLeft, Eye
} from 'lucide-react'
import { toast } from 'sonner'
import type { Course, Lesson, Enrollment } from '@/types/database'

export function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [orderPending, setOrderPending] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: c } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug!)
        .eq('is_published', true)
        .single()

      if (!c) { setLoading(false); return }
      setCourse(c)

      const { data: ls } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', c.id)
        .order('sort_order')
      setLessons(ls || [])

      if (user) {
        const { data: e } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', c.id)
          .single()
        setEnrollment(e)

        // Check if there's a pending order
        const { data: o } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', c.id)
          .eq('status', 'pending')
          .single()
        setOrderPending(!!o)
      }
      setLoading(false)
    }
    load()
  }, [slug, user])

  const handleBuy = async () => {
    if (!user) {
      toast.error('กรุณาเข้าสู่ระบบก่อนซื้อ')
      navigate('/login')
      return
    }
    setShowPayment(true)
  }

  const handleUploadSlip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user || !course) return
    setUploading(true)

    const file = e.target.files[0]
    const ext = file.name.split('.').pop()
    const path = `slips/${user.id}/${course.id}_${Date.now()}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('payment-slips')
      .upload(path, file)

    if (uploadErr) {
      toast.error('อัปโหลดสลิปไม่สำเร็จ')
      setUploading(false)
      return
    }

    const { error: orderErr } = await supabase.from('orders').insert({
      user_id: user.id,
      course_id: course.id,
      amount: course.price,
      status: 'pending',
      payment_method: 'promptpay',
      slip_image_path: path,
    })

    if (orderErr) {
      toast.error('สร้างคำสั่งซื้อไม่สำเร็จ')
    } else {
      toast.success('ส่งหลักฐานการชำระเงินแล้ว', {
        description: 'รอแอดมินตรวจสอบ จะได้รับสิทธิ์เข้าเรียนเร็วๆ นี้',
      })
      setOrderPending(true)
      setShowPayment(false)
    }
    setUploading(false)
  }

  const difficulty = DIFFICULTY_LEVELS.find(d => d.value === course?.difficulty)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบหลักสูตร</h2>
        <Button variant="outline" onClick={() => navigate('/courses')}>
          <ArrowLeft className="h-4 w-4" /> กลับหน้าหลักสูตร
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <button onClick={() => navigate('/courses')} className="flex items-center gap-1 text-white/70 hover:text-white mb-6 text-sm cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> กลับ
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                {difficulty && (
                  <Badge className="bg-white/20 text-white">
                    <Signal className="h-3 w-3 mr-1" />
                    {difficulty.label}
                  </Badge>
                )}
                {course.category && (
                  <Badge className="bg-white/20 text-white">{course.category}</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-white/80 text-lg mb-6">{course.description}</p>
              <div className="flex items-center gap-6 text-sm text-white/70">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" /> {lessons.length} บทเรียน
                </span>
                {course.total_duration_minutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {formatDuration(course.total_duration_minutes)}
                  </span>
                )}
              </div>
            </div>

            {/* Price Card */}
            <div>
              <Card className="p-6 text-gray-900">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Play className="h-12 w-12 text-primary-400" />
                  )}
                </div>
                <div className="mb-4">
                  {course.original_price && course.original_price > course.price && (
                    <span className="text-sm text-gray-400 line-through mr-2">
                      {formatPrice(course.original_price)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-primary-600">
                    {course.price === 0 ? 'ฟรี' : formatPrice(course.price)}
                  </span>
                </div>

                {enrollment ? (
                  <Button className="w-full" size="lg" onClick={() => navigate(`/learn/${course.slug}`)}>
                    <Play className="h-5 w-5" /> เข้าเรียน
                  </Button>
                ) : orderPending ? (
                  <Button className="w-full" size="lg" disabled variant="secondary">
                    <Clock className="h-5 w-5" /> รอตรวจสอบการชำระเงิน
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" onClick={handleBuy}>
                    <ShoppingCart className="h-5 w-5" />
                    {course.price === 0 ? 'ลงทะเบียนฟรี' : 'ซื้อคอร์สนี้'}
                  </Button>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {course.long_description && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">รายละเอียดหลักสูตร</h2>
                <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-wrap">
                  {course.long_description}
                </div>
              </div>
            )}

            {/* Lessons */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">เนื้อหาหลักสูตร</h2>
              <div className="space-y-2">
                {lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{lesson.title}</p>
                      {lesson.duration_minutes && (
                        <p className="text-xs text-gray-500">{formatDuration(lesson.duration_minutes)}</p>
                      )}
                    </div>
                    {lesson.is_preview ? (
                      <Badge variant="info">
                        <Eye className="h-3 w-3 mr-1" /> ดูฟรี
                      </Badge>
                    ) : !enrollment ? (
                      <Lock className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Play className="h-4 w-4 text-primary-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal open={showPayment} onClose={() => setShowPayment(false)} title="ชำระเงิน" size="md">
        <div className="space-y-6">
          <PromptPayQR amount={course.price} />
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-3">หลังโอนเงินแล้ว อัปโหลดสลิปการโอนเงิน:</p>
            <label className="block">
              <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">คลิกเพื่ออัปโหลดสลิป</span>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadSlip}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </Modal>
    </div>
  )
}
