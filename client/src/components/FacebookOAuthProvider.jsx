import React, { useEffect } from 'react';

const FacebookOAuthProvider = ({ children, appId, onLogin, onError }) => {
  useEffect(() => {
    // Load Facebook SDK
    if (!window.FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
      };
      document.head.appendChild(script);
    }
  }, [appId]);

  const handleFacebookLogin = () => {
    if (window.FB) {
      window.FB.login((response) => {
        if (response.authResponse) {
          // Get user info
          window.FB.api('/me', { fields: 'id,name,email,picture' }, (userInfo) => {
            if (onLogin) {
              onLogin({
                accessToken: response.authResponse.accessToken,
                user: userInfo
              });
            }
          });
        } else {
          if (onError) {
            onError('Facebook login failed');
          }
        }
      }, { scope: 'email,public_profile' });
    }
  };

  return (
    <div>
      {children}
      <button
        onClick={handleFacebookLogin}
        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        Đăng nhập với Facebook
      </button>
    </div>
  );
};

export default FacebookOAuthProvider;
