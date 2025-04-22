import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studyReducer from './slices/studySlice';
import socialReducer from './slices/socialSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    study: studyReducer,
    social: socialReducer
  }
});

export default store; 