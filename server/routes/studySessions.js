const express = require('express');
const router = express.Router();
const StudySession = require('../models/StudySession');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Start a new study session
router.post('/', auth, async (req, res) => {
  try {
    const { subject, tags, location } = req.body;
    
    // Create new study session
    const newSession = new StudySession({
      user: req.user.id,
      subject,
      tags,
      location,
      startTime: new Date()
    });
    
    await newSession.save();
    
    // Update user's last study date
    await User.findByIdAndUpdate(req.user.id, {
      lastStudyDate: new Date()
    });
    
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// End a study session
router.put('/:id/end', auth, async (req, res) => {
  try {
    const { productivityRating, notes } = req.body;
    
    // Find the session
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user.id,
      isActive: true
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Active session not found' });
    }
    
    // End the session
    await session.endSession(productivityRating, notes);
    
    // Update user's total study time
    const user = await User.findById(req.user.id);
    user.totalStudyTime += session.duration;
    
    // Update streak
    const today = new Date().setHours(0, 0, 0, 0);
    const lastStudyDay = user.lastStudyDate ? new Date(user.lastStudyDate).setHours(0, 0, 0, 0) : null;
    
    if (!lastStudyDay) {
      user.streak = 1;
    } else if (today - lastStudyDay <= 86400000) {
      // If last study was today, don't change streak
    } else if (today - lastStudyDay <= 172800000) {
      // If last study was yesterday, increment streak
      user.streak += 1;
    } else {
      // If last study was more than a day ago, reset streak
      user.streak = 1;
    }
    
    user.lastStudyDate = new Date();
    await user.save();
    
    res.json(session);
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's study sessions
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, subject } = req.query;
    const query = { user: req.user.id };
    
    // Add date filters if provided
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }
    
    // Add subject filter if provided
    if (subject) query.subject = subject;
    
    const sessions = await StudySession.find(query)
      .sort({ startTime: -1 });
    
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get study session by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 