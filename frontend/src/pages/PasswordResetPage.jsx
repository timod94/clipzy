import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    if (password.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters', type: 'error' });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error resetting password');
      }

      setMessage({ 
        text: 'Password changed successfully! Redirecting to login...', 
        type: 'success' 
      });
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='form-container'>
      <h1 className="logo">Clipzy</h1>
      <form onSubmit={handleResetPassword}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
            placeholder="Minimum 8 characters"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="8"
            placeholder="Confirm your password"
            className="form-input"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`submit-btn ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Processing...' : 'Set New Password'}
        </button>

        {message.text && (
          <p className={`message ${message.type}`}>
            {message.text}
          </p>
        )}
      </form>

      <div className="links">
        <Link to="/login">Back to Login</Link>
        <Link to="/impressum">Impressum</Link>
      </div>
    </div>
  );
}

export default ResetPassword;