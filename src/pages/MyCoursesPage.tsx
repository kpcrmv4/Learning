import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatPrice, formatDate } from '@/lib/format'
import { BookOpen, Play, Clock, ShoppingCart, Loader2 } from 'lucide-react'
import type { EnrollmentWithCourse, OrderWithCourse } from '@/types/database'

export function MyCoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([])
  const [pendingOrders, setPendingOrders] = useState<OrderWithCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    async function load() {
      const [{ data: enr }, { data: orders }] = await Promise.all([
        supabase
          .from('enrollments')
          .select('*, course:courses(*)')
          .eq('user_id', user!.id)
          .order('enrolled_at', { ascending: false }),
        supabase
          .from('orders')
          .select('*, course:courses(*)')
          .eq('user_id', user!.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false }),
      ])
      setEnrollments((enr as unknown as EnrollmentWithCourse[]) || [])
      setPendingOrders((orders as unknown as OrderWithCourse[]) || [])
      setLoading(false)
    }
    load()
  }, [user, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">คอร์สของฉัน</h1>
      <p className="text-gray-500 mb-8">คอร์สที่คุณลงทะเบียนแล้ว</p>

      {/* Pending orders */}
      {pendingOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            รอตรวจสอบการชำระเงิน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.map(order => (
              <Card key={order.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{order.course.title}</p>
                    <p className="text-sm text-gray-500">{formatPrice(order.amount)}</p>
                    <Badge variant="warning" className="mt-1">รอตรวจสอบ</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Enrolled courses */}
      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map(enr => (
            <Link key={enr.id} to={`/learn/${enr.course.slug}`}>
              <Card hover className="h-full">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative group">
                  {enr.course.thumbnail_url ? (
                    <img src={enr.course.thumbnail_url} alt={enr.course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="h-12 w-12 text-primary-400" />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">{enr.course.title}</h3>
                  <p className="text-xs text-gray-500">ลงทะเบียนเมื่อ {formatDate(enr.enrolled_at)}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีคอร์ส</h3>
          <p className="text-gray-500 mb-4">เริ่มต้นเรียนรู้โดยเลือกคอร์สที่สนใจ</p>
          <Link to="/courses">
            <Button>ดูหลักสูตรทั้งหมด</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
