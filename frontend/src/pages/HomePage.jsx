import React from 'react';
import { Link } from 'react-router-dom'; 
import VideoGallery from '../components/VideoGallery';

const HomePage = () => {
  return (
    <div className='homepage'>
      <VideoGallery />
      <Link to="/video-gallery">View All Videos</Link>
    </div>
  );
};

export default HomePage;
