import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Rocket, BookOpen, Award, Users, Zap } from 'lucide-react';

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <BookOpen size={40} color={theme.palette.primary.main} />,
      title: 'Interactive Learning',
      description: 'Engage with dynamic course content and real-world projects.',
    },
    {
      icon: <Award size={40} color={theme.palette.primary.main} />,
      title: 'Earn Certificates',
      description: 'Get recognized for your achievements with verified certificates.',
    },
    {
      icon: <Users size={40} color={theme.palette.primary.main} />,
      title: 'Connect with Investors',
      description: 'Network with potential investors after completing courses.',
    },
    {
      icon: <Zap size={40} color={theme.palette.primary.main} />,
      title: 'Fast-Track Growth',
      description: 'Accelerate your startup journey with expert guidance.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Rocket size={32} color={theme.palette.primary.main} />
            <Typography
              variant="h6"
              component="div"
              sx={{ ml: 1, fontWeight: 'bold' }}
            >
              ICARUS
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            color="primary"
          >
            Start Learning
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 4,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Elevate Your Startup Journey
            <br />
            with ICARUS
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: '800px', mb: 4 }}
          >
            Transform your entrepreneurial dreams into reality through expert-led courses,
            hands-on learning, and direct connections with investors.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/courses"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Explore Courses
            </Button>
          </Box>

          <Box
            component="img"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
            alt="Learning Platform"
            sx={{
              width: '100%',
              maxWidth: '1000px',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              mt: 6,
            }}
          />

          <Grid container spacing={4} sx={{ mt: 8 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 12, mb: 8, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Ready to Take Flight?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of entrepreneurs who have already transformed their startups with ICARUS.
            </Typography>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.25rem',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              Start Your Journey
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}