import { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { formatPrice, formatDateTime } from '@/lib/format'
import { CheckCircle2, XCircle, Eye, Clock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Order, Course, Profile } from '@/types/database'

interface OrderFull extends Order {
  course: Course
  profile: Profile
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderFull[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('pending')
  const [slipPreview, setSlipPreview] = useState<string | null>(null)

  const loadOrders = async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('*, course:courses(*), profile:profiles(*)')
      .order('created_at', { ascending: false })

    if (filter) query = query.eq('status', filter)

    const { data } = await query
    setOrders((data as unknown as OrderFull[]) || [])
    setLoading(false)
  }

  useEffect(() => { loadOrders() }, [filter])

  const confirmOrder = async (order: OrderFull) => {
    // Create enrollment
    const { error: enrErr } = await supabase.from('enrollments').insert({
      user_id: order.user_id,
      course_id: order.course_id,
    })
    if (enrErr && !enrErr.message.includes('duplicate')) {
      toast.error('สร้าง enrollment ไม่สำเร็จ')
      return
    }

    // Update order status
    await supabase.from('orders').update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    }).eq('id', order.id)

    toast.success('ยืนยันการชำระเงินแล้ว', {
      description: `${order.profile.email} ได้รับสิทธิ์เข้าเรียน ${order.course.title}`,
    })
    loadOrders()
  }

  const rejectOrder = async (order: OrderFull) => {
    if (!confirm('ต้องการปฏิเสธคำสั่งซื้อนี้?')) return
    await supabase.from('orders').update({ status: 'failed' }).eq('id', order.id)
    toast.success('ปฏิเสธคำสั่งซื้อแล้ว')
    loadOrders()
  }

  const viewSlip = async (path: string) => {
    const { data } = await supabase.storage.from('payment-slips').createSignedUrl(path, 300)
    if (data) setSlipPreview(data.signedUrl)
  }

  const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'danger' | 'default' }> = {
    pending: { label: 'รอตรวจสอบ', variant: 'warning' },
    paid: { label: 'ชำระแล้ว', variant: 'success' },
    failed: { label: 'ปฏิเสธ', variant: 'danger' },
    refunded: { label: 'คืนเงิน', variant: 'default' },
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">คำสั่งซื้อ</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['pending', 'paid', 'failed', ''].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
              ${filter === f ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            {f === '' ? 'ทั้งหมด' : statusConfig[f]?.label || f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">ไม่มีคำสั่งซื้อ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <Card key={order.id} className="p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-medium text-gray-900">{order.profile?.full_name || order.profile?.email}</p>
                  <p className="text-sm text-gray-500">{order.profile?.email}</p>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-medium text-gray-900">{order.course?.title}</p>
                  <p className="text-sm text-gray-500">{formatPrice(order.amount)}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDateTime(order.created_at)}
                </div>
                <Badge variant={statusConfig[order.status]?.variant || 'default'}>
                  {statusConfig[order.status]?.label || order.status}
                </Badge>
                <div className="flex items-center gap-2">
                  {order.slip_image_path && (
                    <Button variant="ghost" size="sm" onClick={() => viewSlip(order.slip_image_path!)}>
                      <Eye className="h-4 w-4" /> สลิป
                    </Button>
                  )}
                  {order.status === 'pending' && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => confirmOrder(order)} className="text-green-600">
                        <CheckCircle2 className="h-4 w-4" /> ยืนยัน
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => rejectOrder(order)} className="text-red-600">
                        <XCircle className="h-4 w-4" /> ปฏิเสธ
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Slip Preview */}
      <Modal open={!!slipPreview} onClose={() => setSlipPreview(null)} title="สลิปการโอนเงิน">
        {slipPreview && (
          <div className="flex justify-center">
            <img src={slipPreview} alt="Payment slip" className="max-w-full max-h-[70vh] rounded-lg" />
          </div>
        )}
      </Modal>
    </div>
  )
}
