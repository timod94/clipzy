import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, auth } from '../lib/auth';
import { SlLogout, SlLogin } from 'react-icons/sl';
import { FaUpload } from "react-icons/fa";
import logo from "../assets/logo/logo-transparent.png";
import '../App.css';

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const session = auth();
      setIsAuthenticated(!!session?.token);
    };
    
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkAuth();
    checkScreenSize();
    
    window.addEventListener('storage', checkAuth);
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false); 
    navigate('/login');
    closeDropdown();
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" onClick={closeDropdown}>
          <img src={logo} className="navbar-logo" alt="Clipzy logo" />
        </Link>
      </div>
      
      {/* Desktop (middle) - only Auth-links */}
      {!isMobile && (
        <div className='navbar-middle'>
          {isAuthenticated ? (
            <>
              <Link to="/upload" aria-label='Upload file'>
                <FaUpload /> Upload
              </Link>
              <button onClick={handleLogout} className="action-button">
                <SlLogout /> Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <SlLogin /> Sign in
            </Link>
          )}
        </div>
      )}
     
      {/* Dropdown (Desktop) */}
      <div className="navbar-right">
        <div className="dropdown">
          <button 
            className="hamburger" 
            onClick={toggleDropdown}
            aria-label="Menu"
            aria-expanded={isDropdownOpen}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
          
          {isDropdownOpen && (
            <div className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}>
                {!isMobile && (
                <>
                  {isAuthenticated && (
                  <Link to="/profile" onClick={closeDropdown}>Profile</Link>
                  )}
                  <Link to="/impressum" onClick={closeDropdown}>Impressum</Link>
                </>
              )}
              
             
              {isMobile && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Link to="/upload" onClick={closeDropdown}>
                        <FaUpload /> Upload
                      </Link>
                      <button onClick={handleLogout} className="dropdown-link">
                        <SlLogout /> Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={closeDropdown}>
                      <SlLogin /> Sign in
                    </Link>
                  )}
                  {isAuthenticated && (
                  <Link to="/profile" onClick={closeDropdown}>Profile</Link>
                  )}
                  <Link to="/impressum" onClick={closeDropdown}>Impressum</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;