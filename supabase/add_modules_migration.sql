-- =====================================================
-- Add Modules Table Migration
-- Run this in Supabase SQL Editor AFTER migration.sql
-- =====================================================

-- 1. Modules table (sits between courses and lessons)
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_modules_course_order ON modules(course_id, sort_order);

-- 2. Add module_id to lessons (nullable — backwards compatible)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS module_id UUID REFERENCES modules(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);

-- 3. RLS for modules
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules of published courses are public" ON modules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = modules.course_id AND courses.is_published = true
    )
  );

CREATE POLICY "Admins can manage modules" ON modules FOR ALL USING (is_admin());

-- 4. updated_at trigger for modules
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
