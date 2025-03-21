import { useEffect } from 'react';
import { handleGoogleAuthRedirect,auth } from '../lib/auth';
import VideoGallery from '../components/VideoGallery'; 

const Profile = () => {
  useEffect(() => {
    handleGoogleAuthRedirect();
  }, []);

  return (
    
    <div className='profile'>
      <h1>Welcome, "username" to your profile. </h1>
  <VideoGallery /></div>
  )
}


export default Profile;