import { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/format'
import { Users, Shield, User, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Profile, UserIpLog } from '@/types/database'

export function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [ipLogs, setIpLogs] = useState<Record<string, UserIpLog[]>>({})
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setUsers(data || [])
        setLoading(false)
      })
  }, [])

  const loadIps = async (userId: string) => {
    const { data } = await supabase
      .from('user_ip_logs')
      .select('*')
      .eq('user_id', userId)
      .order('last_seen_at', { ascending: false })
    setIpLogs(prev => ({ ...prev, [userId]: data || [] }))
  }

  const toggleRole = async (user: Profile) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin'
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u))
    toast.success(`เปลี่ยนสิทธิ์เป็น ${newRole} แล้ว`)
  }

  const removeIp = async (logId: string, userId: string) => {
    await supabase.from('user_ip_logs').delete().eq('id', logId)
    toast.success('ลบ IP แล้ว')
    loadIps(userId)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">จัดการผู้ใช้</h1>

      <div className="space-y-3">
        {users.map(u => (
          <Card key={u.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                {u.role === 'admin' ? (
                  <Shield className="h-5 w-5 text-primary-600" />
                ) : (
                  <User className="h-5 w-5 text-primary-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{u.full_name || 'ไม่มีชื่อ'}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <p className="text-sm text-gray-400 hidden sm:block">{formatDateTime(u.created_at)}</p>
              <Badge variant={u.role === 'admin' ? 'info' : 'default'}>{u.role}</Badge>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleRole(u)}>
                  <Shield className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  if (expandedUser === u.id) {
                    setExpandedUser(null)
                  } else {
                    setExpandedUser(u.id)
                    loadIps(u.id)
                  }
                }}>
                  IP Logs
                </Button>
              </div>
            </div>

            {expandedUser === u.id && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">IP ที่เข้าใช้งาน</h4>
                {(ipLogs[u.id] || []).length === 0 ? (
                  <p className="text-sm text-gray-400">ไม่มีข้อมูล</p>
                ) : (
                  <div className="space-y-1">
                    {(ipLogs[u.id] || []).map(log => (
                      <div key={log.id} className="flex items-center gap-3 text-sm p-2 bg-gray-50 rounded">
                        <code className="text-xs bg-gray-200 px-2 py-0.5 rounded">{log.ip_address}</code>
                        <span className="text-gray-500 text-xs">{formatDateTime(log.last_seen_at)}</span>
                        <span className="text-gray-400 text-xs truncate flex-1">{log.user_agent}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeIp(log.id, u.id)}>
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
