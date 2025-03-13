const API_BASE_URL = 'http://localhost:5000/api/videos';

export const getVideos = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};
