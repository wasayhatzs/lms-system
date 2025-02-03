/*
  # LMS System Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `duration` (integer, in hours)
      - `order` (integer)
      - `created_at` (timestamp)
    
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text)
      - `order` (integer)
      - `created_at` (timestamp)
    
    - `quizzes`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text)
      - `created_at` (timestamp)
    
    - `quiz_questions`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, foreign key)
      - `question` (text)
      - `options` (jsonb)
      - `correct_answer` (text)
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `course_id` (uuid, foreign key)
      - `completed_lessons` (jsonb)
      - `quiz_scores` (jsonb)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
    
    - `certificates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `issued_at` (timestamp)
      - `created_at` (timestamp)
    
    - `investor_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `company_name` (text)
      - `bio` (text)
      - `investment_range` (text)
      - `created_at` (timestamp)
    
    - `startup_pitches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `funding_goal` (integer)
      - `pitch_deck_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Courses Table
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  duration integer NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Lessons Table
CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Quizzes Table
CREATE TABLE quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Quiz Questions Table
CREATE TABLE quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL
);

-- User Progress Table
CREATE TABLE user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons jsonb DEFAULT '[]'::jsonb,
  quiz_scores jsonb DEFAULT '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Certificates Table
CREATE TABLE certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  issued_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Investor Profiles Table
CREATE TABLE investor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  bio text NOT NULL,
  investment_range text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Startup Pitches Table
CREATE TABLE startup_pitches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  funding_goal integer NOT NULL,
  pitch_deck_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_pitches ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to courses"
  ON courses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to lessons"
  ON lessons FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to quizzes"
  ON quizzes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to quiz questions"
  ON quiz_questions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can manage their own progress"
  ON user_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their investor profile"
  ON investor_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their startup pitches"
  ON startup_pitches FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample courses
INSERT INTO courses (title, description, image_url, duration, "order") VALUES
('Introduction to Entrepreneurship', 'Learn the fundamentals of starting and running a successful business', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', 10, 1),
('Business Model Canvas', 'Master the art of business planning using the Business Model Canvas', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40', 8, 2),
('Market Research & Analysis', 'Learn how to conduct effective market research and analyze your findings', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 12, 3),
('Financial Planning', 'Understanding startup finances and creating financial projections', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c', 15, 4),
('Pitch Deck Creation', 'Create compelling pitch decks that attract investors', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0', 6, 5),
('Marketing Strategy', 'Develop effective marketing strategies for your startup', 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07', 10, 6),
('Product Development', 'Learn the process of developing and launching products', 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e', 14, 7),
('Sales & Customer Acquisition', 'Master the art of sales and customer acquisition', 'https://images.unsplash.com/photo-1552581234-26160f608093', 12, 8),
('Legal Essentials', 'Understanding legal requirements for startups', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f', 8, 9),
('Investor Relations', 'Learn how to build and maintain relationships with investors', 'https://images.unsplash.com/photo-1553729459-efe14ef6055d', 10, 10);