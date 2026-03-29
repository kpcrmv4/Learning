import { QRCodeSVG } from 'qrcode.react'
import generatePayload from 'promptpay-qr'
import { PROMPTPAY_ID, PROMPTPAY_NAME } from '@/config/constants'
import { formatPrice } from '@/lib/format'
import { Smartphone, Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface PromptPayQRProps {
  amount: number
}

export function PromptPayQR({ amount }: PromptPayQRProps) {
  const [copied, setCopied] = useState(false)
  const payload = generatePayload(PROMPTPAY_ID, { amount })

  const copyId = () => {
    navigator.clipboard.writeText(PROMPTPAY_ID)
    setCopied(true)
    toast.success('คัดลอก PromptPay ID แล้ว')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-full px-4 py-2">
        <Smartphone className="h-4 w-4" />
        สแกน QR Code ด้วยแอปธนาคาร
      </div>

      <div className="bg-white p-6 rounded-xl border-2 border-primary-200 inline-block">
        <QRCodeSVG value={payload} size={220} level="M" />
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-bold text-primary-600">{formatPrice(amount)}</p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>PromptPay: {PROMPTPAY_ID}</span>
          <button onClick={copyId} className="p-1 rounded hover:bg-gray-100 cursor-pointer">
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        {PROMPTPAY_NAME && (
          <p className="text-sm text-gray-500">ชื่อบัญชี: {PROMPTPAY_NAME}</p>
        )}
      </div>
    </div>
  )
}
