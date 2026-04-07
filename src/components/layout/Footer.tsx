import { Mail, Heart } from 'lucide-react'
import { SITE_NAME, SITE_LOGO } from '@/config/constants'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <img src={SITE_LOGO} alt={SITE_NAME} className="h-5 w-5 rounded" />
            <span className="font-semibold">{SITE_NAME}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="mailto:contact@coursehub.com" className="flex items-center gap-1 hover:text-gray-700 transition-colors">
              <Mail className="h-4 w-4" />
              ติดต่อเรา
            </a>
          </div>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            สร้างด้วย <Heart className="h-3.5 w-3.5 text-red-400" /> &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  )
}
