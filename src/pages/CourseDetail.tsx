import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  LinearProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Fade,
  Slide,
  IconButton,
  Tooltip,
} from '@mui/material';
import { CheckCircle, Circle, PlayCircle, BookOpen, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { Course, Lesson, UserProgress, Quiz, QuizQuestion } from '../types/database';
import QuizCompletionDialog from './QuizCompletionDialog';

const COURSE_CONTENT = {
  'introduction-to-entrepreneurship': {
    videos: [
      'https://www.youtube.com/embed/ZoqgAy3h4OM',
      'https://www.youtube.com/embed/Yw9qeR9rf4Q',
      'https://www.youtube.com/embed/r9VmQ9YuWxQ',
    ],
    content: [
      'Understanding the entrepreneurial mindset and key traits of successful entrepreneurs.',
      'Identifying market opportunities and validating business ideas.',
      'Building a strong foundation for your startup journey.',
    ],
  },
  'business-model-canvas': {
    videos: [
      'https://www.youtube.com/embed/IP0cUBWTgpY',
      'https://www.youtube.com/embed/QoAOzMTLP5s',
      'https://www.youtube.com/embed/wlKP-BaC0jA',
    ],
    content: [
      'Learn how to use the Business Model Canvas to structure your business idea.',
      'Understanding customer segments and value propositions.',
      'Revenue streams and cost structure analysis.',
    ],
  },
};

export default function CourseDetail() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseResponse, lessonsResponse, progressResponse, quizResponse] = await Promise.all([
          supabase.from('courses').select('*').eq('id', courseId).single(),
          supabase.from('lessons').select('*').eq('course_id', courseId).order('order'),
          supabase
            .from('user_progress')
            .select('*')
            .eq('course_id', courseId)
            .eq('user_id', user?.id)
            .single(),
          supabase.from('quizzes').select('*').eq('course_id', courseId).single(),
        ]);

        if (courseResponse.error) throw courseResponse.error;
        if (lessonsResponse.error) throw lessonsResponse.error;
        if (quizResponse.error && quizResponse.error.code !== 'PGRST116') throw quizResponse.error;

        setCourse(courseResponse.data);
        setLessons(lessonsResponse.data);
        setProgress(progressResponse.data);
        setCurrentQuiz(quizResponse.data);

        if (quizResponse.data) {
          const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quizResponse.data.id);

          if (questionsError) throw questionsError;
          setQuizQuestions(questions);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && user) {
      fetchCourseData();
    }
  }, [courseId, user]);

  useEffect(() => {
    if (videoEnded && activeLesson >= 2) {
      setShowQuizPrompt(true);
    }
  }, [videoEnded, activeLesson]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    handleLessonComplete(lessons[activeLesson].id);
  };

  const handleLessonComplete = async (lessonId: string) => {
    try {
      const completedLessons = progress?.completed_lessons || [];
      const updatedLessons = completedLessons.includes(lessonId)
        ? completedLessons
        : [...completedLessons, lessonId];

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user?.id,
          course_id: courseId,
          completed_lessons: updatedLessons,
        })
        .eq('user_id', user?.id)
        .eq('course_id', courseId);

      if (error) throw error;

      setProgress((prev) => ({
        ...prev!,
        completed_lessons: updatedLessons,
      }));

      if (activeLesson === lessons.length - 1) {
        setShowQuizPrompt(true);
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  const handleQuizSubmit = async () => {
    const correctAnswers = quizQuestions.filter(
      (q) => selectedAnswers[q.id] === q.correct_answer
    ).length;
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
  
    // If passed, save to localStorage
    if (score >= 70) {
      const existingCertificates = JSON.parse(localStorage.getItem('completedCourses') || '[]');
      const newCertificate = {
        courseId: courseId,
        courseTitle: course?.title || '',
        completionDate: new Date().toISOString(),
        quizScore: score,
        userId: user?.id // Store this to filter by user
      };
      
      // Only add if not already present
      if (!existingCertificates.find((cert: any) => cert.courseId === courseId)) {
        existingCertificates.push(newCertificate);
        localStorage.setItem('completedCourses', JSON.stringify(existingCertificates));
      }
  
      setQuizOpen(false);
      setQuizDialogOpen(true);
    }
  };

  const handleNextLesson = () => {
    if (activeLesson < lessons.length - 1) {
      setActiveLesson(prev => prev + 1);
      setVideoEnded(false);
    }
  };

  const handlePreviousLesson = () => {
    if (activeLesson > 0) {
      setActiveLesson(prev => prev - 1);
      setVideoEnded(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container>
        <Typography>Course not found</Typography>
      </Container>
    );
  }

  const completedLessons = progress?.completed_lessons || [];
  const progressPercentage = (completedLessons.length / lessons.length) * 100;
  const courseContent = COURSE_CONTENT[course.id as keyof typeof COURSE_CONTENT] || COURSE_CONTENT['introduction-to-entrepreneurship'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Fade in timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Button
            onClick={() => navigate('/courses')}
            startIcon={<ChevronLeft />}
            sx={{ mb: 2 }}
          >
            Back to Courses
          </Button>
          <Typography variant="h4" gutterBottom>
            {course.title}
          </Typography>
          <Typography color="text.secondary" paragraph>
            {course.description}
          </Typography>
          <Box sx={{ mb: 3 }}>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  transition: 'transform 1s ease-in-out',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {Math.round(progressPercentage)}% Complete
            </Typography>
          </Box>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Slide direction="up" in timeout={1000}>
            <Card sx={{ 
              mb: 4,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}>
              <CardContent>
                <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, mb: 3 }}>
                  <iframe
                    src={`${courseContent.videos[activeLesson]}?enablejsapi=1`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onEnded={handleVideoEnd}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    {lessons[activeLesson]?.title}
                  </Typography>
                  <Box>
                    <Tooltip title="Previous Lesson">
                      <IconButton 
                        onClick={handlePreviousLesson}
                        disabled={activeLesson === 0}
                      >
                        <ChevronLeft />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Next Lesson">
                      <IconButton
                        onClick={handleNextLesson}
                        disabled={activeLesson === lessons.length - 1}
                      >
                        <ChevronRight />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {courseContent.content[activeLesson]}
                </Typography>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        <Grid item xs={12} md={4}>
          <Slide direction="left" in timeout={1200}>
            <Card sx={{
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Content
                </Typography>
                <List>
                  {lessons.map((lesson, index) => (
                    <React.Fragment key={lesson.id}>
                      {index > 0 && <Divider />}
                      <ListItem
                        sx={{
                          py: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            transform: 'translateX(8px)',
                          },
                        }}
                        onClick={() => setActiveLesson(index)}
                      >
                        <ListItemIcon>
                          {completedLessons.includes(lesson.id) ? (
                            <CheckCircle color="#2563EB" />
                          ) : activeLesson === index ? (
                            <PlayCircle color="#2563EB" />
                          ) : (
                            <Circle />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={lesson.title}
                          secondary={`Lesson ${index + 1}`}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={completedLessons.includes(lesson.id) ? <CheckCircle /> : <BookOpen />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLessonComplete(lesson.id);
                          }}
                          color={completedLessons.includes(lesson.id) ? "success" : "primary"}
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          {completedLessons.includes(lesson.id) ? 'Completed' : 'Mark Complete'}
                        </Button>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>

                {currentQuiz && (
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Award />}
                      onClick={() => setQuizOpen(true)}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      Take Quiz
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Slide>
        </Grid>
      </Grid>

      {/* Quiz Prompt Dialog */}
      <Dialog 
        open={showQuizPrompt} 
        onClose={() => setShowQuizPrompt(false)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
      >
        <DialogTitle>Ready for the Quiz?</DialogTitle>
        <DialogContent>
          <Typography>
            You've completed enough lessons to take the course quiz. Would you like to start the quiz now?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQuizPrompt(false)}>Later</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowQuizPrompt(false);
              setShowQuizPrompt(false);
              setQuizOpen(true);
            }}
          >
            Start Quiz
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog 
        open={quizOpen} 
        onClose={() => !quizSubmitted && setQuizOpen(false)} 
        maxWidth="sm" 
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
      >
        <DialogTitle>Course Quiz</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            {quizQuestions.map((question, index) => (
              <Fade in timeout={500 + index * 200} key={question.id}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {index + 1}. {question.question}
                  </Typography>
                  <RadioGroup
                    value={selectedAnswers[question.id] || ''}
                    onChange={(e) =>
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [question.id]: e.target.value,
                      }))
                    }
                  >
                    {question.options.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              </Fade>
            ))}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuizOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleQuizSubmit}
            disabled={Object.keys(selectedAnswers).length !== quizQuestions.length}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Certificate Dialog */}
      <QuizCompletionDialog
        open={quizDialogOpen}
        onClose={() => {
          setQuizDialogOpen(false);
          setQuizSubmitted(false);
          setSelectedAnswers({});
          if (quizScore >= 70) {
            navigate('/certificates');
          }
        }}
        score={quizScore}
        courseTitle={course?.title || ''}
        userName={user?.email || ''}
      />
    </Container>
  );
}