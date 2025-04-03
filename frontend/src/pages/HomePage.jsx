import React from 'react';

const HomePage = () => {
  return (
    <div 
      className='homepage' 
      style={{ 
        marginTop: 'clamp(30px, 8vh, 100px)',
        padding: '0 20px',
        textAlign: 'center'
      }}
    >
      <h1>Welcome to Clipzy</h1>
      <h3>The secure and user-friendly video-sharing platform.</h3> 
      <h4>Upload, manage, and share your videos with complete privacy and control.</h4>
    </div>
  );
};

export default HomePage;