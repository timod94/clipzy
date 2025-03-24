import React, { useEffect, useState } from 'react';
import { getVideos, deleteVideo } from '../services/VideoServices'; 
import VideoDeleteForm from './VideoDeleteForm'
import '../App.css';

const S3_BUCKET_URL = 'https://clipzy-bucket.s3.eu-central-1.amazonaws.com/';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(decodedToken.id);
    }
  }, []);

  const disableRightClick = (event) => {
    event.preventDefault();
  }
  useEffect(() => {
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach((video) => {
      video.addEventListener('contextmenu', disableRightClick);
    });

    return () => {
      videoElements.forEach((video) => {
        video.removeEventListener('contextmenu', disableRightClick);
      });
    };
  }, [videos]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await getVideos();
        console.log("Fetched Video Data:", videoData);
        const videoWithThumbnails = videoData.map((video) => {
          console.log("Video Daten:", video); 
          if (video.key) {
            const videoId = video.key.split('/')[1].split('_')[0];        
            const thumbnailKey = `thumbnails/${videoId}_thumbnail.png`; 
            const thumbnailUrl = `${S3_BUCKET_URL}${thumbnailKey}`;
            const videoUrl= `${S3_BUCKET_URL}${video.key}`; 

            console.log("Thumbnail URL für dieses Video:", thumbnailUrl);

           
            return {
              ...video,
              thumbnailUrl,
              videoUrl,
              thumbnailKey,
            };
          } else {
            return video;
          }
        });

       
        setVideos(videoWithThumbnails);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (videoKey, thumbnailKey) => {
    try {
      const result = await deleteVideo(videoKey, thumbnailKey);

      if (result.success) {
        setVideos(videos.filter((video) => video.key !== videoKey));
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}. Please <a href='/login'>log in</a>to view videos.</div>
  }

  return (
    <div className="video-gallery">
      {videos.length === 0 ? (
        <p>No videos available</p>
      ) : (
        <div className="video-grid">
          {videos.map((video, index) => (
            <div key={index} className="video-card">
              <h3>{video.title}</h3>
              {/* Video mit Thumbnail als Poster */}
              <video width="300" poster={video.thumbnailUrl} controls controlsList='nodownload'>
                <p>{video.description}</p>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div>
              <button onClick={() => handleCopyLink(video.videoUrl)}>share video</button>
            </div>
            {currentUserId && video.userId === currentUserId && (
                <button
                  onClick={() => handleDelete(video.key, video.thumbnailKey)}
                  className="delete-button"
                >
                  Delete Video
                </button>
              )}
          
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const handleCopyLink = (videoUrl) => {
  navigator.clipboard.writeText(videoUrl).then(() => {
    alert('Link copied!');
  });
};

export default VideoGallery;
