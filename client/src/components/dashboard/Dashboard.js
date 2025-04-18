import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudySessions, calculateStats } from '../../slices/studySlice';
import { Link } from 'react-router-dom';
import { 
  Container, Grid, Paper, Typography, Box, Button, CircularProgress, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, Chip, List, ListItem, ListItemText
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { sessions, stats, loading, activeSession } = useSelector(state => state.study);
  
  // Add state for session detail dialog
  const [selectedSession, setSelectedSession] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    // Get sessions from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    dispatch(getStudySessions({
      startDate: thirtyDaysAgo.toISOString(),
      endDate: new Date().toISOString()
    }));
  }, [dispatch]);
  
  useEffect(() => {
    if (sessions.length > 0) {
      dispatch(calculateStats());
    }
  }, [sessions, dispatch]);
  
  // Format minutes to hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  };
  
  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Handle opening the session detail dialog
  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setDialogOpen(true);
  };
  
  // Handle closing the session detail dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  // Prepare data for pie chart
  const prepareSubjectData = () => {
    return Object.entries(stats.subjectDistribution || {}).map(([subject, time]) => ({
      name: subject,
      value: time
    }));
  };
  
  // Prepare data for bar chart (last 7 days)
  const prepareWeeklyData = () => {
    const last7Days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayStudy = sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= date && sessionDate < nextDate;
      });
      
      const totalMinutes = dayStudy.reduce((total, session) => total + (session.duration || 0), 0);
      
      last7Days.push({
        name: dayNames[date.getDay()],
        minutes: totalMinutes
      });
    }
    
    return last7Days;
  };
  
  if (loading && sessions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4">
                Welcome back, {user?.username}!
              </Typography>
              
              {activeSession ? (
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/study"
                >
                  Resume Study Session
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/study"
                >
                  Start Studying
                </Button>
              )}
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    Total Study Time
                  </Typography>
                  <Typography variant="h3">
                    {formatTime(stats.totalTime || 0)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    Current Streak
                  </Typography>
                  <Typography variant="h3">
                    {user?.streak || 0} days
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    Sessions This Month
                  </Typography>
                  <Typography variant="h3">
                    {stats.totalSessions || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Weekly Activity Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Activity
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={prepareWeeklyData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} min`, 'Study Time']} />
                <Legend />
                <Bar dataKey="minutes" fill="#8884d8" name="Study Time" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Subject Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Subject Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={prepareSubjectData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {prepareSubjectData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatTime(value), 'Study Time']} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Recent Sessions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Study Sessions
            </Typography>
            {sessions.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No study sessions yet. Start studying to see your progress!
              </Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 650, display: 'table', width: '100%' }}>
                  <Box sx={{ display: 'table-header-group' }}>
                    <Box sx={{ display: 'table-row' }}>
                      <Typography sx={{ display: 'table-cell', fontWeight: 'bold', p: 1 }}>Subject</Typography>
                      <Typography sx={{ display: 'table-cell', fontWeight: 'bold', p: 1 }}>Date</Typography>
                      <Typography sx={{ display: 'table-cell', fontWeight: 'bold', p: 1 }}>Duration</Typography>
                      <Typography sx={{ display: 'table-cell', fontWeight: 'bold', p: 1 }}>Productivity</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'table-row-group' }}>
                    {sessions.slice(0, 5).map((session) => (
                      <Box 
                        key={session._id} 
                        sx={{ 
                          display: 'table-row',
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                        }}
                        onClick={() => handleSessionClick(session)}
                      >
                        <Typography sx={{ display: 'table-cell', p: 1 }}>{session.subject}</Typography>
                        <Typography sx={{ display: 'table-cell', p: 1 }}>
                          {new Date(session.startTime).toLocaleDateString()}
                        </Typography>
                        <Typography sx={{ display: 'table-cell', p: 1 }}>
                          {formatTime(session.duration || 0)}
                        </Typography>
                        <Typography sx={{ display: 'table-cell', p: 1 }}>
                          {session.productivityRating ? `${session.productivityRating}/5` : 'N/A'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Session Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedSession && (
          <>
            <DialogTitle>
              <Typography variant="h5">
                Study Session Details
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Subject" 
                        secondary={selectedSession.subject} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Start Time" 
                        secondary={formatDateTime(selectedSession.startTime)} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="End Time" 
                        secondary={selectedSession.endTime ? formatDateTime(selectedSession.endTime) : 'Session Active'} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Duration" 
                        secondary={formatTime(selectedSession.duration || 0)} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Status" 
                        secondary={selectedSession.isActive ? 'Active' : 'Completed'} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Productivity Rating" 
                        secondary={selectedSession.productivityRating ? `${selectedSession.productivityRating}/5` : 'Not Rated'} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Location" 
                        secondary={selectedSession.location || 'Not specified'} 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Tags" 
                        secondary={
                          selectedSession.tags && selectedSession.tags.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                              {selectedSession.tags.map((tag, index) => (
                                <Chip key={index} label={tag} size="small" />
                              ))}
                            </Box>
                          ) : 'No tags'
                        } 
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                {selectedSession.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Notes:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                      <Typography variant="body1">
                        {selectedSession.notes}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Database Information:
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                    <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(selectedSession, null, 2)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Dashboard; 