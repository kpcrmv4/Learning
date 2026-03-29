import { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { BookOpen, Users, ShoppingCart, DollarSign } from 'lucide-react'
import { formatPrice } from '@/lib/format'

interface Stats {
  courses: number
  users: number
  orders: number
  revenue: number
  pendingOrders: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ courses: 0, users: 0, orders: 0, revenue: 0, pendingOrders: 0 })

  useEffect(() => {
    async function load() {
      const [courses, users, orders, pendingOrders] = await Promise.all([
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('amount').eq('status', 'paid'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ])

      const revenue = (orders.data || []).reduce((sum, o) => sum + Number(o.amount), 0)

      setStats({
        courses: courses.count || 0,
        users: users.count || 0,
        orders: (orders.data || []).length,
        revenue,
        pendingOrders: pendingOrders.count || 0,
      })
    }
    load()
  }, [])

  const cards = [
    { icon: BookOpen, label: 'หลักสูตร', value: stats.courses, color: 'bg-blue-50 text-blue-600' },
    { icon: Users, label: 'ผู้ใช้', value: stats.users, color: 'bg-green-50 text-green-600' },
    { icon: ShoppingCart, label: 'รอตรวจสอบ', value: stats.pendingOrders, color: 'bg-yellow-50 text-yellow-600' },
    { icon: DollarSign, label: 'รายได้รวม', value: formatPrice(stats.revenue), color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">แดชบอร์ด</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${c.color}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
