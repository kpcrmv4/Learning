import { useState } from 'react'
import { supabase } from '@/config/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle2, XCircle, Award, RotateCcw, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import type { Quiz, QuizQuestion } from '@/types/database'

interface QuizPlayerProps {
  quiz: Quiz
  questions: QuizQuestion[]
  onComplete?: (passed: boolean, score: number) => void
}

export function QuizPlayer({ quiz, questions, onComplete }: QuizPlayerProps) {
  const { user } = useAuth()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const current = questions[currentIdx]
  const selectedAnswer = answers[current?.id]
  const isAnswered = selectedAnswer !== undefined

  const handleSelect = (value: string) => {
    if (showExplanation) return
    setAnswers(prev => ({ ...prev, [current.id]: value }))
  }

  const handleCheck = () => {
    setShowExplanation(true)
  }

  const handleNext = () => {
    setShowExplanation(false)
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1)
    } else {
      submitQuiz()
    }
  }

  const submitQuiz = async () => {
    setSubmitting(true)
    let correct = 0
    questions.forEach(q => {
      const correctOpt = q.options.find(o => o.is_correct)
      if (correctOpt && answers[q.id] === correctOpt.value) correct++
    })
    const pct = Math.round((correct / questions.length) * 100)
    const passed = pct >= quiz.passing_score

    if (user) {
      await supabase.from('quiz_attempts').insert({
        quiz_id: quiz.id,
        user_id: user.id,
        score: pct,
        answers,
        passed,
      })
    }

    setScore(pct)
    setShowResult(true)
    setSubmitting(false)
    onComplete?.(passed, pct)
    toast(passed ? 'ผ่านแบบทดสอบ!' : 'ไม่ผ่าน ลองใหม่อีกครั้ง', {
      icon: passed ? '🎉' : '😔',
    })
  }

  const retry = () => {
    setAnswers({})
    setCurrentIdx(0)
    setShowResult(false)
    setShowExplanation(false)
    setScore(0)
  }

  if (showResult) {
    const passed = score >= quiz.passing_score
    return (
      <Card className="p-8 text-center">
        <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full mb-4 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
          <Award className={`h-10 w-10 ${passed ? 'text-green-600' : 'text-red-600'}`} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {passed ? 'ยินดีด้วย! คุณผ่านแล้ว' : 'ยังไม่ผ่าน'}
        </h3>
        <p className="text-gray-500 mb-2">{quiz.title}</p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Badge variant={passed ? 'success' : 'danger'} className="text-lg px-4 py-1">
            คะแนน: {score}%
          </Badge>
          <span className="text-sm text-gray-500">เกณฑ์ผ่าน: {quiz.passing_score}%</span>
        </div>
        {!passed && (
          <Button onClick={retry} variant="outline">
            <RotateCcw className="h-4 w-4" />
            ทำแบบทดสอบอีกครั้ง
          </Button>
        )}
      </Card>
    )
  }

  if (!current) return null

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
        <Badge>
          ข้อ {currentIdx + 1}/{questions.length}
        </Badge>
      </div>

      <p className="text-gray-800 mb-6 text-lg">{current.question_text}</p>

      <div className="space-y-3 mb-6">
        {current.options.map(opt => {
          const isSelected = selectedAnswer === opt.value
          const isCorrect = opt.is_correct
          let optClass = 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
          if (showExplanation) {
            if (isCorrect) optClass = 'border-green-500 bg-green-50'
            else if (isSelected && !isCorrect) optClass = 'border-red-500 bg-red-50'
            else optClass = 'border-gray-200 opacity-50'
          } else if (isSelected) {
            optClass = 'border-primary-500 bg-primary-50'
          }

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer flex items-center gap-3 ${optClass}`}
            >
              <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                ${isSelected ? 'border-primary-500' : 'border-gray-300'}
                ${showExplanation && isCorrect ? 'border-green-500 bg-green-500' : ''}
                ${showExplanation && isSelected && !isCorrect ? 'border-red-500 bg-red-500' : ''}`}
              >
                {showExplanation && isCorrect && <CheckCircle2 className="h-4 w-4 text-white" />}
                {showExplanation && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-white" />}
              </div>
              <span className="text-sm">{opt.label}</span>
            </button>
          )
        })}
      </div>

      {showExplanation && current.explanation && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <p className="text-sm text-blue-800">
            <strong>คำอธิบาย:</strong> {current.explanation}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!showExplanation ? (
          <Button onClick={handleCheck} disabled={!isAnswered}>
            ตรวจคำตอบ
          </Button>
        ) : (
          <Button onClick={handleNext} loading={submitting}>
            {currentIdx < questions.length - 1 ? (
              <>ข้อถัดไป <ChevronRight className="h-4 w-4" /></>
            ) : (
              'ดูผลคะแนน'
            )}
          </Button>
        )}
      </div>
    </Card>
  )
}
