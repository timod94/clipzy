import React from 'react';
import VideoPlayer from './VideoPlayer';

const VideoContainer = ({ videos }) => {

    if (!videos || videos.length === 0) {
        return <p>Loading...</p>
    }

    const { videoUrl, thumbnailUrl } = videos[0];

    return (
        <div className='video-container'>
            <VideoPlayer src={videoUrl} poster={thumbnailUrl} />
        </div>
    )
}

export default VideoContainer;