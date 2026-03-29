import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { GraduationCap, Menu, X, User, LogOut, LayoutDashboard, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { SITE_NAME } from '@/config/constants'

export function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <GraduationCap className="h-7 w-7" />
            {SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/courses" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              หลักสูตรทั้งหมด
            </Link>
            {user ? (
              <>
                <Link to="/my-courses" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  คอร์สของฉัน
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    แอดมิน
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.full_name || user.email}
                    </span>
                  </div>
                  <button onClick={handleSignOut} className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" title="ออกจากระบบ">
                    <LogOut className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  เข้าสู่ระบบ
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  สมัครสมาชิก
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <Link to="/courses" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
              หลักสูตรทั้งหมด
            </Link>
            {user ? (
              <>
                <Link to="/my-courses" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  คอร์สของฉัน
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                    จัดการระบบ
                  </Link>
                )}
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false) }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                  เข้าสู่ระบบ
                </Link>
                <Link to="/register" className="block px-3 py-2 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50" onClick={() => setMenuOpen(false)}>
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
