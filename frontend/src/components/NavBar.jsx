import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, auth } from '../lib/auth';
import '../App.css';

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const session = auth();
      setIsAuthenticated(!!session?.token);
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false); 
    navigate('/login');
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Clipzy</Link>
      </div>

      {isAuthenticated ? (
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
            <div className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}>
            <Link to="/profile" onClick={closeDropdown}>Profile</Link>
            <Link to="/video-gallery" onClick={closeDropdown}>Video Gallery</Link>
            <Link to="/upload" onClick={closeDropdown}>Upload</Link>
            <Link to="/impressum" onClick={closeDropdown}>Impressum</Link>
          </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
