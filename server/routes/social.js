const express = require('express');
const router = express.Router();
const User = require('../models/User');
const StudySession = require('../models/StudySession');
const auth = require('../middleware/auth');

// Send friend request
router.post('/friend-request/:userId', auth, async (req, res) => {
  try {
    if (req.user.id === req.params.userId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }
    
    const recipient = await User.findById(req.params.userId);
    
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already friends
    if (recipient.friends.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }
    
    // Check if request already sent
    if (recipient.friendRequests.includes(req.user.id)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }
    
    // Add to friend requests
    recipient.friendRequests.push(req.user.id);
    await recipient.save();
    
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    console.error('Friend request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept friend request
router.post('/accept-request/:userId', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if request exists
    if (!currentUser.friendRequests.includes(req.params.userId)) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }
    
    const requester = await User.findById(req.params.userId);
    
    if (!requester) {
      return res.status(404).json({ message: 'Requesting user not found' });
    }
    
    // Add to friends for both users
    currentUser.friends.push(req.params.userId);
    requester.friends.push(req.user.id);
    
    // Remove from friend requests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      id => id.toString() !== req.params.userId
    );
    
    await currentUser.save();
    await requester.save();
    
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friend requests
router.get('/friend-requests', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friendRequests', 'username profilePicture');
    
    res.json(user.friendRequests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friends
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friends', 'username profilePicture totalStudyTime streak');
    
    res.json(user.friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { timeframe } = req.query;
    let startDate;
    
    // Set timeframe filter
    if (timeframe === 'daily') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === 'weekly') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - startDate.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === 'monthly') {
      startDate = new Date();
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }
    
    // Get current user's friends
    const currentUser = await User.findById(req.user.id);
    const friendIds = [...currentUser.friends, req.user.id];
    
    // Aggregate study time for each user
    const leaderboard = await StudySession.aggregate([
      {
        $match: {
          user: { $in: friendIds },
          isActive: false,
          ...(startDate && { startTime: { $gte: startDate } })
        }
      },
      {
        $group: {
          _id: '$user',
          totalTime: { $sum: '$duration' },
          sessions: { $sum: 1 }
        }
      },
      {
        $sort: { totalTime: -1 }
      }
    ]);
    
    // Populate user details
    const populatedLeaderboard = await User.populate(leaderboard, {
      path: '_id',
      select: 'username profilePicture streak'
    });
    
    // Format response
    const formattedLeaderboard = populatedLeaderboard.map(entry => ({
      user: entry._id,
      totalTime: entry.totalTime,
      sessions: entry.sessions
    }));
    
    res.json(formattedLeaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 