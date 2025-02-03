import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  Alert,
  Fade,
  Slide,
  Dialog,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import { Award, Share, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { Course, UserProgress } from '../types/database';
import Certificate from './Certificate';

interface CompletedCourse {
  courseId: string;
  courseTitle: string;
  completionDate: string;
  quizScore: number;
  userId: string;
}

export default function Certificates() {
  const theme = useTheme();
  const { user } = useAuth();
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([]);
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CompletedCourse | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get courses and progress from Supabase
        const [coursesResponse, progressResponse] = await Promise.all([
          supabase.from('courses').select('*'),
          supabase.from('user_progress').select('*').eq('user_id', user?.id),
        ]);

        if (coursesResponse.error) throw coursesResponse.error;
        if (progressResponse.error) throw progressResponse.error;

        // Create courses map
        const coursesMap = coursesResponse.data.reduce((acc, course) => {
          acc[course.id] = course;
          return acc;
        }, {} as Record<string, Course>);
        setCourses(coursesMap);

        // Create progress map
        const progressMap = progressResponse.data.reduce((acc, curr) => {
          acc[curr.course_id] = curr;
          return acc;
        }, {} as Record<string, UserProgress>);
        setProgress(progressMap);

        // Get completed courses from localStorage
        const storedCertificates = JSON.parse(localStorage.getItem('completedCourses') || '[]');
        // Filter certificates for current user
        const userCertificates = storedCertificates.filter(
          (cert: CompletedCourse) => cert.userId === user?.id
        );
        setCompletedCourses(userCertificates);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const calculateProgress = (courseId: string) => {
    const courseProgress = progress[courseId];
    if (!courseProgress) return 0;
    return (courseProgress.completed_lessons.length / 10) * 100;
  };

  const handleShare = async (course: CompletedCourse) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Course Certificate',
          text: `I completed ${course.courseTitle} with a score of ${course.quizScore}%!`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 400,
            mb: 1,
          }}
        >
          Your Certificates
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '1.1rem'
          }}
        >
          Track your achievements and download your earned certificates.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {Object.entries(courses).map(([courseId, course], index) => {
          const completedCourse = completedCourses.find(c => c.courseId === courseId);
          const isCompleted = !!completedCourse;
          const progressPercent = calculateProgress(courseId);

          return (
            <Grid item xs={12} sm={6} md={4} key={courseId}>
              <Card sx={{
                height: '100%',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
                border: `1px solid ${theme.palette.divider}`,
              }}>
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 2,
                  p: 3
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}>
                    {isCompleted ? (
                      <Award size={28} color={theme.palette.primary.main} />
                    ) : (
                      <Lock size={28} color={theme.palette.text.disabled} />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 400,
                          fontSize: '1.25rem',
                          mb: 0.5
                        }}
                      >
                        {course.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: isCompleted ? 'primary.main' : 'text.secondary',
                          fontSize: '0.9rem'
                        }}
                      >
                        {isCompleted
                          ? `Completed with ${completedCourse.quizScore}% score`
                          : `${Math.round(progressPercent)}% Complete`}
                      </Typography>
                    </Box>
                  </Box>

                  {!isCompleted && (
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress
                        variant="determinate"
                        value={progressPercent}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(59, 130, 246, 0.2)' 
                            : 'rgba(37, 99, 235, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'primary.main',
                          }
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                          mt: 1
                        }}
                      >
                        Complete the course and pass the quiz to earn your certificate
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1,
                    mt: 'auto' 
                  }}>
                    <Button
                      variant={isCompleted ? 'contained' : 'outlined'}
                      fullWidth
                      startIcon={isCompleted ? <Award size={20} /> : <Lock size={20} />}
                      disabled={!isCompleted}
                      onClick={() => {
                        if (completedCourse) {
                          setSelectedCourse(completedCourse);
                          setPreviewOpen(true);
                        }
                      }}
                      sx={{
                        py: 1,
                        ...(isCompleted ? {
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          }
                        } : {
                          borderColor: theme.palette.divider,
                          color: 'text.secondary',
                        })
                      }}
                    >
                      {isCompleted ? 'View Certificate' : 'Complete Course to Unlock'}
                    </Button>
                    {isCompleted && (
                      <Button
                        variant="outlined"
                        onClick={() => completedCourse && handleShare(completedCourse)}
                        sx={{
                          minWidth: 'unset',
                          p: 1,
                          borderColor: theme.palette.divider,
                        }}
                      >
                        <Share size={20} />
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Certificate Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
          }
        }}
      >
        <DialogContent>
          {selectedCourse && (
            <Certificate
              courseTitle={selectedCourse.courseTitle}
              userName={user?.email || ''}
              completionDate={new Date(selectedCourse.completionDate)}
              quizScore={selectedCourse.quizScore}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}