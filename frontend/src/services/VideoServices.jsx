import axios from 'axios';

const API_BASE_URL = `${VITE_API_URL}/api/videos/`;

const getAuthToken = () => {
  return localStorage.getItem('token');
}

export const getVideos = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    const response = await axios.get(API_BASE_URL, {
      headers: {
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
  const token = getAuthToken();

  if (!token) {
    return { success: false, error: 'No token found. Please log in.' };
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}delete`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: { videoKey, thumbnailKey },
    });

    if (response.status === 200) {
      console.log('Delete operation successful:', response.data);
      return { success: true, data: response.data };
    } else {
      console.error('Error deleting:', response.data.error || 'Delete operation failed!');
      return { success: false, error: response.data.error || 'Delete operation failed!' };
    }
  } catch (error) {
    console.error('Error deleting:', error);
    return { success: false, error: 'An error occurred while deleting the video. Please try again.' };
  }
};
