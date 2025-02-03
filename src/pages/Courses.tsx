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
  CardMedia,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Award } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { Course, UserProgress } from '../types/database';

export default function Courses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [coursesResponse, progressResponse] = await Promise.all([
          supabase.from('courses').select('*').order('order'),
          supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user?.id),
        ]);

        if (coursesResponse.error) throw coursesResponse.error;
        if (progressResponse.error) throw progressResponse.error;

        setCourses(coursesResponse.data);
        const progressMap = progressResponse.data.reduce((acc, curr) => {
          acc[curr.course_id] = curr;
          return acc;
        }, {} as Record<string, UserProgress>);
        setProgress(progressMap);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  const calculateProgress = (courseId: string) => {
    const courseProgress = progress[courseId];
    if (!courseProgress) return 0;
    return (courseProgress.completed_lessons.length / 10) * 100;
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
      <Typography variant="h4" gutterBottom>
        Available Courses
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Explore our comprehensive courses designed to help you master entrepreneurship and business skills.
      </Typography>

      <Grid container spacing={4}>
        {courses.map((course) => {
          const progressPercent = calculateProgress(course.id);
          return (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={course.image_url}
                  alt={course.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={progressPercent > 0 ? 'In Progress' : 'Not Started'}
                      color={progressPercent > 0 ? 'primary' : 'default'}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {course.description}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Clock size={16} />
                      <Typography variant="body2" color="text.secondary">
                        {course.duration}h
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Users size={16} />
                      <Typography variant="body2" color="text.secondary">
                        {Math.floor(Math.random() * 1000 + 500)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Award size={16} />
                      <Typography variant="body2" color="text.secondary">
                        Certificate
                      </Typography>
                    </Box>
                  </Box>

                  {progressPercent > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progressPercent}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {Math.round(progressPercent)}% Complete
                      </Typography>
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    {progressPercent > 0 ? 'Continue Course' : 'Start Course'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}