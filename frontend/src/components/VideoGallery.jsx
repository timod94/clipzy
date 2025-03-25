import React, { useEffect, useState } from 'react';
import { getVideos } from '../services/VideoServices'; 
import VideoDeleteForm from './VideoDeleteForm';
import { MdOutlineIosShare } from "react-icons/md";
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
        const videoWithThumbnails = videoData.map((video) => {
          if (video.key) {
            const videoId = video.key.split('/')[1].split('_')[0];        
            const thumbnailKey = `thumbnails/${videoId}_thumbnail.png`; 
            const thumbnailUrl = `${S3_BUCKET_URL}${thumbnailKey}`;
            const videoUrl = `${S3_BUCKET_URL}${video.key}`; 

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Please <a href='/login'>log in</a> to view the video gallery.</div>;
  }

  return (
    <div className="video-gallery">
      {videos.length === 0 ? (
        <p>No videos available</p>
      ) : (
        <div className="video-grid">
          {videos.map((video, index) => (
            <div key={index} className="video-card">
              <h3 className='video-title'>{video.title}</h3>
              <h2>{video.description}</h2>
              {/* Video mit Thumbnail als Poster */}
              <video width="300" poster={video.thumbnailUrl} controls controlsList='nodownload'>
                <p>{video.description}</p>
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
             
              <div>
                <button onClick={() => handleCopyLink(video.videoUrl)} className='action-button'><MdOutlineIosShare /> Share</button>
              </div>
              {currentUserId && video.userId === currentUserId && (
                <VideoDeleteForm
                  videoKey={video.key}
                  thumbnailKey={video.thumbnailKey}
                  setVideos={setVideos}
                />
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
