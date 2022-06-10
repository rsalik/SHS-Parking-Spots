import { useEffect } from 'react';
import { getUser } from '../auth/googleAuth';

import GoogleLogin from '../components/GoogleLogin';

export default function HomePage() {
  useEffect(() => {
    if (getUser()) window.location.href = '/map';
  });

  return (
    <>
      <div className="log-in">You must log in with your school account to continue.</div>
      <GoogleLogin />
    </>
  );
}
