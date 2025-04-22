import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Start a study session
export const startStudySession = createAsyncThunk(
  'study/startSession',
  async ({ subject, tags, location }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      const response = await axios.post(
        `${API_URL}/study-sessions`,
        { subject, tags, location },
        config
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to start session'
      );
    }
  }
);

// End a study session
export const endStudySession = createAsyncThunk(
  'study/endSession',
  async ({ sessionId, productivityRating, notes }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      const response = await axios.put(
        `${API_URL}/study-sessions/${sessionId}/end`,
        { productivityRating, notes },
        config
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to end session'
      );
    }
  }
);

// Get user's study sessions
export const getStudySessions = createAsyncThunk(
  'study/getSessions',
  async ({ startDate, endDate, subject }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      if (!token) {
        return rejectWithValue('No authentication token');
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        },
        params: {}
      };
      
      if (startDate) config.params.startDate = startDate;
      if (endDate) config.params.endDate = endDate;
      if (subject) config.params.subject = subject;
      
      const response = await axios.get(`${API_URL}/study-sessions`, config);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch sessions'
      );
    }
  }
);

const initialState = {
  sessions: [],
  activeSession: null,
  loading: false,
  error: null,
  stats: {
    totalTime: 0,
    averageRating: 0,
    totalSessions: 0,
    subjectDistribution: {}
  }
};

const studySlice = createSlice({
  name: 'study',
  initialState,
  reducers: {
    clearStudyError: (state) => {
      state.error = null;
    },
    updateTimer: (state, action) => {
      if (state.activeSession) {
        state.activeSession.duration = action.payload;
      }
    },
    calculateStats: (state) => {
      // Calculate total study time
      state.stats.totalTime = state.sessions.reduce(
        (total, session) => total + (session.duration || 0),
        0
      );
      
      // Calculate average productivity rating
      const ratedSessions = state.sessions.filter(
        session => session.productivityRating
      );
      
      if (ratedSessions.length > 0) {
        const totalRating = ratedSessions.reduce(
          (sum, session) => sum + session.productivityRating,
          0
        );
        state.stats.averageRating = totalRating / ratedSessions.length;
      }
      
      // Calculate total number of sessions
      state.stats.totalSessions = state.sessions.length;
      
      // Calculate subject distribution
      const subjectDistribution = {};
      
      state.sessions.forEach(session => {
        if (session.subject) {
          if (subjectDistribution[session.subject]) {
            subjectDistribution[session.subject] += session.duration || 0;
          } else {
            subjectDistribution[session.subject] = session.duration || 0;
          }
        }
      });
      
      state.stats.subjectDistribution = subjectDistribution;
    }
  },
  extraReducers: (builder) => {
    builder
      // Start Session
      .addCase(startStudySession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startStudySession.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSession = action.payload;
      })
      .addCase(startStudySession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // End Session
      .addCase(endStudySession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endStudySession.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSession = null;
        
        // Update the session in the sessions array
        const index = state.sessions.findIndex(
          session => session._id === action.payload._id
        );
        
        if (index !== -1) {
          state.sessions[index] = action.payload;
        } else {
          state.sessions.push(action.payload);
        }
      })
      .addCase(endStudySession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Sessions
      .addCase(getStudySessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudySessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
        
        // Check if there's an active session
        const activeSession = action.payload.find(session => session.isActive);
        state.activeSession = activeSession || null;
      })
      .addCase(getStudySessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearStudyError, updateTimer, calculateStats } = studySlice.actions;
export default studySlice.reducer; 