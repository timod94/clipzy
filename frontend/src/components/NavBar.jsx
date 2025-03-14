import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Clipzy</Link>
      </div>
      <div className="navbar-center">
        <Link to="/video-gallery">Video Gallery</Link>
      </div>
      <div className="navbar-right">
         <Link to="/upload">Upload here</Link>
      </div>
    </nav>
  );
};

export default NavBar;
