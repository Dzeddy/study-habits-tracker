import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest, clearSuccessMessage, clearSocialError } from '../../slices/socialSlice';
import { Container, Grid, Paper, Typography, Box, Button, TextField, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Snackbar, Alert, CircularProgress, Tabs, Tab } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';

const Friends = () => {
  const dispatch = useDispatch();
  const { friends, friendRequests, loading, error, successMessage } = useSelector(state => state.social);
  
  const [username, setUsername] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    dispatch(getFriends());
    dispatch(getFriendRequests());
  }, [dispatch]);
  
  // Add a separate effect to refresh data when success message changes
  useEffect(() => {
    if (successMessage) {
      dispatch(getFriends());
      dispatch(getFriendRequests());
      
      // Clear the success message after a delay
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);
  
  const handleSendRequest = () => {
    if (username.trim()) {
      dispatch(sendFriendRequest(username.trim()))
        .unwrap()
        .then(() => {
          setUsername('');
        })
        .catch((error) => {
          // Error is already handled by the slice
          console.error("Friend request error:", error);
        });
    }
  };
  
  const handleAcceptRequest = (userId) => {
    dispatch(acceptFriendRequest(userId)).then((result) => {
      if (!result.error) {
        // Refresh friends list after successful acceptance
        dispatch(getFriends());
      }
    });
  };
  
  const handleCloseSnackbar = () => {
    if (error) {
      dispatch(clearSocialError());
    }
    if (successMessage) {
      dispatch(clearSuccessMessage());
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Friends
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Find Friend by Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleSendRequest}
            disabled={!username.trim() || loading}
          >
            Send Friend Request
          </Button>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="friend tabs">
              <Tab label="My Friends" id="tab-0" />
              <Tab 
                label={`Friend Requests ${friendRequests.length > 0 ? `(${friendRequests.length})` : ''}`} 
                id="tab-1" 
              />
            </Tabs>
          </Box>
          
          <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" sx={{ py: 2 }}>
            {loading && friends.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : friends.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                You don't have any friends yet. Send a friend request to get started!
              </Typography>
            ) : (
              <List>
                {friends.map((friend) => (
                  <React.Fragment key={friend._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt={friend.username} src={friend.profilePicture} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={friend.username}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              Total Study Time: {formatTime(friend.totalStudyTime || 0)}
                            </Typography>
                            <br />
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              Current Streak: {friend.streak || 0} days
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
          </Box>
          
          <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" sx={{ py: 2 }}>
            {loading && friendRequests.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
              </Box>
            ) : friendRequests.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                You don't have any friend requests.
              </Typography>
            ) : (
              <List>
                {friendRequests.map((request) => (
                  <React.Fragment key={request._id}>
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<CheckIcon />}
                          onClick={() => handleAcceptRequest(request._id)}
                        >
                          Accept
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar alt={request.username} src={request.profilePicture} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={request.username}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Paper>
      
      <Snackbar
        open={!!error || !!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'} 
          sx={{ width: '100%' }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Friends; 