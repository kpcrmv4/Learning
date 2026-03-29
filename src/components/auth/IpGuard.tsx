import type { ReactNode } from 'react'
import { useIpCheck } from '@/hooks/useIpCheck'
import { ShieldAlert, Loader2 } from 'lucide-react'
import { MAX_IPS_PER_USER } from '@/config/constants'

export function IpGuard({ children }: { children: ReactNode }) {
  const { blocked, checking } = useIpCheck()

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (blocked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">ไม่สามารถเข้าถึงได้</h2>
          <p className="text-gray-500">
            บัญชีของคุณถูกใช้งานจาก {MAX_IPS_PER_USER} อุปกรณ์แล้ว
            กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตอุปกรณ์
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
