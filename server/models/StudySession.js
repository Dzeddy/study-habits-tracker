const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0 // in minutes
  },
  isActive: {
    type: Boolean,
    default: true
  },
  productivityRating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: {
    type: String
  },
  location: {
    type: String
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Calculate duration when ending a session
StudySessionSchema.methods.endSession = function(productivityRating, notes) {
  this.endTime = new Date();
  this.isActive = false;
  this.productivityRating = productivityRating;
  this.notes = notes;
  
  // Calculate duration in minutes
  const durationMs = this.endTime - this.startTime;
  this.duration = Math.round(durationMs / (1000 * 60));
  
  return this.save();
};

module.exports = mongoose.model('StudySession', StudySessionSchema); 