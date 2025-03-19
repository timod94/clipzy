import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const auth = () => {
  const token = localStorage.getItem('token');
  return token ? { token } : null;
};

export const signIn = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    localStorage.setItem('token', response.data.token);
    return { user: response.data };
  } catch (error) {
    return { error: error.response?.data?.message || 'Login failed' };
  }
};

export const signOut = async () => {
  localStorage.removeItem('token');
};

export const register = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/register`, credentials);
    return { success: true, message: response.data.message };
  } catch (error) {
    return { error: error.response?.data?.message || 'Registration failed' };
  }
};