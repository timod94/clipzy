import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/city/index.css';
import './VideoPlayer.css'

const VideoPlayer = ({ src, poster }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    if (playerRef.current) {
      playerRef.current.dispose();
    }

    const timer = setTimeout(() => {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        poster: poster,
        playbackRates: [0.5, 1, 1.5, 2],
         controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'playbackRateMenuButton',
            'fullscreenToggle'
          ]
        },
        responsive: true
      });
    }, 0);

    videoRef.current.oncontextmenu = (e) => {
      e.preventDefault();
      return false;
    };

    return () => {
      clearTimeout(timer);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster]);

  return (
    <div>
     <video
        ref={videoRef}
        className="video-js vjs-theme-city"
        controls
        preload="auto"
        width="640"
        height="360"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoPlayer;
