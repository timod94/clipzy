// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const VideoAnalytics = require('../models/VideoAnalytics');
const authenticateJWT = require('../middleware/authMiddleware');

// Track video events
router.post('/track', async (req, res) => {
  try {
    const { videoId, eventType, duration, errorCode } = req.body;
    
    const analytics = new VideoAnalytics({
      videoId,
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer,
      eventType,
      duration,
      errorCode
    });

    await analytics.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

router.get('/:videoId', authenticateJWT, async (req, res) => {
  try {
    const analytics = await VideoAnalytics.aggregate([
      { $match: { videoId: mongoose.Types.ObjectId(req.params.videoId) } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$ipAddress" },
          avgWatchTime: { $avg: "$duration" },
          completions: { $sum: { $cond: [{ $eq: ["$eventType", "complete"] }, 1, 0] } },
          errors: { $sum: { $cond: [{ $eq: ["$eventType", "error"] }, 1, 0] } }
        }
      },
      {
        $project: {
          _id: 0,
          totalViews: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" },
          avgWatchTime: 1,
          completions: 1,
          errors: 1,
          completionRate: { $divide: ["$completions", "$totalViews"] }
        }
      }
    ]);

    res.json(analytics[0] || {});
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Erweiterte Aggregation für Zeitreihendaten
router.get('/:videoId/details', async (req, res) => {
    try {
      const { range } = req.query;
      let dateFilter = {};
      
      if (range === '24h') {
        dateFilter = { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
      } else if (range === '7d') {
        dateFilter = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
      } else if (range === '30d') {
        dateFilter = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
      }
  
      const dailyStats = await VideoAnalytics.aggregate([
        { 
          $match: { 
            videoId: mongoose.Types.ObjectId(req.params.videoId),
            timestamp: dateFilter
          } 
        },
        {
          $project: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            isComplete: { $cond: [{ $eq: ["$eventType", "complete"] }, 1, 0] },
            isView: 1
          }
        },
        {
          $group: {
            _id: "$date",
            views: { $sum: 1 },
            completions: { $sum: "$isComplete" }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      res.json({ dailyStats });
    } catch (error) {
      console.error('Detailed analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch detailed analytics' });
    }
  });

module.exports = router;