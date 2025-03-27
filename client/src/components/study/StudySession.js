import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startStudySession, endStudySession, updateTimer } from '../../slices/studySlice';
import { Box, Button, Container, Typography, TextField, MenuItem, Paper, Rating, CircularProgress, Chip, Stack } from '@mui/material';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';

const subjects = [
  'Mathematics',
  'Science',
  'History',
  'English',
  'Computer Science',
  'Foreign Language',
  'Art',
  'Music',
  'Physical Education',
  'Other'
];

const StudySession = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { activeSession, loading } = useSelector(state => state.study);
  
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [timer, setTimer] = useState(0);
  const [productivityRating, setProductivityRating] = useState(3);
  const [notes, setNotes] = useState('');
  
  const timerRef = useRef(null);
  const socketRef = useRef(null);
  
  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Connect to socket.io
  useEffect(() => {
    if (user) {
      socketRef.current = io(SOCKET_URL);
      socketRef.current.emit('join-user-room', user.id);
      
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user]);
  
  // Handle active session and timer
  useEffect(() => {
    if (activeSession) {
      // Calculate elapsed time
      const startTime = new Date(activeSession.startTime).getTime();
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setTimer(elapsedSeconds);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => {
          const newTimer = prevTimer + 1;
          dispatch(updateTimer(Math.floor(newTimer / 60))); // Update duration in minutes
          return newTimer;
        });
      }, 1000);
      
      // Set form values from active session
      setSubject(activeSession.subject || '');
      setTags(activeSession.tags?.join(', ') || '');
      setLocation(activeSession.location || '');
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeSession, dispatch]);
  
  // Handle start session
  const handleStartSession = () => {
    if (!subject) {
      return;
    }
    
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
    
    dispatch(startStudySession({
      subject,
      tags: tagArray,
      location
    }));
    
    // Notify friends
    if (socketRef.current) {
      socketRef.current.emit('start-study-session', {
        userId: user.id,
        username: user.username,
        subject
      });
    }
  };
  
  // Handle end session
  const handleEndSession = () => {
    if (!activeSession) {
      return;
    }
    
    dispatch(endStudySession({
      sessionId: activeSession._id,
      productivityRating,
      notes
    }));
    
    // Notify friends
    if (socketRef.current) {
      socketRef.current.emit('end-study-session', {
        userId: user.id,
        username: user.username,
        subject: activeSession.subject,
        duration: Math.floor(timer / 60) // in minutes
      });
    }
    
    // Reset form
    setProductivityRating(3);
    setNotes('');
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          {activeSession ? 'Current Study Session' : 'Start a Study Session'}
        </Typography>
        
        {activeSession ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Typography variant="h2" sx={{ fontFamily: 'monospace' }}>
                {formatTime(timer)}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Subject: {activeSession.subject}
              </Typography>
              
              {activeSession.tags && activeSession.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  {activeSession.tags.map((tag, index) => (
                    <Chip key={index} label={tag} color="primary" variant="outlined" />
                  ))}
                </Stack>
              )}
              
              {activeSession.location && (
                <Typography variant="body1" gutterBottom>
                  Location: {activeSession.location}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Rate your productivity:
              </Typography>
              <Rating
                name="productivity"
                value={productivityRating}
                onChange={(_, newValue) => setProductivityRating(newValue)}
                size="large"
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Session Notes"
                multiline
                rows={4}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                variant="outlined"
              />
            </Box>
            
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              onClick={handleEndSession}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'End Session'}
            </Button>
          </Box>
        ) : (
          <Box>
            <TextField
              select
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              required
            >
              {subjects.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              helperText="E.g. homework, exam prep, reading"
            />
            
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
              helperText="E.g. library, home, coffee shop"
            />
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleStartSession}
              disabled={!subject || loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Start Studying'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default StudySession; 