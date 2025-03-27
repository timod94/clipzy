import React from 'react';
import VideoPlayer from './VideoPlayer';

const VideoContainer = ({ videoUrl, thumbnailUrl }) => {

    if (!videoUrl) {
        return <p>Loading...</p>
    }

    return (
        <div className='video-container'>
            <VideoPlayer src={videoUrl} poster={thumbnailUrl} />
        </div>
    )
}

export default VideoContainer;