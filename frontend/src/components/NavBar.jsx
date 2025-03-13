import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Verknüpfe dein CSS

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/" className="navbar-item left">Clipzy</Link>
        <Link to="/video-gallery" className="navbar-item center">Video Gallery</Link>
        <Link to="/upload" className="navbar-item right">Upload here</Link>
      </div>
    </nav>
  );
};

export default NavBar;
