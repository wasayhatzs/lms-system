import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Slide
} from '@mui/material';
import { Award } from 'lucide-react';
import type { QuizCompletionDialogProps } from '../types/database';
import Certificate from './Certificate';

const QuizCompletionDialog: React.FC<QuizCompletionDialogProps> = ({ 
  open, 
  onClose, 
  score, 
  courseTitle, 
  userName 
}) => {
  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' as const }}
    >
      {!showCertificate ? (
        <>
          <DialogTitle>Quiz Results</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quiz Results
              </Typography>
              <Typography variant="h4" color={score >= 70 ? 'success.main' : 'error.main'}>
                {score}%
              </Typography>
              <Alert severity={score >= 70 ? 'success' : 'error'} sx={{ mt: 2 }}>
                {score >= 70
                  ? 'Congratulations! You passed the quiz and earned a certificate!'
                  : 'Keep learning and try again!'}
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            {score >= 70 && (
              <Button
                variant="contained"
                onClick={() => setShowCertificate(true)}
                startIcon={<Award />}
              >
                View Certificate
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </>
      ) : (
        <DialogContent>
          <Certificate
            courseTitle={courseTitle}
            userName={userName}
            completionDate={new Date()}
            quizScore={score}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button onClick={onClose}>Close</Button>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default QuizCompletionDialog;