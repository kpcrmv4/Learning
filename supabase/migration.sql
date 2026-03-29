-- =====================================================
-- CourseHub Database Schema Migration
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  thumbnail_url TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(10,2),
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_published BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  total_duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_storage_path TEXT,
  duration_minutes INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON lessons(course_id, sort_order);

-- 4. Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  passing_score INTEGER NOT NULL DEFAULT 70,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Quiz Questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false')),
  options JSONB NOT NULL DEFAULT '[]',
  explanation TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- 6. Quiz Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  answers JSONB,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT DEFAULT 'promptpay',
  promptpay_ref TEXT,
  slip_image_path TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_orders_user_course ON orders(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 8. Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- 9. Lesson Progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  last_position_seconds INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 10. User IP Logs
CREATE TABLE IF NOT EXISTS user_ip_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  user_agent TEXT,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, ip_address)
);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ip_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles: users can read their own, admins can read all
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (is_admin());

-- Courses: published courses are readable by everyone, admins can CRUD
CREATE POLICY "Published courses are public" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage courses" ON courses FOR ALL USING (is_admin());

-- Lessons: anyone can read lessons of published courses, admins can CRUD
CREATE POLICY "Lessons of published courses are public" ON lessons
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = lessons.course_id AND courses.is_published = true)
  );
CREATE POLICY "Admins can manage lessons" ON lessons FOR ALL USING (is_admin());

-- Quizzes: enrolled users can read, admins can CRUD
CREATE POLICY "Enrolled users can read quizzes" ON quizzes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM enrollments WHERE enrollments.course_id = quizzes.course_id AND enrollments.user_id = auth.uid())
    OR is_admin()
  );
CREATE POLICY "Admins can manage quizzes" ON quizzes FOR ALL USING (is_admin());

-- Quiz Questions: enrolled users can read, admins can CRUD
CREATE POLICY "Enrolled users can read questions" ON quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN enrollments e ON e.course_id = q.course_id
      WHERE q.id = quiz_questions.quiz_id AND e.user_id = auth.uid()
    )
    OR is_admin()
  );
CREATE POLICY "Admins can manage questions" ON quiz_questions FOR ALL USING (is_admin());

-- Quiz Attempts: users can manage their own, admins can read all
CREATE POLICY "Users can insert own attempts" ON quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own attempts" ON quiz_attempts FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- Orders: users can manage their own, admins can manage all
CREATE POLICY "Users can read own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (is_admin());

-- Enrollments: users can read their own, admins can CRUD
CREATE POLICY "Users can read own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Admins can manage enrollments" ON enrollments FOR ALL USING (is_admin());

-- Lesson Progress: users manage their own
CREATE POLICY "Users manage own progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id);

-- User IP Logs: users can manage their own, admins can manage all
CREATE POLICY "Users can manage own ip logs" ON user_ip_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all ip logs" ON user_ip_logs FOR ALL USING (is_admin());

-- =====================================================
-- Storage Buckets
-- =====================================================

-- 1. Videos bucket (private) - วิดีโอบทเรียน
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos', 'videos', false,
  524288000, -- 500 MB
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
) ON CONFLICT (id) DO NOTHING;

-- 2. Thumbnails bucket (public) - รูปปกคอร์ส
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thumbnails', 'thumbnails', true,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- 3. Payment slips bucket (private) - สลิปการโอนเงิน
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-slips', 'payment-slips', false,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Storage RLS Policies
-- =====================================================

-- Videos: admins can upload/delete, authenticated users can read (via signed URL)
CREATE POLICY "Admins can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'videos' AND is_admin());

CREATE POLICY "Admins can update videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'videos' AND is_admin());

CREATE POLICY "Admins can delete videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'videos' AND is_admin());

CREATE POLICY "Authenticated users can read videos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'videos');

-- Thumbnails: admins can upload/delete, everyone can read (public bucket)
CREATE POLICY "Admins can upload thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thumbnails' AND is_admin());

CREATE POLICY "Admins can update thumbnails"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'thumbnails' AND is_admin());

CREATE POLICY "Admins can delete thumbnails"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'thumbnails' AND is_admin());

CREATE POLICY "Anyone can read thumbnails"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'thumbnails');

-- Payment slips: authenticated users can upload to their own folder, admins can read all
CREATE POLICY "Users can upload own slips"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payment-slips'
    AND (storage.foldername(name))[1] = 'slips'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY "Users can read own slips"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-slips'
    AND (
      (storage.foldername(name))[2] = auth.uid()::text
      OR is_admin()
    )
  );

CREATE POLICY "Admins can read all slips"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'payment-slips' AND is_admin());

CREATE POLICY "Admins can delete slips"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'payment-slips' AND is_admin());

-- =====================================================
-- Updated_at trigger
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON lesson_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
