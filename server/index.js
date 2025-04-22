require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const studySessionRoutes = require('./routes/studySessions');
const userRoutes = require('./routes/users');
const socialRoutes = require('./routes/social');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stdy-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/study-sessions', studySessionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/social', socialRoutes);

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
  });
  
  socket.on('start-study-session', (data) => {
    socket.to(`user-${data.userId}`).emit('friend-started-studying', data);
  });
  
  socket.on('end-study-session', (data) => {
    socket.to(`user-${data.userId}`).emit('friend-ended-studying', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Export for testing purposes
if (process.env.NODE_ENV === 'test') {
  module.exports = { app, server, io };
} else {
  // Start server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  
  // Also export io for testing even in non-test environments
  module.exports = { io };
} 