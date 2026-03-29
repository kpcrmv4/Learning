import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Clock, BookOpen, Signal } from 'lucide-react'
import { formatPrice, formatDuration } from '@/lib/format'
import { DIFFICULTY_LEVELS } from '@/config/constants'
import type { Course } from '@/types/database'

interface CourseCardProps {
  course: Course
  lessonCount?: number
}

export function CourseCard({ course, lessonCount }: CourseCardProps) {
  const difficulty = DIFFICULTY_LEVELS.find(d => d.value === course.difficulty)

  return (
    <Link to={`/courses/${course.slug}`}>
      <Card hover className="h-full flex flex-col">
        <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 relative">
          {course.thumbnail_url ? (
            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary-400" />
            </div>
          )}
          {course.original_price && course.original_price > course.price && (
            <Badge variant="danger" className="absolute top-3 right-3">
              ลด {Math.round((1 - course.price / course.original_price) * 100)}%
            </Badge>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            {difficulty && (
              <Badge className={difficulty.color}>
                <Signal className="h-3 w-3 mr-1" />
                {difficulty.label}
              </Badge>
            )}
            {course.category && (
              <Badge variant="info">{course.category}</Badge>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{course.description}</p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {course.total_duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(course.total_duration_minutes)}
                </span>
              )}
              {lessonCount !== undefined && (
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {lessonCount} บท
                </span>
              )}
            </div>
            <div className="text-right">
              {course.original_price && course.original_price > course.price && (
                <span className="text-xs text-gray-400 line-through mr-1">
                  {formatPrice(course.original_price)}
                </span>
              )}
              <span className="font-bold text-primary-600">
                {course.price === 0 ? 'ฟรี' : formatPrice(course.price)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
