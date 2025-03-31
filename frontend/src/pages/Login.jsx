import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../lib/auth';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { SlLogin } from "react-icons/sl";
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
    <div className='container-wrapper'>
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
              className='input-field'
              required
            />
          </div>
          <div>            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className='input-field'
              required
            />
          </div>
            <p>
        <Link to="/request-reset">Forgot your password?</Link>
          </p>
          <button
            type="submit"
            className="action-button"
          >
            <SlLogin /> Sign In
          </button>
        </form>
      </div>

      <GoogleLoginButton />
      <div className='register-link' >
      Don't have an account ? <Link to="/register">Create one now</Link>
      </div>
    </div>
  </div>
  );
};

export default LoginPage;