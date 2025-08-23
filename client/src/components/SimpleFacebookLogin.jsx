import React, { useEffect, useState } from 'react';
import { FaFacebook } from 'react-icons/fa';

const SimpleFacebookLogin = ({ appId, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    
    if (window.FB) {
      window.FB.login((response) => {
        setIsLoading(false);
        
        if (response.authResponse) {
          // Get user info
          window.FB.api('/me', { fields: 'id,name,email,picture' }, (userInfo) => {
            if (onSuccess) {
              onSuccess({
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
    } else {
      setIsLoading(false);
      if (onError) {
        onError('Facebook SDK not loaded');
      }
    }
  };

  return (
    <button
      onClick={handleFacebookLogin}
      disabled={isLoading}
      className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaFacebook className="text-blue-600 text-lg" />
      <span className="ml-2">
        {isLoading ? 'Đang xử lý...' : 'Đăng nhập với Facebook'}
      </span>
    </button>
  );
};

export default SimpleFacebookLogin;
