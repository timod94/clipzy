import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../lib/auth';
import './Register.css'

const RegisterPage = () => {
  const [email, setEmail] = useState('');;
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register({ email, password, username });

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="register-container">
      <div>
        <h1>Register</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              value={email}
              placeholder='Email address'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={username}
              placeholder='Username'
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="register-button"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;