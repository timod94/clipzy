import React from 'react';
import '../App.css';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = () => {
  return (
    <a href="http://localhost:5000/api/auth/google">
      <button className="login-button">
      <span> 
      <FcGoogle /> Sign in with Google
      </span>

      </button>
    </a>
  );
};

export default GoogleLoginButton;
