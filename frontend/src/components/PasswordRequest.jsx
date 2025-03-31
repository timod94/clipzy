import React, { useState} from "react";
import { Link } from "react-router-dom";

function RequestReset() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleRequestReset = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/request-password-reset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

           
            if (!response.ok) {
                setMessage(data.error || 'Password reset error');
                return; 
            }

            setMessage(data.message);
        } catch (error) {
            console.error('Error when checking the data:', error);
            setMessage('An error occurred while sending the request.');
        }
    
    }

    return (

    <div className="form-container">
    <h1 className="logo">Clipzy</h1>

    <form onSubmit={handleRequestReset}>
        <input
          type="email"
          value={email}
          id="email"
          name="email"
          placeholder="mail address to send password reset mail"
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