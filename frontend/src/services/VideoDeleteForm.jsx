import React from 'react';
import '../App.css'

const VideoDeleteForm = ({ 
  videoUrl, 
  videoKey, 
  thumbnailKey, 
  setVideoKey, 
  setThumbnailKey, 
  setVideoUrl, 
  setThumbnailUrl, 
  setUploadError 
}) => {
  
  const handleDelete = async () => {
    const API_BASE_URL = 'http://localhost:5000/api/videos/';

    try {
      const response = await fetch(`${API_BASE_URL}delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoKey, thumbnailKey }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Delete operation successful:', data);

        alert('Video successfully deleted');
        
        setVideoUrl(null);
        setThumbnailUrl(null);
        setVideoKey(null);
        setThumbnailKey(null);
      } else {
        console.error('Error deleting:', data.error || 'Delete operation failed!');
        setUploadError('An error occurred while deleting the video. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      setUploadError('An error occurred while deleting the video. Please try again.');
    }
  };

  return (
    <div className="delete-container">
      <button className="Button" onClick={handleDelete}>Delete Video</button>
    </div>
  );
};

export default VideoDeleteForm;
