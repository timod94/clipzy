import React, { useState, useEffect,u } from 'react';
import { useParams } from 'react-router-dom';
import VideoContainer from '../components/VideoContainer';

const SharedVideoPage = () => {
  const { videoId } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("SharedVideoPage gets triggered!")
    const fetchVideoData = async () => {
      try {
        console.log("FetchById triggered!")
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/videos/${videoId}`);
        console.log("FetchById responses!")
        console.log(response)
        if (!response.ok) {
          throw new Error(`Error fetching video data: ${response.statusText}`);
        }

        const data = await response.json();
        setVideoData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  if (error) {
    return <div>An error occurred while fetching the video: {error}</div>;
  }

  if (!videoData) {
    return <div>No video found</div>; 
  }

  return (
    <div>
      <h1>{videoData.title}</h1> 
      <p>{videoData.description}</p>


      {videoData.videoUrl ? (
        <VideoContainer videoUrl={videoData.videoUrl} thumbnailUrl={videoData.thumbnailUrl} />  
      ) : (
        <div>No video URL available</div>
      )}
    </div>
  );
};

export default SharedVideoPage;
