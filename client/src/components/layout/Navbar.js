import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logout } from '../../slices/authSlice';
import { getFriendsStudySessions } from '../../slices/socialSlice';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, Avatar, Divider, ListItemIcon, Badge, Tooltip, List, ListItem, ListItemText, ListItemAvatar, Paper, Popover, Chip, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimerIcon from '@mui/icons-material/Timer';
import PeopleIcon from '@mui/icons-material/People';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { friendsStudySessions } = useSelector(state => state.social);
  
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [activityAnchor, setActivityAnchor] = useState(null);
  
  // Fetch friends' study sessions
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getFriendsStudySessions());
      console.log('Fetching friends study sessions');
      
      // Poll for updates every 2 minutes
      const interval = setInterval(() => {
        dispatch(getFriendsStudySessions());
        console.log('Polling for friends study sessions');
      }, 2 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [dispatch, isAuthenticated]);
  
  // Log when friends study sessions change
  useEffect(() => {
    console.log('Friends study sessions:', friendsStudySessions);
  }, [friendsStudySessions]);
  
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };
  
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  
  const handleActivityOpen = (event) => {
    setActivityAnchor(event.currentTarget);
  };
  
  const handleActivityClose = () => {
    setActivityAnchor(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate('/');
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
    handleProfileMenuClose();
    handleActivityClose();
  };
  
  // Format time for display
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
  
  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  
  const mobileMenuId = 'mobile-menu';
  const profileMenuId = 'profile-menu';
  const activityMenuId = 'activity-menu';
  
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      id={mobileMenuId}
      keepMounted
      open={Boolean(mobileMenuAnchor)}
      onClose={handleMobileMenuClose}
    >
      {isAuthenticated ? (
        <>
          <MenuItem onClick={() => handleNavigation('/dashboard')}>
            <ListItemIcon>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            Dashboard
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/study')}>
            <ListItemIcon>
              <TimerIcon fontSize="small" />
            </ListItemIcon>
            Study
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/friends')}>
            <ListItemIcon>
              <PeopleIcon fontSize="small" />
            </ListItemIcon>
            Friends
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/leaderboard')}>
            <ListItemIcon>
              <LeaderboardIcon fontSize="small" />
            </ListItemIcon>
            Leaderboard
          </MenuItem>
          <MenuItem onClick={handleActivityOpen}>
            <ListItemIcon>
              <Badge 
                color="error" 
                badgeContent={friendsStudySessions ? friendsStudySessions.filter(s => s.isActive).length : 0}
                invisible={!friendsStudySessions || friendsStudySessions.filter(s => s.isActive).length === 0}
              >
                <NotificationsIcon fontSize="small" />
              </Badge>
            </ListItemIcon>
            Activity Feed
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleNavigation('/profile')}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </>
      ) : (
        <>
          <MenuItem onClick={() => handleNavigation('/login')}>
            Login
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/register')}>
            Register
          </MenuItem>
        </>
      )}
    </Menu>
  );
  
  const renderProfileMenu = (
    <Menu
      anchorEl={profileMenuAnchor}
      id={profileMenuId}
      keepMounted
      open={Boolean(profileMenuAnchor)}
      onClose={handleProfileMenuClose}
    >
      <MenuItem onClick={() => handleNavigation('/profile')}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
  
  const renderActivityMenu = (
    <Popover
      id={activityMenuId}
      anchorEl={activityAnchor}
      keepMounted
      open={Boolean(activityAnchor)}
      onClose={handleActivityClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        style: {
          width: '360px',
          maxHeight: '450px',
          overflowY: 'auto'
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          Friends' Activity
          {friendsStudySessions && friendsStudySessions.filter(s => s.isActive).length > 0 && (
            <Chip 
              size="small" 
              color="error" 
              label={`${friendsStudySessions.filter(s => s.isActive).length} active`} 
              sx={{ ml: 1 }}
            />
          )}
        </Typography>
      </Box>
      
      {friendsStudySessions && friendsStudySessions.length > 0 ? (
        <List>
          {friendsStudySessions.map((session) => (
            <ListItem 
              key={session._id}
              alignItems="flex-start"
              divider
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                backgroundColor: session.isActive ? 'rgba(255, 0, 0, 0.03)' : 'transparent'
              }}
            >
              <ListItemAvatar>
                <Avatar 
                  alt={session.user.username} 
                  src={session.user.profilePicture} 
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">
                    {session.user.username} {session.isActive ? 'is studying' : 'studied'} {session.subject}
                    {session.isActive && (
                      <Chip 
                        size="small" 
                        label="LIVE" 
                        color="error" 
                        variant="outlined" 
                        sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      {session.isActive ? 'Currently active' : formatTime(session.duration || 0)}
                    </Typography>
                    <br />
                    {session.tags && session.tags.length > 0 && (
                      <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                        {session.tags.map((tag, index) => (
                          <Chip 
                            key={index} 
                            label={tag} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        ))}
                      </Stack>
                    )}
                    <Typography component="span" variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {session.isActive ? '' : formatRelativeTime(session.endTime || session.startTime)}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No recent activity from your friends.
          </Typography>
        </Box>
      )}
    </Popover>
  );
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold'
            }}
          >
            STDY
          </Typography>
          
          {/* Desktop menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/dashboard"
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/study"
                  startIcon={<TimerIcon />}
                >
                  Study
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/friends"
                  startIcon={<PeopleIcon />}
                >
                  Friends
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/leaderboard"
                  startIcon={<LeaderboardIcon />}
                >
                  Leaderboard
                </Button>
                <Tooltip title="Activity Feed">
                  <IconButton
                    color="inherit"
                    onClick={handleActivityOpen}
                    aria-label="friends activity"
                    aria-controls={activityMenuId}
                    aria-haspopup="true"
                  >
                    <Badge 
                      color="error" 
                      badgeContent={friendsStudySessions ? friendsStudySessions.filter(s => s.isActive).length : 0}
                      invisible={!friendsStudySessions || friendsStudySessions.filter(s => s.isActive).length === 0}
                    >
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={profileMenuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar 
                    alt={user?.username} 
                    src={user?.profilePicture}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
          
          {/* Mobile menu button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderProfileMenu}
      {renderActivityMenu}
    </>
  );
};

export default Navbar; 