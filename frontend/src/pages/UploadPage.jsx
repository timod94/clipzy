import React from 'react';
import VideoUploadForm from '../services/VideoUploadForm';

const UploadPage = () => {
  return (
    <div className='upload-container'>
      <h1>Upload your favorite Video</h1>
      <VideoUploadForm />
    </div>
  );
};

export default UploadPage;
