import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { GraduationCap, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

export function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('รหัสผ่านไม่ตรงกัน')
      return
    }
    if (password.length < 6) {
      toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) {
      toast.error('สมัครไม่สำเร็จ', { description: error.message })
    } else {
      toast.success('สมัครสำเร็จ!', { description: 'กรุณายืนยันอีเมลของคุณ' })
      navigate('/login')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary-100 mb-4">
            <GraduationCap className="h-7 w-7 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">สมัครสมาชิก</h1>
          <p className="text-sm text-gray-500 mt-1">สร้างบัญชีเพื่อเริ่มเรียนรู้</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ชื่อ-นามสกุล"
            placeholder="สมชาย ใจดี"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
          <Input
            label="อีเมล"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="รหัสผ่าน"
            type="password"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Input
            label="ยืนยันรหัสผ่าน"
            type="password"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            <UserPlus className="h-4 w-4" />
            สมัครสมาชิก
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
            เข้าสู่ระบบ
          </Link>
        </p>
      </Card>
    </div>
  )
}
