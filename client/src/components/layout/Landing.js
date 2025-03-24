import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Box, Paper, Card, CardContent, CardMedia } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Landing = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                STDY
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom>
                The Social Platform for Productive Studying
              </Typography>
              <Typography variant="body1" paragraph>
                Track your study sessions, connect with friends, and stay motivated with our gamified learning experience.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{ mr: 2, mb: 2 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={RouterLink}
                  to="/login"
                  sx={{ mb: 2 }}
                >
                  Login
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/study-hero.svg"
                alt="Students studying"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  display: { xs: 'none', md: 'block' }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Features
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Everything you need to boost your study productivity
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <TimerIcon color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent>
                <Typography variant="h6" component="h3" align="center" gutterBottom>
                  Study Session Tracking
                </Typography>
                <Typography variant="body2" align="center">
                  Record your study time, subjects, and productivity ratings to build consistent habits.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <PeopleIcon color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent>
                <Typography variant="h6" component="h3" align="center" gutterBottom>
                  Social Connections
                </Typography>
                <Typography variant="body2" align="center">
                  Connect with friends, see their study activity, and motivate each other.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <BarChartIcon color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent>
                <Typography variant="h6" component="h3" align="center" gutterBottom>
                  Analytics Dashboard
                </Typography>
                <Typography variant="body2" align="center">
                  Visualize your study patterns and track progress with detailed analytics.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <EmojiEventsIcon color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent>
                <Typography variant="h6" component="h3" align="center" gutterBottom>
                  Gamification
                </Typography>
                <Typography variant="body2" align="center">
                  Earn achievements, maintain streaks, and compete on leaderboards with friends.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
            Start boosting your productivity in three simple steps
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  1. Create Your Account
                </Typography>
                <Typography variant="body2" paragraph>
                  Sign up for free and set up your profile. Add your courses and study goals.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  2. Track Your Study Sessions
                </Typography>
                <Typography variant="body2" paragraph>
                  Use the timer to record your study sessions. Add details like subject, location, and productivity rating.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  3. Connect and Compete
                </Typography>
                <Typography variant="body2" paragraph>
                  Add friends, view leaderboards, and stay motivated with achievements and streaks.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Container maxWidth="md" sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Transform Your Study Habits?
        </Typography>
        <Typography variant="body1" paragraph>
          Join thousands of students who are improving their productivity and achieving their academic goals with STDY.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={RouterLink}
          to="/register"
          sx={{ mt: 2 }}
        >
          Get Started Now
        </Button>
      </Container>
    </Box>
  );
};

export default Landing; 