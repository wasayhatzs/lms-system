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
  Avatar,
  Chip,
  Alert,
  Fade,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Building2, Mail, DollarSign, Award, Lock, Unlock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type { InvestorProfile, Certificate } from '../types/database';

const SAMPLE_INVESTORS = [
  {
    id: '1',
    name: 'Sarah Chen',
    company_name: 'Beyond Capital Ventures',
    bio: 'Early-stage investor focusing on AI and EdTech startups with proven traction.',
    investment_range: '$500K - $2M',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    company_name: 'Future Fund Partners',
    bio: 'Seeking innovative startups in education technology and digital transformation.',
    investment_range: '$250K - $1M',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  },
  {
    id: '3',
    name: 'Emily Zhang',
    company_name: 'Horizon Ventures',
    bio: 'Passionate about supporting diverse founders in the education space.',
    investment_range: '$1M - $5M',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  },
];

export default function Investors() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<typeof SAMPLE_INVESTORS[0] | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showTestingButton, setShowTestingButton] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const [certificatesResponse, accessResponse] = await Promise.all([
          supabase
            .from('certificates')
            .select('*')
            .eq('user_id', user?.id),
          supabase
            .from('investor_access')
            .select('*')
            .eq('user_id', user?.id)
            .single(),
        ]);

        if (certificatesResponse.error) throw certificatesResponse.error;

        setCertificates(certificatesResponse.data);
        setHasAccess(!!accessResponse.data || certificatesResponse.data.length > 0);
      } catch (error) {
        console.error('Error checking investor access:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user]);

  const handleContactInvestor = (investor: typeof SAMPLE_INVESTORS[0]) => {
    setSelectedInvestor(investor);
    setContactDialogOpen(true);
  };

  const handleSendMessage = async () => {
    // In a real app, implement message sending logic
    console.log('Sending message to investor:', selectedInvestor?.name, message);
    setContactDialogOpen(false);
    setMessage('');
  };

  const handleTestingAccess = async () => {
    try {
      await supabase.from('investor_access').insert({
        user_id: user?.id,
      });
      setHasAccess(true);
      setShowTestingButton(false);
    } catch (error) {
      console.error('Error granting investor access:', error);
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
      <Fade in timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Investor Network
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Connect with investors interested in supporting educational technology startups.
          </Typography>
        </Box>
      </Fade>

      {!hasAccess ? (
        <Fade in timeout={1000}>
          <Alert
            severity="info"
            sx={{ mb: 4 }}
            icon={<Lock />}
            action={
              showTestingButton ? (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={handleTestingAccess}
                  startIcon={<Unlock />}
                >
                  Enable Testing Access
                </Button>
              ) : (
                <Button color="inherit" size="small" href="/courses">
                  View Courses
                </Button>
              )
            }
          >
            Complete at least one course to unlock access to our investor network.
          </Alert>
        </Fade>
      ) : null}

      <Grid container spacing={4}>
        {hasAccess && SAMPLE_INVESTORS.map((investor, index) => (
          <Slide direction="up" in timeout={1000 + index * 200} key={investor.id}>
            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                    <Avatar
                      src={investor.image_url}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {investor.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Building2 size={16} />
                        <Typography variant="body2" color="text.secondary">
                          {investor.company_name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <DollarSign size={16} />
                        <Typography variant="body2" color="text.secondary">
                          {investor.investment_range}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body1" paragraph>
                    {investor.bio}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Chip
                      icon={<Award size={16} />}
                      label="Verified Investor"
                      color="primary"
                      variant="outlined"
                    />
                    <Button
                      variant="contained"
                      startIcon={<Mail />}
                      fullWidth
                      onClick={() => handleContactInvestor(investor)}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      Request Introduction
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Slide>
        ))}
      </Grid>

      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
      >
        <DialogTitle>Contact {selectedInvestor?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Write a brief message introducing yourself and your startup idea.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}