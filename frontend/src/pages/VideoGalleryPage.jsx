import React from 'react';
import VideoGallery from '../components/VideoGallery'; 

const VideoGalleryPage = () => {
  return (
    <div>
      <h1>Video Gallery</h1>
      <p>Explore all the available videos.</p>

      {/* Video Gallery auf der eigenen Videogalerie-Seite */}
      <VideoGallery />
    </div>
  );
};

export default VideoGalleryPage;
