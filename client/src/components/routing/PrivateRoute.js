import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loadUser } from '../../slices/authSlice';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, token } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (token && !isAuthenticated && !loading) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated, loading, token]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute; 