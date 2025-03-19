import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, auth } from '../lib/auth';
import './NavBar.css';

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const session = auth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Clipzy</Link>
      </div>

      {session ? (
          <>
            <Link to="/upload">Upload here</Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

      <div className="navbar-right">
        <div className="dropdown">
          <button className="hamburger" onClick={toggleDropdown}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile">Profile</Link>
              <Link to="/video-gallery">Video Gallery</Link>
              <Link to="/upload">Upload</Link>
              <Link to="/logout">Logout</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/impressum">Impressum</Link>
              
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
