const mongoose = require('mongoose');

const videoAnalyticsSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ipAddress: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  eventType: { 
    type: String, 
    enum: ['page_visit', 'play', 'pause', 'complete', 'error'], 
    required: true 
  },
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number },
  errorCode: { type: String }
});

module.exports = mongoose.model('VideoAnalytics', videoAnalyticsSchema);