import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function VideoAnalyticsDashboard({ videoId }) {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/api/analytics/${videoId}?range=${timeRange}`);
        setAnalytics(res.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, [videoId, timeRange]);

  return (
    <div className="analytics-dashboard">
      <h2>Video Analytics</h2>
      
      <div className="time-range-selector">
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {analytics && (
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Total Views</h3>
            <p>{analytics.totalViews}</p>
          </div>
          
          <div className="metric-card">
            <h3>Unique Viewers</h3>
            <p>{analytics.uniqueVisitors}</p>
          </div>
          
          <div className="metric-card">
            <h3>Avg. Watch Time</h3>
            <p>{Math.floor(analytics.avgWatchTime / 60)}m {analytics.avgWatchTime % 60}s</p>
          </div>
          
          <div className="metric-card">
            <h3>Completion Rate</h3>
            <p>{Math.round(analytics.completionRate * 100)}%</p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="completions" fill="#82ca9d" name="Completions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}