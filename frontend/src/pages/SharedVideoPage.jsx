import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoContainer from '../components/VideoContainer';
require('dotenv').config()

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
        const response = await fetch(`${process.env.VITE_API_URL}/api/videos/${videoId}`);
        console.log("FetchById responses!")
        console.log(response)
        if (!response.ok) {
          throw new Error(`Error fetching video data: ${response.statusText}`);
        }

        const data = await response.json();
        setVideoData(data); // Setze die Video-Daten
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Beende den Ladezustand
      }
    };

    if (videoId) {
      fetchVideoData(); // Hole die Daten für das Video
    }
  }, [videoId]);

  if (error) {
    return <div>An error occurred while fetching the video: {error}</div>;
  }

  if (!videoData) {
    return <div>No video found</div>; // Falls keine Daten vorhanden sind
  }

  return (
    <div>
      <h1>{videoData.title}</h1> {/* Zeige den Titel des Videos an */}
      <p>{videoData.description}</p> {/* Zeige die Beschreibung an */}

      {/* Hier wird der VideoPlayer eingebunden */}
      {videoData.videoUrl ? (
        <VideoContainer videoUrl={videoData.videoUrl} />  
      ) : (
        <div>No video URL available</div>
      )}
    </div>
  );
};

export default SharedVideoPage;
