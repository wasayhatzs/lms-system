-- Drop existing certificates table
DROP TABLE IF EXISTS certificates CASCADE;

-- Recreate certificates table with course_id
CREATE TABLE certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  share_id uuid DEFAULT gen_random_uuid(),
  issued_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create lessons for courses
INSERT INTO lessons (course_id, title, content, "order")
SELECT 
  c.id,
  'Introduction - ' || c.title,
  'Introduction to ' || c.title,
  1
FROM courses c
WHERE NOT EXISTS (
  SELECT 1 FROM lessons l WHERE l.course_id = c.id
);

-- Create quizzes for each course
INSERT INTO quizzes (course_id, title)
SELECT 
  c.id,
  c.title || ' Final Quiz'
FROM courses c
WHERE NOT EXISTS (
  SELECT 1 FROM quizzes q WHERE q.course_id = c.id
);

-- Add sample quiz questions for Introduction to Entrepreneurship
WITH intro_quiz AS (
  SELECT id FROM quizzes WHERE title LIKE 'Introduction to%'
)
INSERT INTO quiz_questions (quiz_id, question, options, correct_answer)
SELECT 
  intro_quiz.id,
  q.question,
  q.options,
  q.answer
FROM intro_quiz,
(VALUES
  ('What is entrepreneurship?', 
   '["The process of starting and running a business", "Working for a corporation", "Managing employees", "Investing in stocks"]',
   'The process of starting and running a business'),
  ('What is a key trait of successful entrepreneurs?',
   '["Risk aversion", "Adaptability", "Avoiding challenges", "Following orders"]',
   'Adaptability'),
  ('What is a minimum viable product (MVP)?',
   '["A perfect product", "A basic version to test market response", "An expensive product", "A completed product"]',
   'A basic version to test market response')
) AS q(question, options, answer)
WHERE NOT EXISTS (
  SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = intro_quiz.id
);

-- Add sample quiz questions for Business Model Canvas
WITH bmc_quiz AS (
  SELECT id FROM quizzes WHERE title LIKE 'Business Model%'
)
INSERT INTO quiz_questions (quiz_id, question, options, correct_answer)
SELECT 
  bmc_quiz.id,
  q.question,
  q.options,
  q.answer
FROM bmc_quiz,
(VALUES
  ('What are the key components of a Business Model Canvas?', 
   '["Value Proposition, Customer Segments, Revenue Streams", "Products, Services, Pricing", "Marketing, Sales, Support"]',
   'Value Proposition, Customer Segments, Revenue Streams'),
  ('What is a value proposition?',
   '["Product price", "Customer benefit", "Marketing strategy", "Sales target"]',
   'Customer benefit')
) AS q(question, options, answer)
WHERE NOT EXISTS (
  SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = bmc_quiz.id
);

-- Create or replace function to check course completion
CREATE OR REPLACE FUNCTION check_course_completion()
RETURNS TRIGGER AS $$
DECLARE
  lesson_count INTEGER;
  quiz_score INTEGER;
  passed_quiz BOOLEAN;
BEGIN
  -- Get completed lesson count
  SELECT COALESCE(array_length(NEW.completed_lessons, 1), 0)
  INTO lesson_count
  FROM user_progress
  WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

  -- Get latest quiz score
  SELECT score, passed
  INTO quiz_score, passed_quiz
  FROM quiz_attempts qa
  JOIN quizzes q ON qa.quiz_id = q.id
  WHERE q.course_id = NEW.course_id
  AND qa.user_id = NEW.user_id
  ORDER BY qa.completed_at DESC
  LIMIT 1;

  -- If completion criteria met, create certificate
  IF lesson_count >= 3 AND passed_quiz = true AND quiz_score >= 70 THEN
    INSERT INTO certificates (user_id, course_id)
    VALUES (NEW.user_id, NEW.course_id)
    ON CONFLICT (user_id, course_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for course completion
DROP TRIGGER IF EXISTS check_course_completion_trigger ON user_progress;
CREATE TRIGGER check_course_completion_trigger
  AFTER INSERT OR UPDATE OF completed_lessons
  ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION check_course_completion();

-- Enable RLS on certificates
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Add policies for certificates
CREATE POLICY "Users can view their own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view certificates by share_id"
  ON certificates FOR SELECT
  TO public
  USING (true);

-- Add certificate verification endpoint
CREATE OR REPLACE FUNCTION verify_certificate(share_id uuid)
RETURNS TABLE (
  certificate_id uuid,
  user_email text,
  course_title text,
  issued_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    u.email,
    co.title,
    c.issued_at
  FROM certificates c
  JOIN auth.users u ON c.user_id = u.id
  JOIN courses co ON c.course_id = co.id
  WHERE c.share_id = share_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;