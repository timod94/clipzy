import React from 'react';
import { Link } from 'react-router-dom'; 
import VideoGallery from '../components/VideoGallery';

const HomePage = () => {
  return (
    <div>
       
      <p>Your go-to platform for watching and sharing videos!</p>

      {/* Video Gallery auf der Startseite */}
      <VideoGallery />

      {/* Verlinkung zur vollständigen Videogalerie-Seite */}
      <Link to="/video-gallery">View All Videos</Link>
    </div>
  );
};

export default HomePage;
