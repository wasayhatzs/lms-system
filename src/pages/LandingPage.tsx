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
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import { 
  Rocket, 
  BookOpen, 
  Award, 
  Users, 
  Zap,
  Twitter,
  Linkedin,
  Github,
  Mail,
  GraduationCap,
  Target,
  MessageCircle,
  BookMarked,
  LineChart,
  Hexagon,
} from 'lucide-react';

const features = [
  {
    icon: <BookOpen size={32} />,
    title: 'Interactive Learning',
    description: 'Engage with dynamic course content and real-world projects.',
  },
  {
    icon: <Award size={32} />,
    title: 'Earn Certificates',
    description: 'Get recognized for your achievements with verified certificates.',
  },
  {
    icon: <Users size={32} />,
    title: 'Connect with Investors',
    description: 'Network with potential investors after completing courses.',
  },
  {
    icon: <Zap size={32} />,
    title: 'Fast-Track Growth',
    description: 'Accelerate your startup journey with expert guidance.',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Startup Founder',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    content: 'ICARUS helped me transform my business idea into a viable startup. The investor connections were invaluable.',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Tech Entrepreneur',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    content: 'The quality of courses and mentorship is unmatched. I learned more in 3 months than I did in a year on my own.',
  },
  {
    name: 'Emily Zhang',
    role: 'Product Manager',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    content: 'The practical approach to learning and real-world projects made all the difference in my entrepreneurial journey.',
  },
];

const stats = [
  { icon: <Users size={24} />, value: '15K+', label: 'Active Students' },
  { icon: <GraduationCap size={24} />, value: '50+', label: 'Expert Mentors' },
  { icon: <Award size={24} />, value: '95%', label: 'Success Rate' },
  { icon: <LineChart size={24} />, value: '$10M+', label: 'Funding Raised' },
];

const benefits = [
  {
    icon: <BookMarked size={24} />,
    title: 'Structured Learning',
    description: 'Carefully crafted curriculum designed for maximum impact',
  },
  {
    icon: <Target size={24} />,
    title: 'Goal-Oriented',
    description: 'Clear milestones and achievable objectives',
  },
  {
    icon: <MessageCircle size={24} />,
    title: 'Expert Support',
    description: '24/7 access to mentors and community',
  },
  {
    icon: <Hexagon size={24} />,
    title: 'Industry Network',
    description: 'Connect with leaders and innovators',
  },
];

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'background.paper',
    }}>
      {/* Navbar */}
      <AppBar 
        position="sticky" 
        color="transparent" 
        elevation={0}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: 'blur(8px)',
        }}
      >
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
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
            }}
          >
            Start Learning
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: { xs: 4, md: 12 },
          mb: { xs: 6, md: 12 },
          textAlign: 'center',
        }}
      >
        <Box sx={{ maxWidth: '800px', mx: 'auto', px: 2 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Elevate Your Startup Journey with ICARUS
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 6, lineHeight: 1.6 }}
          >
            Transform your entrepreneurial dreams into reality through expert-led courses,
            hands-on learning, and direct connections with investors.
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 500,
              }}
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/courses"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 500,
              }}
            >
              Explore Courses
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
        <Grid container spacing={3} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  textAlign: 'center',
                  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: { xs: 8, md: 12 } }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Why Choose ICARUS
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <CardContent sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4,
                }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'grey.50',
          py: { xs: 8, md: 12 },
          borderTop: `1px solid ${theme.palette.divider}`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Benefits of Learning with Us
          </Typography>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      height: 'fit-content',
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ my: { xs: 8, md: 12 } }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Success Stories
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4,
                  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white',
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    src={testimonial.avatar}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    flex: 1,
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                  }}
                >
                  "{testimonial.content}"
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: { xs: 8, md: 12 } }}>
        <Card
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23FFFFFF" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              position: 'relative',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Start Your Journey Today
          </Typography>
          <Typography
            sx={{
              mb: 4,
              position: 'relative',
              fontSize: '1.1rem',
              opacity: 0.9,
            }}
          >
            Join our community of entrepreneurs and turn your vision into reality.
          </Typography>
          <Button
            component={RouterLink}
            to="/signup"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Get Started Now
          </Button>
        </Card>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'grey.50',
          borderTop: `1px solid ${theme.palette.divider}`,
          pt: 8,
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rocket size={24} color={theme.palette.primary.main} />
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                  ICARUS
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: '300px' }}
              >
                Empowering entrepreneurs with expert-led education and investor connections.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[Twitter, Linkedin, Github, Mail].map((Icon, index) => (
                  <IconButton
                    key={index}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'grey.100',
                      },
                    }}
                  >
                    <Icon size={20} />
                  </IconButton>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                {[
                  {
                    title: 'Platform',
                    links: ['Courses', 'Mentorship', 'Investors', 'Community'],
                  },
                  {
                    title: 'Company',
                    links: ['About', 'Careers', 'Blog', 'Press'],
                  },
                  {
                    title: 'Resources',
                    links: ['Documentation', 'Help Center', 'Terms', 'Privacy'],
                  },
                ].map((section, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      {section.title}
                    </Typography>
                    {section.links.map((link, linkIndex) => (
                      <Typography
                        key={linkIndex}
                        component={RouterLink}
                        to="#"
                        variant="body2"
                        sx={{
                          display: 'block',
                          mb: 1.5,
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': {
                            color: 'primary.main',
                          },
                        }}
                      >
                        {link}
                      </Typography>
                    ))}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{
              '& a': {
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              },
            }}
          >
            © {new Date().getFullYear()} ICARUS. All rights reserved. Made with 🚀 for entrepreneurs.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
