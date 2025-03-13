import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NavBar from './components/NavBar'
import UploadPage from './pages/UploadPage';
import './App.css';
import HomePage from './pages/HomePage';
import VideoGalleryPage from './pages/VideoGalleryPage';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage/>} /> {/* Startseite */}
          <Route path="/video-gallery" element={<VideoGalleryPage/>} /> {/* Videogalerie-Seite */}
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
