import { useEffect, useRef } from 'react';
import axios from 'axios';

export default function useVideoAnalytics(videoId, videoRef) {
  const startTimeRef = useRef(null);
  const playedTimeRef = useRef(0);
  const hasSentCompleteRef = useRef(false);

  const trackEvent = async (eventType, duration = 0, errorCode = null) => {
    try {
      await axios.post('/api/analytics/track', {
        videoId,
        eventType,
        duration,
        errorCode
      });
    } catch (error) {
      console.error('Tracking failed:', error);
    }
  };

  // Track page visit
  useEffect(() => {
    trackEvent('page_visit');
    
    return () => {
      // Track total played time when leaving page
      if (playedTimeRef.current > 0) {
        trackEvent('play', playedTimeRef.current);
      }
    };
  }, [videoId]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;

    const handlePlay = () => {
      startTimeRef.current = Date.now();
      trackEvent('play');
    };

    const handlePause = () => {
      if (startTimeRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        playedTimeRef.current += duration;
        trackEvent('pause', duration);
        startTimeRef.current = null;
      }
    };

    const handleEnded = () => {
      if (startTimeRef.current && !hasSentCompleteRef.current) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        playedTimeRef.current += duration;
        trackEvent('complete', duration);
        hasSentCompleteRef.current = true;
        startTimeRef.current = null;
      }
    };

    const handleError = () => {
      trackEvent('error', 0, video.error?.code || 'unknown');
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [videoId, videoRef]);
}