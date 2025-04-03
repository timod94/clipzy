import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import UploadPage from './pages/UploadPage';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Impressum from './pages/Impressum';
import SharedVideoPage from './pages/SharedVideoPage';
import HeroSection from './components/HeroSection';
import RequestReset from './components/PasswordRequest';
import ResetPassword from './pages/PasswordResetPage';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.body.setAttribute("data-theme", savedTheme);
      setIsDarkMode(savedTheme === "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div>
        <NavBar />
        <button 
          onClick={toggleTheme} 
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
}}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <FaToggleOn size={24} color="#5187dd" /> : <FaToggleOff size={24} color="#333" />}
        </button>
        <HeroSection />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/sharedVideo/:videoId" element={<SharedVideoPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/login" element={<Login />} />
          <Route path="/request-reset" element={<RequestReset />} />
          <Route path='/reset' element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
