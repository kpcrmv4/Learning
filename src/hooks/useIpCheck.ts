import { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { MAX_IPS_PER_USER } from '@/config/constants'

export function useIpCheck() {
  const { user } = useAuth()
  const [blocked, setBlocked] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkIp() {
      if (!user) { setChecking(false); return }

      try {
        // Get current IP via public API
        const res = await fetch('https://api.ipify.org?format=json')
        const { ip } = await res.json()

        // Count existing IPs for this user
        const { data: existingLogs } = await supabase
          .from('user_ip_logs')
          .select('*')
          .eq('user_id', user.id)

        const existingIps = existingLogs || []
        const alreadyExists = existingIps.some(log => log.ip_address === ip)

        if (alreadyExists) {
          // Update last_seen_at
          await supabase
            .from('user_ip_logs')
            .update({ last_seen_at: new Date().toISOString(), user_agent: navigator.userAgent })
            .eq('user_id', user.id)
            .eq('ip_address', ip)
          setBlocked(false)
        } else if (existingIps.length >= MAX_IPS_PER_USER) {
          setBlocked(true)
        } else {
          // Insert new IP
          await supabase.from('user_ip_logs').insert({
            user_id: user.id,
            ip_address: ip,
            user_agent: navigator.userAgent,
          })
          setBlocked(false)
        }
      } catch {
        // If IP check fails, allow access
        setBlocked(false)
      }
      setChecking(false)
    }
    checkIp()
  }, [user])

  return { blocked, checking }
}
