import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const handleGoogleAuthRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    localStorage.setItem('token', token);
    window.history.replaceState({}, document.title, window.location.pathname);
    window.dispatchEvent(new Event('storage'));
  }
};

export const auth = () => {
  const token = localStorage.getItem('token');
  return token ? { token } : null;
};

export const signIn = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    localStorage.setItem('token', response.data.token);
    window.dispatchEvent(new Event('storage'));
    return { user: response.data };
  } catch (error) {
    return { error: error.response?.data?.message || 'Login failed' };
  }
};

export const signOut = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error('Logout error:', error);
  }

  localStorage.removeItem('token');
  window.dispatchEvent(new Event('storage'));
};


export const register = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/register`, credentials);
    return { success: true, message: response.data.message };
  } catch (error) {
    return { error: error.response?.data?.message || 'Registration failed' };
  }
  
};

export const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await axios.get(`${API_URL}/validate-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.isValid;
  } catch (error) {
    return false;
  }
};