import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaderboard } from '../../slices/socialSlice';
import { Container, Paper, Typography, Box, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider, CircularProgress } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const { leaderboard, loading } = useSelector(state => state.social);
  const { user } = useSelector(state => state.auth);
  
  const [timeframe, setTimeframe] = useState('weekly');
  
  useEffect(() => {
    dispatch(getLeaderboard(timeframe));
  }, [dispatch, timeframe]);
  
  const handleTimeframeChange = (event, newTimeframe) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };
  
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
  
  // Get medal color based on position
  const getMedalColor = (position) => {
    switch (position) {
      case 0:
        return '#FFD700'; // Gold
      case 1:
        return '#C0C0C0'; // Silver
      case 2:
        return '#CD7F32'; // Bronze
      default:
        return 'transparent';
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Leaderboard
          </Typography>
          
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={handleTimeframeChange}
            aria-label="timeframe"
          >
            <ToggleButton value="daily" aria-label="daily">
              Daily
            </ToggleButton>
            <ToggleButton value="weekly" aria-label="weekly">
              Weekly
            </ToggleButton>
            <ToggleButton value="monthly" aria-label="monthly">
              Monthly
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <Typography variant="subtitle1" gutterBottom>
          {timeframe === 'daily' ? 'Today\'s' : timeframe === 'weekly' ? 'This Week\'s' : 'This Month\'s'} Top Studiers
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : leaderboard.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 5 }}>
            No study data available for this timeframe.
          </Typography>
        ) : (
          <List>
            {leaderboard.map((entry, index) => (
              <React.Fragment key={entry.user._id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: entry.user._id === user?.id ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    borderRadius: 1
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: getMedalColor(index),
                      color: index <= 2 ? '#000' : 'text.primary',
                      fontWeight: 'bold',
                      mr: 2
                    }}
                  >
                    {index <= 2 ? (
                      <EmojiEventsIcon />
                    ) : (
                      index + 1
                    )}
                  </Box>
                  
                  <ListItemAvatar>
                    <Avatar alt={entry.user.username} src={entry.user.profilePicture} />
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={entry.user._id === user?.id ? 'bold' : 'normal'}>
                        {entry.user.username} {entry.user._id === user?.id && '(You)'}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Total Study Time: {formatTime(entry.totalTime)}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          Sessions: {entry.sessions} • Streak: {entry.user.streak || 0} days
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Leaderboard; 