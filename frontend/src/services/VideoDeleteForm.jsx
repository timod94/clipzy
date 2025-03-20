import React from 'react';
import '../App.css'
import { deleteVideo } from './VideoServices';

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
    const result = await deleteVideo(videoKey, thumbnailKey);

    if (result.success) {
      alert('Video successfully deleted');
      setVideoUrl(null);
      setThumbnailUrl(null);
      setVideoKey(null);
      setThumbnailKey(null);
    } else {
      setUploadError(result.error);
    }
  };

  return (
    <div className="delete-container">
      <button className="delete-button" onClick={handleDelete}>Delete Video</button>
    </div>
  );
};

export default VideoDeleteForm;
