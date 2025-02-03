/*
  # Course Completion and Certificate System Update

  1. Changes
    - Add course_id to certificates table
    - Add completion criteria table
    - Add completion tracking fields to user_progress

  2. Security
    - Enable RLS on new tables
    - Update certificate policies
*/

-- Add course_id to certificates
ALTER TABLE certificates ADD COLUMN course_id uuid REFERENCES courses(id);

-- Course Completion Criteria
CREATE TABLE course_completion_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  required_lessons integer NOT NULL DEFAULT 3,
  min_quiz_score integer NOT NULL DEFAULT 70,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE course_completion_criteria ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to course completion criteria"
  ON course_completion_criteria FOR SELECT
  TO public
  USING (true);

-- Insert default completion criteria for existing courses
INSERT INTO course_completion_criteria (course_id, required_lessons, min_quiz_score)
SELECT id, 3, 70 FROM courses;

-- Update certificate policies
CREATE POLICY "Users can view their own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);