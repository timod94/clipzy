import React, { useEffect, useState } from 'react';
import { getVideos, deleteVideo } from '../services/VideoServices'; 
import '../App.css';

const S3_BUCKET_URL = 'https://clipzy-bucket.s3.eu-central-1.amazonaws.com/';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Abrufen der Videos
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

            console.log("Thumbnail URL für dieses Video:", thumbnailUrl);

           
            return {
              ...video,
              thumbnailUrl,
              thumbnailKey,
            };
          } else {
            return video;
          }
        });

       
        setVideos(videoWithThumbnails);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (videoKey, thumbnailKey) => {
    const result = await deleteVideo(videoKey, thumbnailKey); // Verwende deleteVideo hier

    if (result.success) {
      setVideos(videos.filter((video) => video.key !== videoKey)); // Entferne das Video nach erfolgreichem Löschen
    } else {
      alert(result.error); // Zeige einen Fehler an, falls das Löschen fehlschlägt
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="video-gallery">
      {videos.length === 0 ? (
        <p>No videos available</p>
      ) : (
        <div className="video-grid">
          {videos.map((video, index) => (
            <div key={index} className="video-card">
              {/* Video mit Thumbnail als Poster */}
              <video width="300" poster={video.thumbnailUrl} controls>
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button onClick={() => handleDelete(video.key, video.thumbnailKey)} className='delete-button'>Delete Video</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
