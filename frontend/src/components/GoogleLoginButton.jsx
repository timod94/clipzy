import React from 'react';
import '../App.css';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL; 

  return (
    <a href={`${API_BASE_URL}/api/auth/google`}>
      <button className="action-button">
        <span> 
          <FcGoogle /> Sign in with Google
        </span>
      </button>
    </a>
  );
};

export default GoogleLoginButton;