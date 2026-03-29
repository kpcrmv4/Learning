export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Profile>
      }
      courses: {
        Row: Course
        Insert: Omit<Course, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Course>
      }
      lessons: {
        Row: Lesson
        Insert: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Lesson>
      }
      quizzes: {
        Row: Quiz
        Insert: Omit<Quiz, 'id' | 'created_at'>
        Update: Partial<Quiz>
      }
      quiz_questions: {
        Row: QuizQuestion
        Insert: Omit<QuizQuestion, 'id'>
        Update: Partial<QuizQuestion>
      }
      quiz_attempts: {
        Row: QuizAttempt
        Insert: Omit<QuizAttempt, 'id' | 'completed_at'>
        Update: Partial<QuizAttempt>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Order>
      }
      enrollments: {
        Row: Enrollment
        Insert: Omit<Enrollment, 'id' | 'enrolled_at'>
        Update: Partial<Enrollment>
      }
      lesson_progress: {
        Row: LessonProgress
        Insert: Omit<LessonProgress, 'id' | 'updated_at'>
        Update: Partial<LessonProgress>
      }
      user_ip_logs: {
        Row: UserIpLog
        Insert: Omit<UserIpLog, 'id' | 'first_seen_at' | 'last_seen_at'>
        Update: Partial<UserIpLog>
      }
    }
  }
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'student' | 'admin'
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  long_description: string | null
  thumbnail_url: string | null
  price: number
  original_price: number | null
  category: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null
  is_published: boolean
  sort_order: number
  total_duration_minutes: number | null
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string | null
  video_storage_path: string | null
  duration_minutes: number | null
  sort_order: number
  is_preview: boolean
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  lesson_id: string | null
  course_id: string
  title: string
  passing_score: number
  sort_order: number
  created_at: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false'
  options: QuizOption[]
  explanation: string | null
  sort_order: number
}

export interface QuizOption {
  label: string
  value: string
  is_correct: boolean
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  score: number
  answers: Record<string, string>
  passed: boolean
  completed_at: string
}

export interface Order {
  id: string
  user_id: string
  course_id: string
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: string
  promptpay_ref: string | null
  slip_image_path: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
  expires_at: string | null
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  is_completed: boolean
  last_position_seconds: number
  updated_at: string
}

export interface UserIpLog {
  id: string
  user_id: string
  ip_address: string
  user_agent: string | null
  first_seen_at: string
  last_seen_at: string
}

export interface CourseWithLessons extends Course {
  lessons: Lesson[]
}

export interface OrderWithCourse extends Order {
  course: Course
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course
}
