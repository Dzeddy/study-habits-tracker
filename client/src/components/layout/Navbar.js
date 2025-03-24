import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logout } from '../../slices/authSlice';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, Avatar, Divider, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimerIcon from '@mui/icons-material/Timer';
import PeopleIcon from '@mui/icons-material/People';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  
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
  
  const handleLogout = () => {
    dispatch(logout());
    handleProfileMenuClose();
    navigate('/');
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
    handleProfileMenuClose();
  };
  
  const mobileMenuId = 'mobile-menu';
  const profileMenuId = 'profile-menu';
  
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
    </>
  );
};

export default Navbar; 