import { useEffect, useState } from 'react'
import { supabase } from '@/config/supabase'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/format'
import { slugify } from '@/lib/format'
import { COURSE_CATEGORIES, DIFFICULTY_LEVELS } from '@/config/constants'
import { FileUpload } from '@/components/ui/FileUpload'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, BookOpen,
  GripVertical, Video, FileQuestion
} from 'lucide-react'
import { toast } from 'sonner'
import type { Course, Lesson, Quiz, QuizQuestion } from '@/types/database'

function LessonForm({
  courseId,
  lesson,
  onSubmit,
  onCancel,
}: {
  courseId: string
  lesson?: Lesson
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}) {
  const [videoPath, setVideoPath] = useState(lesson?.video_storage_path || '')
  const courseSlug = courseId.substring(0, 8)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="ชื่อบทเรียน" name="title" defaultValue={lesson?.title || ''} required />
      <Textarea label="คำอธิบาย" name="description" defaultValue={lesson?.description || ''} />

      {/* Video Upload */}
      <div>
        <FileUpload
          bucket="videos"
          folder={`courses/${courseSlug}`}
          accept="video/mp4,video/webm,video/quicktime,video/*"
          currentPath={videoPath}
          label="อัปโหลดวิดีโอ"
          icon="video"
          maxSizeMB={500}
          onUploaded={(path) => setVideoPath(path)}
          onRemoved={() => setVideoPath('')}
        />
        {/* Hidden input to carry the value in FormData */}
        <input type="hidden" name="video_storage_path" value={videoPath} />
        {!videoPath && (
          <Input
            className="mt-2"
            value={videoPath}
            onChange={e => setVideoPath(e.target.value)}
            placeholder="หรือพิมพ์ Storage Path เช่น courses/xxx/lesson-1.mp4"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="ระยะเวลา (นาที)" name="duration_minutes" type="number" defaultValue={lesson?.duration_minutes ?? ''} />
        <Input label="ลำดับ" name="sort_order" type="number" defaultValue={lesson?.sort_order ?? 0} />
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_preview" defaultChecked={lesson?.is_preview} className="rounded" />
        <span className="text-sm text-gray-700">ดูตัวอย่างฟรี</span>
      </label>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>ยกเลิก</Button>
        <Button type="submit">บันทึก</Button>
      </div>
    </form>
  )
}

export function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [editCourse, setEditCourse] = useState<Partial<Course> | null>(null)
  const [saving, setSaving] = useState(false)
  const [lessonModal, setLessonModal] = useState<{ courseId: string; lesson?: Lesson } | null>(null)
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({})
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
  // Quiz state
  const [quizModal, setQuizModal] = useState<{ courseId: string; lessonId?: string; quiz?: Quiz } | null>(null)
  const [questionModal, setQuestionModal] = useState<{ quizId: string; question?: QuizQuestion } | null>(null)
  const [quizzes, setQuizzes] = useState<Record<string, Quiz[]>>({})
  const [quizQuestions, setQuizQuestions] = useState<Record<string, QuizQuestion[]>>({})

  const loadCourses = async () => {
    const { data } = await supabase.from('courses').select('*').order('sort_order')
    setCourses(data || [])
  }

  const loadLessons = async (courseId: string) => {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('sort_order')
    setLessons(prev => ({ ...prev, [courseId]: data || [] }))

    // Also load quizzes
    const { data: qz } = await supabase
      .from('quizzes')
      .select('*')
      .eq('course_id', courseId)
      .order('sort_order')
    setQuizzes(prev => ({ ...prev, [courseId]: qz || [] }))
  }

  const loadQuizQuestions = async (quizId: string) => {
    const { data } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('sort_order')
    setQuizQuestions(prev => ({ ...prev, [quizId]: data || [] }))
  }

  useEffect(() => { loadCourses() }, [])

  const handleSaveCourse = async () => {
    if (!editCourse?.title) { toast.error('กรุณากรอกชื่อหลักสูตร'); return }
    setSaving(true)

    const courseData = {
      title: editCourse.title,
      slug: editCourse.slug || slugify(editCourse.title),
      description: editCourse.description || null,
      long_description: editCourse.long_description || null,
      price: Number(editCourse.price) || 0,
      original_price: editCourse.original_price ? Number(editCourse.original_price) : null,
      category: editCourse.category || null,
      difficulty: editCourse.difficulty || null,
      is_published: editCourse.is_published ?? false,
      thumbnail_url: editCourse.thumbnail_url || null,
      total_duration_minutes: editCourse.total_duration_minutes ? Number(editCourse.total_duration_minutes) : null,
    }

    if (editCourse.id) {
      const { error } = await supabase.from('courses').update(courseData).eq('id', editCourse.id)
      if (error) toast.error('อัปเดตไม่สำเร็จ')
      else toast.success('อัปเดตหลักสูตรแล้ว')
    } else {
      const { error } = await supabase.from('courses').insert(courseData)
      if (error) toast.error('สร้างไม่สำเร็จ: ' + error.message)
      else toast.success('สร้างหลักสูตรแล้ว')
    }
    setSaving(false)
    setEditCourse(null)
    loadCourses()
  }

  const togglePublish = async (course: Course) => {
    await supabase.from('courses').update({ is_published: !course.is_published }).eq('id', course.id)
    toast.success(course.is_published ? 'ซ่อนหลักสูตรแล้ว' : 'เผยแพร่หลักสูตรแล้ว')
    loadCourses()
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('ต้องการลบหลักสูตรนี้?')) return
    await supabase.from('courses').delete().eq('id', id)
    toast.success('ลบหลักสูตรแล้ว')
    loadCourses()
  }

  const handleSaveLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!lessonModal) return
    const form = new FormData(e.currentTarget)
    const data = {
      course_id: lessonModal.courseId,
      title: form.get('title') as string,
      description: form.get('description') as string || null,
      video_storage_path: form.get('video_storage_path') as string || null,
      duration_minutes: Number(form.get('duration_minutes')) || null,
      sort_order: Number(form.get('sort_order')) || 0,
      is_preview: form.get('is_preview') === 'on',
    }

    if (lessonModal.lesson?.id) {
      await supabase.from('lessons').update(data).eq('id', lessonModal.lesson.id)
      toast.success('อัปเดตบทเรียนแล้ว')
    } else {
      await supabase.from('lessons').insert(data)
      toast.success('สร้างบทเรียนแล้ว')
    }
    setLessonModal(null)
    loadLessons(lessonModal.courseId)
  }

  const deleteLesson = async (lessonId: string, courseId: string) => {
    if (!confirm('ต้องการลบบทเรียนนี้?')) return
    await supabase.from('lessons').delete().eq('id', lessonId)
    toast.success('ลบบทเรียนแล้ว')
    loadLessons(courseId)
  }

  const handleSaveQuiz = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!quizModal) return
    const form = new FormData(e.currentTarget)
    const data = {
      course_id: quizModal.courseId,
      lesson_id: quizModal.lessonId || null,
      title: form.get('title') as string,
      passing_score: Number(form.get('passing_score')) || 70,
      sort_order: Number(form.get('sort_order')) || 0,
    }
    if (quizModal.quiz?.id) {
      await supabase.from('quizzes').update(data).eq('id', quizModal.quiz.id)
      toast.success('อัปเดตแบบทดสอบแล้ว')
    } else {
      await supabase.from('quizzes').insert(data)
      toast.success('สร้างแบบทดสอบแล้ว')
    }
    setQuizModal(null)
    loadLessons(quizModal.courseId)
  }

  const handleSaveQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!questionModal) return
    const form = new FormData(e.currentTarget)
    const optionsRaw = form.get('options') as string
    let options
    try {
      options = JSON.parse(optionsRaw)
    } catch {
      toast.error('รูปแบบ options ไม่ถูกต้อง (ต้องเป็น JSON)'); return
    }
    const data = {
      quiz_id: questionModal.quizId,
      question_text: form.get('question_text') as string,
      question_type: 'multiple_choice' as const,
      options,
      explanation: form.get('explanation') as string || null,
      sort_order: Number(form.get('sort_order')) || 0,
    }
    if (questionModal.question?.id) {
      await supabase.from('quiz_questions').update(data).eq('id', questionModal.question.id)
      toast.success('อัปเดตคำถามแล้ว')
    } else {
      await supabase.from('quiz_questions').insert(data)
      toast.success('สร้างคำถามแล้ว')
    }
    setQuestionModal(null)
    loadQuizQuestions(questionModal.quizId)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">จัดการหลักสูตร</h1>
        <Button onClick={() => setEditCourse({ is_published: false, price: 0 })}>
          <Plus className="h-4 w-4" /> สร้างหลักสูตร
        </Button>
      </div>

      <div className="space-y-3">
        {courses.map(course => (
          <Card key={course.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-24 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt="" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <BookOpen className="h-6 w-6 text-primary-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                  <Badge variant={course.is_published ? 'success' : 'default'}>
                    {course.is_published ? 'เผยแพร่แล้ว' : 'แบบร่าง'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{formatPrice(course.price)} &middot; {course.category || 'ไม่มีหมวดหมู่'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => {
                  if (expandedCourse === course.id) {
                    setExpandedCourse(null)
                  } else {
                    setExpandedCourse(course.id)
                    loadLessons(course.id)
                  }
                }}>
                  <Video className="h-4 w-4" /> บทเรียน
                </Button>
                <Button variant="ghost" size="sm" onClick={() => togglePublish(course)}>
                  {course.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditCourse(course)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteCourse(course.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>

            {/* Expanded lessons */}
            {expandedCourse === course.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm text-gray-700">บทเรียน</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setQuizModal({ courseId: course.id })}>
                      <FileQuestion className="h-3 w-3" /> เพิ่มแบบทดสอบ
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setLessonModal({ courseId: course.id })}>
                      <Plus className="h-3 w-3" /> เพิ่มบทเรียน
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {(lessons[course.id] || []).map((lesson, idx) => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500 w-6">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
                        <p className="text-xs text-gray-500">
                          {lesson.video_storage_path ? '🎬 มีวิดีโอ' : '📝 ไม่มีวิดีโอ'}
                          {lesson.is_preview && ' · ดูฟรี'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setQuizModal({ courseId: course.id, lessonId: lesson.id })}>
                        <FileQuestion className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setLessonModal({ courseId: course.id, lesson })}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteLesson(lesson.id, course.id)}>
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {(!lessons[course.id] || lessons[course.id].length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-4">ยังไม่มีบทเรียน</p>
                  )}
                </div>

                {/* Quizzes section */}
                {(quizzes[course.id] || []).length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">แบบทดสอบ</h4>
                    {(quizzes[course.id] || []).map(quiz => (
                      <div key={quiz.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg mb-2">
                        <FileQuestion className="h-4 w-4 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{quiz.title}</p>
                          <p className="text-xs text-gray-500">เกณฑ์ผ่าน: {quiz.passing_score}%</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => {
                          loadQuizQuestions(quiz.id)
                          setQuestionModal({ quizId: quiz.id })
                        }}>
                          <Plus className="h-3 w-3" /> คำถาม
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setQuizModal({ courseId: course.id, quiz })}>
                          <Pencil className="h-3 w-3" />
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

      {/* Course Modal */}
      <Modal open={!!editCourse} onClose={() => setEditCourse(null)} title={editCourse?.id ? 'แก้ไขหลักสูตร' : 'สร้างหลักสูตร'} size="lg">
        {editCourse && (
          <div className="space-y-4">
            <Input label="ชื่อหลักสูตร" value={editCourse.title || ''} onChange={e => setEditCourse(prev => ({ ...prev!, title: e.target.value, slug: slugify(e.target.value) }))} />
            <Input label="Slug" value={editCourse.slug || ''} onChange={e => setEditCourse(prev => ({ ...prev!, slug: e.target.value }))} />
            <Textarea label="คำอธิบายสั้น" value={editCourse.description || ''} onChange={e => setEditCourse(prev => ({ ...prev!, description: e.target.value }))} />
            <Textarea label="รายละเอียดเต็ม" value={editCourse.long_description || ''} onChange={e => setEditCourse(prev => ({ ...prev!, long_description: e.target.value }))} rows={5} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="ราคา (บาท)" type="number" value={editCourse.price ?? 0} onChange={e => setEditCourse(prev => ({ ...prev!, price: Number(e.target.value) }))} />
              <Input label="ราคาเดิม (บาท)" type="number" value={editCourse.original_price ?? ''} onChange={e => setEditCourse(prev => ({ ...prev!, original_price: Number(e.target.value) || null }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="หมวดหมู่" options={COURSE_CATEGORIES.map(c => ({ value: c.value, label: c.label }))} value={editCourse.category || ''} onChange={e => setEditCourse(prev => ({ ...prev!, category: e.target.value }))} placeholder="เลือกหมวดหมู่" />
              <Select label="ระดับ" options={DIFFICULTY_LEVELS.map(d => ({ value: d.value, label: d.label }))} value={editCourse.difficulty || ''} onChange={e => setEditCourse(prev => ({ ...prev!, difficulty: e.target.value as Course['difficulty'] }))} placeholder="เลือกระดับ" />
            </div>
            {/* Thumbnail upload */}
            <div>
              <FileUpload
                bucket="thumbnails"
                folder={`courses/${editCourse.slug || 'new'}`}
                accept="image/*"
                currentPath=""
                label="อัปโหลดรูปปก"
                icon="image"
                maxSizeMB={10}
                onUploaded={(_path, publicUrl) => {
                  if (publicUrl) setEditCourse(prev => ({ ...prev!, thumbnail_url: publicUrl }))
                }}
                onRemoved={() => setEditCourse(prev => ({ ...prev!, thumbnail_url: null }))}
              />
              {editCourse.thumbnail_url && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={editCourse.thumbnail_url} alt="Preview" className="h-16 w-24 object-cover rounded-lg border border-gray-200" />
                  <Input
                    label=""
                    value={editCourse.thumbnail_url}
                    onChange={e => setEditCourse(prev => ({ ...prev!, thumbnail_url: e.target.value }))}
                    placeholder="หรือวาง URL โดยตรง"
                    className="flex-1"
                  />
                </div>
              )}
              {!editCourse.thumbnail_url && (
                <Input
                  className="mt-2"
                  value=""
                  onChange={e => setEditCourse(prev => ({ ...prev!, thumbnail_url: e.target.value }))}
                  placeholder="หรือวาง URL รูปปกโดยตรง"
                />
              )}
            </div>
            <Input label="ระยะเวลารวม (นาที)" type="number" value={editCourse.total_duration_minutes ?? ''} onChange={e => setEditCourse(prev => ({ ...prev!, total_duration_minutes: Number(e.target.value) || null }))} />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={editCourse.is_published ?? false} onChange={e => setEditCourse(prev => ({ ...prev!, is_published: e.target.checked }))} className="rounded" />
              <span className="text-sm text-gray-700">เผยแพร่หลักสูตร</span>
            </label>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditCourse(null)}>ยกเลิก</Button>
              <Button onClick={handleSaveCourse} loading={saving}>บันทึก</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Lesson Modal */}
      <Modal open={!!lessonModal} onClose={() => setLessonModal(null)} title={lessonModal?.lesson ? 'แก้ไขบทเรียน' : 'เพิ่มบทเรียน'} size="lg">
        {lessonModal && (
          <LessonForm
            key={lessonModal.lesson?.id || 'new'}
            courseId={lessonModal.courseId}
            lesson={lessonModal.lesson}
            onSubmit={handleSaveLesson}
            onCancel={() => setLessonModal(null)}
          />
        )}
      </Modal>

      {/* Quiz Modal */}
      <Modal open={!!quizModal} onClose={() => setQuizModal(null)} title={quizModal?.quiz ? 'แก้ไขแบบทดสอบ' : 'สร้างแบบทดสอบ'}>
        {quizModal && (
          <form onSubmit={handleSaveQuiz} className="space-y-4">
            <Input label="ชื่อแบบทดสอบ" name="title" defaultValue={quizModal.quiz?.title || ''} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="เกณฑ์ผ่าน (%)" name="passing_score" type="number" defaultValue={quizModal.quiz?.passing_score ?? 70} />
              <Input label="ลำดับ" name="sort_order" type="number" defaultValue={quizModal.quiz?.sort_order ?? 0} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={() => setQuizModal(null)}>ยกเลิก</Button>
              <Button type="submit">บันทึก</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Question Modal */}
      <Modal open={!!questionModal} onClose={() => setQuestionModal(null)} title="จัดการคำถาม" size="lg">
        {questionModal && (
          <div>
            {/* Existing questions */}
            {(quizQuestions[questionModal.quizId] || []).map((q, idx) => (
              <div key={q.id} className="p-3 bg-gray-50 rounded-lg mb-2">
                <p className="text-sm font-medium">{idx + 1}. {q.question_text}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {q.options.map(o => (
                    <Badge key={o.value} variant={o.is_correct ? 'success' : 'default'} className="text-xs">
                      {o.label}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}

            <hr className="my-4" />
            <h4 className="font-medium text-sm mb-3">เพิ่มคำถามใหม่</h4>
            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <Textarea label="คำถาม" name="question_text" required />
              <Textarea
                label='ตัวเลือก (JSON)'
                name="options"
                placeholder='[{"label": "ตัวเลือก 1", "value": "a", "is_correct": true}, {"label": "ตัวเลือก 2", "value": "b", "is_correct": false}]'
                rows={4}
                required
              />
              <Input label="คำอธิบาย" name="explanation" />
              <Input label="ลำดับ" name="sort_order" type="number" defaultValue="0" />
              <div className="flex justify-end gap-3">
                <Button type="submit">เพิ่มคำถาม</Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
