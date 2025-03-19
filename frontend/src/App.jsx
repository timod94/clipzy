import React from 'react';
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


  return (
    <Router>
      <div>
        <NavBar />
         <Routes>
          <Route exact path="/" element={<HomePage />} /> {/* HomePage */}
          <Route path="/video-gallery" element={<VideoGalleryPage />} /> {/* Video-Gallery*/}
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
