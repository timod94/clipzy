import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../lib/auth';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { SlLogin } from 'react-icons/sl';
import '../App.css'

const RegisterPage = () => {
  const [email, setEmail] = useState('');;
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    const result = await register({ email, password, username });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccessMessage('Registration successfull!');
      navigate('/login');
    }
  };

  return (
  <div className='container-wrapper'>
    <div className="register-container">
      <div>
        <h1>Register</h1>
        {error && <p>{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              value={email}
              placeholder='Email address'
              onChange={(e) => setEmail(e.target.value)}
              className='input-field'
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={username}
              placeholder='Username'
              onChange={(e) => setUsername(e.target.value)}
              className='input-field'
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              className='input-field'
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={confirmPassword}
              placeholder='Confirm Password'
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='input-field'
              required
            />
          </div>
          <button
            type="submit"
            className="register-button"
          >
           <SlLogin /> Sign Up
          </button>
        </form>
        <GoogleLoginButton />
      </div>
    </div>
  </div>
  );
};

export default RegisterPage;