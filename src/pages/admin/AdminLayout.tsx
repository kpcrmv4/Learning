import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard, BookOpen, ShoppingCart, Users,
  FileQuestion, Settings, ArrowLeft
} from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'แดชบอร์ด', exact: true },
  { to: '/admin/courses', icon: BookOpen, label: 'จัดการหลักสูตร' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'คำสั่งซื้อ' },
  { to: '/admin/users', icon: Users, label: 'ผู้ใช้' },
]

export function AdminLayout() {
  const { isAdmin, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error('ไม่มีสิทธิ์เข้าถึง')
      navigate('/')
    }
  }, [isAdmin, loading, navigate])

  if (loading || !isAdmin) return null

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4" /> กลับหน้าเว็บ
          </Link>
          <h2 className="font-bold text-gray-900 mt-2">แผงควบคุม</h2>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
