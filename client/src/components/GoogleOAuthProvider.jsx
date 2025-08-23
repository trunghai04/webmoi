import React, { useEffect } from 'react';

const GoogleOAuthProvider = ({ children }) => {
  useEffect(() => {
    // Load Google Sign-In API
    const loadGoogleScript = () => {
      if (window.google) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadGoogleScript().catch(console.error);
  }, []);

  return <>{children}</>;
};

export default GoogleOAuthProvider;
