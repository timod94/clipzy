import { useEffect, useState } from 'react';
import { handleGoogleAuthRedirect, auth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import VideoGallery from '../components/VideoGallery'; 

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleGoogleAuthRedirect();

    const timer = setTimeout(() => {
      const { token } = auth();
      if (!token) {
        navigate('/login');
      } else {
        setIsLoading(false); 
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className='profile'>
      <h1>Welcome to your profile. </h1>
    </div>
  )
}


export default Profile;