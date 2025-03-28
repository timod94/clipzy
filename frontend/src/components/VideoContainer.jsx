import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import '../App.css'

const VideoContainer = ({ videoUrl, thumbnailUrl }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

       
        const timer = setTimeout(() => {
            if (!videoUrl) {
                setError('No video URL provided');
            }
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [videoUrl]);

    if (isLoading) {
        return (
            <div className="video-loading">
            <div className="spinner"></div>
            <p>Loading video...</p>
          </div>
        );
    }

    if (error) {
        return (
            <div className="video-error">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className='video-container'>
            <VideoPlayer src={videoUrl} poster={thumbnailUrl} />
        </div>
    );
};

export default VideoContainer;