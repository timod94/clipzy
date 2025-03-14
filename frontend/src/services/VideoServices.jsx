import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/videos';

export const getVideos = async () => {
  try {
    
    const response = await axios.get(API_BASE_URL);
    console.log("Fetched videos:", response.data);
    return response.data;
   
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};
