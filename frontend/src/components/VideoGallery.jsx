import React, { useEffect, useState } from 'react';
import { getVideos } from '../services/VideoServices'; 
import './VideoGallery.css'

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Abrufen der Videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoData = await getVideos();
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="video-gallery">
      {videos.length === 0 ? (
        <p>No videos available</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              <video width="300" controls>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <h3>{video.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
