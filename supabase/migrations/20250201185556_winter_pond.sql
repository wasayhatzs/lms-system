/*
  # Add Course Content and Certificate Requirements

  1. New Tables
    - `course_content` - Stores detailed content for each lesson
    - `quiz_attempts` - Tracks user quiz attempts and scores
    - `course_requirements` - Defines requirements for certificates
    - `investor_access` - Tracks which users can access investor section

  2. Changes
    - Add content field to lessons table
    - Add quiz requirements to courses
    - Add certificate eligibility tracking

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

-- Course Content Table
CREATE TABLE course_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content TEXT NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Quiz Attempts Table
CREATE TABLE quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL,
  passed boolean NOT NULL DEFAULT false,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

-- Course Requirements Table
CREATE TABLE course_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  min_quiz_score integer NOT NULL DEFAULT 70,
  required_lessons integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Investor Access Table
CREATE TABLE investor_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE course_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_access ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to course content"
  ON course_content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own quiz attempts"
  ON quiz_attempts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow public read access to course requirements"
  ON course_requirements FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view their investor access"
  ON investor_access FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample course requirements
INSERT INTO course_requirements (course_id, min_quiz_score, required_lessons)
SELECT id, 70, 5 FROM courses;

-- Insert sample course content
INSERT INTO course_content (lesson_id, content_type, content, "order")
SELECT 
  l.id,
  'video',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  1
FROM lessons l;

INSERT INTO course_content (lesson_id, content_type, content, "order")
SELECT 
  l.id,
  'text',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  2
FROM lessons l;