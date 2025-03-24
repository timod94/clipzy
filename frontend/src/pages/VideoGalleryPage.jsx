import React from 'react';
import VideoGallery from '../components/VideoGallery'; 

const VideoGalleryPage = () => {
  return (
    <div className='video-gallery'>
      <h1>Video Gallery</h1>
      <p>Explore all the available videos.</p>

      <VideoGallery />
    </div>
  );
};

export default VideoGalleryPage;
