import React, { useState, useEffect } from 'react';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import UploadPage from './pages/UploadPage';
import HomePage from './pages/HomePage';
import VideoGalleryPage from './pages/VideoGalleryPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Impressum from './pages/Impressum';
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
        {/* Icon-Button zum Umschalten des Themes */}
        <button 
          onClick={toggleTheme} 
          style={{
            position: 'fixed', 
            top: 10, 
            right: 10, 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer'
          }}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <FaToggleOn size={24} color="#0455ac" /> : <FaToggleOff size={24} color="#333" />}
        </button>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/video-gallery" element={<VideoGalleryPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
