import { useEffect } from 'react';
import { handleGoogleAuthRedirect } from '../lib/auth';

const Profile = () => {
  useEffect(() => {
    handleGoogleAuthRedirect();
  }, []);

  return <div>USERNAME_PLACEHOLDER</div>;
};

export default Profile;