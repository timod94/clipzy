import React from 'react';
import { Link } from 'react-router-dom'; 
import VideoGallery from '../components/VideoGallery';
import '../App.css';

const HomePage = () => {
  return (
    <div className='homepage'>
      <VideoGallery />
    </div>
  );
};

export default HomePage;
