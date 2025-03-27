import authReducer, { login, register, logout } from '../../slices/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Auth Slice', () => {
  let store;
  
  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer }
    });
  });

  test('should return the initial state', () => {
    const state = store.getState().auth;
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBeFalsy();
    expect(state.loading).toBeFalsy();
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  test('should handle successful login', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    const mockToken = 'test-token';
    
    axios.post.mockResolvedValueOnce({ 
      data: { token: mockToken, user: mockUser }
    });
    
    await store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
    
    const state = store.getState().auth;
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBeTruthy();
    expect(state.loading).toBeFalsy();
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  test('should handle login failure', async () => {
    const errorMessage = "Invalid credentials";
    
    axios.post.mockRejectedValueOnce({ 
      response: { data: { message: errorMessage } }
    });
    
    await store.dispatch(login({ email: 'wrong@example.com', password: 'wrongpassword' }));
    
    const state = store.getState().auth;
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBeFalsy();
    expect(state.loading).toBeFalsy();
    expect(state.user).toBeNull();
    expect(state.error).toBe(errorMessage);
  });

  test('should handle logout', async () => {
    // First login to set the state
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    const mockToken = 'test-token';
    
    axios.post.mockResolvedValueOnce({ 
      data: { token: mockToken, user: mockUser }
    });
    
    await store.dispatch(login({ email: 'test@example.com', password: 'password123' }));
    
    // Then logout
    await store.dispatch(logout());
    
    const state = store.getState().auth;
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBeFalsy();
    expect(state.user).toBeNull();
  });
}); 