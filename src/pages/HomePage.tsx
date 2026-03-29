import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { CourseCard } from '@/components/course/CourseCard'
import { Button } from '@/components/ui/Button'
import { SITE_NAME, SITE_DESCRIPTION } from '@/config/constants'
import {
  GraduationCap, Code2, Zap, Users, ArrowRight,
  CheckCircle2, Play, Shield
} from 'lucide-react'
import type { Course } from '@/types/database'

export function HomePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .limit(6)
      .then(({ data }) => {
        setCourses(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxam0tMTgtNFYyNEgzNnYySDEwSDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium">เรียนรู้ทักษะใหม่ พัฒนาตัวเอง</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {SITE_NAME}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {SITE_DESCRIPTION}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/courses">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 shadow-lg">
                  <Play className="h-5 w-5" />
                  ดูหลักสูตรทั้งหมด
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  สมัครเรียนฟรี
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">ทำไมต้องเรียนกับเรา?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">หลักสูตรที่ออกแบบมาเพื่อให้คุณใช้งานได้จริง</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Code2, title: 'เนื้อหาอัปเดต', desc: 'เนื้อหาคอร์สอัปเดตตามเทคโนโลยีล่าสุด พร้อมตัวอย่างจริง' },
              { icon: Users, title: 'เรียนตามจังหวะ', desc: 'เรียนได้ทุกที่ทุกเวลา ดูวิดีโอซ้ำได้ไม่จำกัด' },
              { icon: Shield, title: 'แบบทดสอบ', desc: 'ทดสอบความเข้าใจหลังเรียนจบแต่ละบท พร้อมเฉลย' },
            ].map((f, i) => (
              <div key={i} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary-100 mb-4">
                  <f.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Listing */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">หลักสูตรยอดนิยม</h2>
              <p className="text-gray-500">เลือกหลักสูตรที่เหมาะกับคุณ</p>
            </div>
            <Link to="/courses">
              <Button variant="outline">
                ดูทั้งหมด
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีหลักสูตร</h3>
              <p className="text-gray-500">กำลังจะมาเร็วๆ นี้!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">พร้อมเริ่มเรียนรู้แล้วหรือยัง?</h2>
          <p className="text-white/80 mb-8">สมัครสมาชิกวันนี้ เริ่มต้นเส้นทางการเรียนรู้ของคุณ</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
                <CheckCircle2 className="h-5 w-5" />
                สมัครเรียนเลย
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
