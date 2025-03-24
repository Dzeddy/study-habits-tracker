import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { login, clearError } from '../../slices/authSlice';
import { Container, Typography, TextField, Button, Paper, Box, Link, Snackbar, Alert, CircularProgress } from '@mui/material';

const Login = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const { email, password } = formData;
  
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear field-specific error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(login({ email, password }));
    }
  };
  
  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Sign in to continue tracking your study progress
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2">
              Don't have an account? Sign up
            </Link>
          </Box>
        </Box>
      </Paper>
      
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login; 