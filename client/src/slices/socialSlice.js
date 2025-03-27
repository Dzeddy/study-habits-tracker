import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Get friends
export const getFriends = createAsyncThunk(
  'social/getFriends',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const response = await axios.get(`${API_URL}/social/friends`, config);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch friends'
      );
    }
  }
);

// Get friend requests
export const getFriendRequests = createAsyncThunk(
  'social/getFriendRequests',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const response = await axios.get(`${API_URL}/social/friend-requests`, config);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch friend requests'
      );
    }
  }
);

// Send friend request
export const sendFriendRequest = createAsyncThunk(
  'social/sendFriendRequest',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const response = await axios.post(
        `${API_URL}/social/friend-request/${userId}`,
        {},
        config
      );
      
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send friend request'
      );
    }
  }
);

// Accept friend request
export const acceptFriendRequest = createAsyncThunk(
  'social/acceptFriendRequest',
  async (userId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const response = await axios.post(
        `${API_URL}/social/accept-request/${userId}`,
        {},
        config
      );
      
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to accept friend request'
      );
    }
  }
);

// Get leaderboard
export const getLeaderboard = createAsyncThunk(
  'social/getLeaderboard',
  async (timeframe = 'weekly', { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        },
        params: { timeframe }
      };
      
      const response = await axios.get(`${API_URL}/social/leaderboard`, config);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leaderboard'
      );
    }
  }
);

const initialState = {
  friends: [],
  friendRequests: [],
  leaderboard: [],
  loading: false,
  error: null,
  successMessage: null
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    clearSocialError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Friends
      .addCase(getFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(getFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Friend Requests
      .addCase(getFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = action.payload;
      })
      .addCase(getFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send Friend Request
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept Friend Request
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.friendRequests = state.friendRequests.filter(
          request => request._id !== action.payload.userId
        );
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Leaderboard
      .addCase(getLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboard = action.payload;
      })
      .addCase(getLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSocialError, clearSuccessMessage } = socialSlice.actions;
export default socialSlice.reducer; 