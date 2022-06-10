import React from 'react';
import { handleGoogleResponse } from '../auth/googleAuth';

// Shameless stolen

declare global {
  interface Window {
    GoogleAuthSuccess?: any;
  }
}

const GoogleLogin = () => {
  const GoogleAuthSuccess = (response: any) => {
    const token = response.credential;
    // Logic to log user in
    // Handle on server: https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
    // Handle on client: https://developers.google.com/identity/gsi/web/guides/handle-credential-responses-js-functions
    handleGoogleResponse(token);
  };

  if (typeof window !== 'undefined') {
    window.GoogleAuthSuccess = GoogleAuthSuccess;
  }

  const scriptRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    if (scriptRef.current) {
      scriptRef.current.appendChild(script);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scriptRef.current?.removeChild(script);
    };
  }, [scriptRef]);

  return (
    <>
      <div ref={scriptRef}></div>

      <div
        id="g_id_onload"
        data-client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        data-text="Continue with google"
        data-auto_prompt="false"
        data-callback="GoogleAuthSuccess"
      ></div>

      <div className="flex flex-col items-center">
        <div
          className="g_id_signin"
          data-type="standard"
          data-size="large"
          data-theme="outline"
          data-text="continue_with"
          data-shape="rectangular"
          data-logo_alignment="center"
        ></div>
      </div>
    </>
  );
};

export default GoogleLogin;
