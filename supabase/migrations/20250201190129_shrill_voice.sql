/*
  # Add sample quizzes and questions

  1. New Data
    - Sample quizzes for each course
    - Quiz questions with multiple choice options
    - Correct answers for validation
*/

-- Insert sample quizzes
INSERT INTO quizzes (course_id, title)
SELECT id, title || ' Quiz'
FROM courses;

-- Insert sample quiz questions
INSERT INTO quiz_questions (quiz_id, question, options, correct_answer)
SELECT 
  q.id,
  'What is the first step in validating a business idea?',
  '["Market research", "Building a product", "Getting funding", "Creating a logo"]',
  'Market research'
FROM quizzes q
WHERE q.title LIKE 'Introduction to%';

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer)
SELECT 
  q.id,
  'Which component of the Business Model Canvas focuses on revenue?',
  '["Revenue Streams", "Key Activities", "Customer Segments", "Value Propositions"]',
  'Revenue Streams'
FROM quizzes q
WHERE q.title LIKE 'Business Model%';

-- Add more questions per quiz
INSERT INTO quiz_questions (quiz_id, question, options, correct_answer)
SELECT 
  q.id,
  'What is a key characteristic of successful entrepreneurs?',
  '["Risk tolerance", "Perfect planning", "Avoiding change", "Following others"]',
  'Risk tolerance'
FROM quizzes q
WHERE q.title LIKE 'Introduction to%';

INSERT INTO quiz_questions (quiz_id, question, options, correct_answer)
SELECT 
  q.id,
  'Which section of the Business Model Canvas describes your target market?',
  '["Customer Segments", "Key Partners", "Cost Structure", "Channels"]',
  'Customer Segments'
FROM quizzes q
WHERE q.title LIKE 'Business Model%';