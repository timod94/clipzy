import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/videos/';

export const getVideos = async () => {
  try {
    const token = localStorage.getItem('token');

    if(!token) {
      throw new Error('No token found. Please log in.');
    }

    const response = await axios.get(API_BASE_URL, {
      headers:{
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched videos:", response.data);
    return response.data;
   
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const deleteVideo = async (videoKey, thumbnailKey) => {
const token = localStorage.getItem('token')
  try {
    const response = await fetch(`${API_BASE_URL}delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        
      },
      body: JSON.stringify({ videoKey, thumbnailKey }),
    });
    console.log('Response from delete API:', response);

    const data = await response.json();

    console.log('Parsed response data:', data);

    if (response.ok) {
      console.log('Delete operation successful:', data);
      return { success: true, data };
    } else {
      console.error('Error deleting:', data.error || 'Delete operation failed!');
      return { success: false, error: data.error || 'Delete operation failed!' };
    }
  } catch (error) {
    console.error('Error deleting:', error);
    return { success: false, error: 'An error occurred while deleting the video. Please try again.' };
  }
};
