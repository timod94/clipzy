import React from 'react';
import '../App.css';
import { deleteVideo } from '../services/VideoServices';

const VideoDeleteForm = ({ videoKey, thumbnailKey, setVideos }) => {

  const handleDelete = async () => {
    const result = await deleteVideo(videoKey, thumbnailKey);

    if (result.success) {
      alert('Video successfully deleted');
      
      setVideos(prevVideos => prevVideos.filter(video => video.key !== videoKey));
    } else {
      alert(result.error || 'Failed to delete video');
    }
  };

  return (
    <div className="delete-container">
      <button className="delete-button" onClick={handleDelete}>Delete Video</button>
    </div>
  );
};

export default VideoDeleteForm;
