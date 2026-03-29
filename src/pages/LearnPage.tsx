import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { VideoPlayer } from '@/components/video/VideoPlayer'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'
import { IpGuard } from '@/components/auth/IpGuard'
import { Button } from '@/components/ui/Button'
import {
  Play, CheckCircle2, Circle, ArrowLeft, BookOpen,
  FileQuestion, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import type { Course, Lesson, LessonProgress, Quiz, QuizQuestion } from '@/types/database'

export function LearnPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({})
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    async function load() {
      if (!user) { navigate('/login'); return }

      const { data: c } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug!)
        .single()
      if (!c) { navigate('/courses'); return }

      // Check enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', c.id)
        .single()

      if (!enrollment) {
        toast.error('คุณยังไม่ได้ลงทะเบียนคอร์สนี้')
        navigate(`/courses/${c.slug}`)
        return
      }

      setCourse(c)

      const { data: ls } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', c.id)
        .order('sort_order')
      setLessons(ls || [])
      if (ls?.[0]) setCurrentLesson(ls[0])

      // Load progress
      const { data: progs } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('lesson_id', (ls || []).map(l => l.id))
      const progressMap: Record<string, LessonProgress> = {}
      progs?.forEach(p => { progressMap[p.lesson_id] = p })
      setProgress(progressMap)

      // Load quizzes for this course
      const { data: qz } = await supabase
        .from('quizzes')
        .select('*')
        .eq('course_id', c.id)
      setQuizzes(qz || [])

      setLoading(false)
    }
    load()
  }, [slug, user, navigate])

  const loadQuiz = async (quiz: Quiz) => {
    const { data } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('sort_order')
    setQuizQuestions(data || [])
    setShowQuiz(true)
  }

  const saveProgress = useCallback(async (seconds: number) => {
    if (!user || !currentLesson) return
    await supabase.from('lesson_progress').upsert({
      user_id: user.id,
      lesson_id: currentLesson.id,
      last_position_seconds: seconds,
      is_completed: false,
    }, { onConflict: 'user_id,lesson_id' })
  }, [user, currentLesson])

  const markComplete = async () => {
    if (!user || !currentLesson) return
    await supabase.from('lesson_progress').upsert({
      user_id: user.id,
      lesson_id: currentLesson.id,
      is_completed: true,
      last_position_seconds: 0,
    }, { onConflict: 'user_id,lesson_id' })
    setProgress(prev => ({
      ...prev,
      [currentLesson.id]: { ...prev[currentLesson.id], is_completed: true } as LessonProgress,
    }))
    toast.success('เรียนจบบทนี้แล้ว!')
  }

  const currentIdx = lessons.findIndex(l => l.id === currentLesson?.id)
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null
  const lessonQuiz = quizzes.find(q => q.lesson_id === currentLesson?.id)
  const completedCount = Object.values(progress).filter(p => p.is_completed).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <IpGuard>
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden flex-shrink-0`}>
        <div className="w-80 h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button onClick={() => navigate(`/courses/${slug}`)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4" /> กลับ
            </button>
            <h2 className="font-semibold text-gray-900 truncate">{course?.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{completedCount}/{lessons.length}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {lessons.map((lesson, idx) => {
              const isActive = currentLesson?.id === lesson.id
              const isComplete = progress[lesson.id]?.is_completed
              return (
                <button
                  key={lesson.id}
                  onClick={() => { setCurrentLesson(lesson); setShowQuiz(false) }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b border-gray-100 transition-colors cursor-pointer
                    ${isActive ? 'bg-primary-50 border-l-2 border-l-primary-500' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : isActive ? (
                      <Play className="h-5 w-5 text-primary-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${isActive ? 'font-medium text-primary-700' : 'text-gray-700'}`}>
                      {idx + 1}. {lesson.title}
                    </p>
                    {lesson.duration_minutes && (
                      <p className="text-xs text-gray-400">{lesson.duration_minutes} นาที</p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Toggle sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-0 top-1/2 z-10 bg-white border border-gray-200 rounded-r-lg p-1 shadow-sm hover:bg-gray-50 cursor-pointer"
        style={{ left: sidebarOpen ? '320px' : '0' }}
      >
        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {currentLesson && !showQuiz && (
            <div className="space-y-6">
              {currentLesson.video_storage_path ? (
                <VideoPlayer
                  storagePath={currentLesson.video_storage_path}
                  lastPosition={progress[currentLesson.id]?.last_position_seconds}
                  onTimeUpdate={saveProgress}
                  onEnded={markComplete}
                />
              ) : (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-gray-300" />
                </div>
              )}

              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h1>
                {currentLesson.description && (
                  <p className="text-gray-600 whitespace-pre-wrap">{currentLesson.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {!progress[currentLesson.id]?.is_completed && (
                  <Button variant="outline" onClick={markComplete}>
                    <CheckCircle2 className="h-4 w-4" /> เรียนจบบทนี้
                  </Button>
                )}
                {lessonQuiz && (
                  <Button variant="secondary" onClick={() => loadQuiz(lessonQuiz)}>
                    <FileQuestion className="h-4 w-4" /> ทำแบบทดสอบ
                  </Button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                {prevLesson ? (
                  <Button variant="ghost" onClick={() => { setCurrentLesson(prevLesson); setShowQuiz(false) }}>
                    <ChevronLeft className="h-4 w-4" /> {prevLesson.title}
                  </Button>
                ) : <div />}
                {nextLesson ? (
                  <Button variant="ghost" onClick={() => { setCurrentLesson(nextLesson); setShowQuiz(false) }}>
                    {nextLesson.title} <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : <div />}
              </div>
            </div>
          )}

          {showQuiz && quizQuestions.length > 0 && (
            <div>
              <Button variant="ghost" onClick={() => setShowQuiz(false)} className="mb-4">
                <ArrowLeft className="h-4 w-4" /> กลับไปวิดีโอ
              </Button>
              <QuizPlayer
                quiz={quizzes.find(q => q.lesson_id === currentLesson?.id)!}
                questions={quizQuestions}
              />
            </div>
          )}
        </div>
      </div>
    </div>
    </IpGuard>
  )
}
