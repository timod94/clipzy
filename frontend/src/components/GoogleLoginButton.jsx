import React from 'react';
import '../App.css'

const GoogleLoginButton = () => {
  return (
    <a href="http://localhost:5000/api/auth/google">
      <button className='login-button'>Login with Google</button>
    </a>
  );
};

export default GoogleLoginButton;
