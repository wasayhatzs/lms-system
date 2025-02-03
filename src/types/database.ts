export interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  duration: number;
  order: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order: number;
  created_at: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_lessons: string[];
  quiz_scores: Record<string, number>;
  completed_at: string | null;
  created_at: string;
}

export interface Certificate {
  // share_id: any;
  course_id: string;
  id: string;
  user_id: string;
  issued_at: string;
  created_at: string;
}

export interface InvestorProfile {
  id: string;
  user_id: string;
  company_name: string;
  bio: string;
  investment_range: string;
  created_at: string;
}

export interface StartupPitch {
  id: string;
  user_id: string;
  title: string;
  description: string;
  funding_goal: number;
  pitch_deck_url: string | null;
  created_at: string;
}

export interface CertificateProps {
  courseTitle: string;
  userName: string;
  completionDate: Date;
  quizScore: number;
}

export interface QuizCompletionDialogProps {
  open: boolean;
  onClose: () => void;
  score: number;
  courseTitle: string;
  userName: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  course_id: string;
  score: number;
  completed_at: string;
}