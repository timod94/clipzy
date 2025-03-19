import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../lib/auth';
import GoogleLoginButton from '../components/GoogleLoginButton';
import '../App.css'

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn({ login: email, password });

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="login-container">
      <div>
        <h1>Login</h1>
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Username or mail address'
              required
            />
          </div>
          <div>            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
            />
          </div>
          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>
        </form>
      </div>
      <GoogleLoginButton />
    </div>
  );
};

export default LoginPage;