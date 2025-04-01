import React, { useState} from "react";
import { Link } from "react-router-dom";

function RequestReset() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setMessage('Sending reset link...');
        
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/request-password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
      
          const data = await response.json();
          
          if (!response.ok) throw new Error(data.error || 'Failed to send email');
          
          setMessage('Password reset link sent! Check your email.');
        } catch (error) {
          setMessage(error.message);
        }
      };

    return (

    <div className="form-container">
    <h1 className="logo">Clipzy</h1>

    <form onSubmit={handleRequestReset}>
        <input
          type="email"
          value={email}
          id="email"
          name="email"
          placeholder="mail address for passwort reset"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset password</button>
    </form>

    {message && <p>{message}</p>}
        <p><Link to="/impressum">Impressum</Link></p>
    </div>
  
    ) 
}

export default RequestReset;