import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Error when creating the new password');
        return;
      }

      setMessage('Password changed successfully!');
      // Weiterleiten nach erfolgreichem Passwort-Reset
      navigate('/login');
    } catch (error) {
      console.error('Error when creating the new password:', error);
      setMessage('An error has occurred.');
    }
  };

  return (
    <div className='form-container'>
      <h1 className="logo">Clipzy</h1>
      <form onSubmit={handleResetPassword}>
        <label htmlFor="password">New Password</label>
        <div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="New Password"
          />
        </div>

        <div>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm password"
          />
        </div>

        <button type="submit">Set new Password</button>
      </form>
      {message && <p>{message}</p>}

      <p><Link to="/impressum">Impressum</Link></p>
    </div>
  );
}

export default ResetPassword;