import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { Course, UserProgress } from '../types/database';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [progress, setProgress] = React.useState<UserProgress[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
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
        setProgress(progressResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const calculateProgress = (courseId: string) => {
    const courseProgress = progress.find((p) => p.course_id === courseId);
    if (!courseProgress) return 0;
    return (courseProgress.completed_lessons.length / 10) * 100; // Assuming 10 lessons per course
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
      <Grid container spacing={3}>
        {/* Stats Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BookOpen size={40} color="#2563EB" />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Courses in Progress
              </Typography>
              <Typography variant="h4">
                {progress.filter((p) => !p.completed_at).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Award size={40} color="#7C3AED" />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Completed Courses
              </Typography>
              <Typography variant="h4">
                {progress.filter((p) => p.completed_at).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Users size={40} color="#059669" />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Connected Investors
              </Typography>
              <Typography variant="h4">0</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Course List */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Your Courses
          </Typography>
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} md={6} lg={4} key={course.id}>
                <Card>
                  <Box
                    sx={{
                      height: 140,
                      backgroundImage: `url(${course.image_url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {course.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(course.id)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {calculateProgress(course.id)}% Complete
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      {calculateProgress(course.id) === 0
                        ? 'Start Course'
                        : 'Continue Learning'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}