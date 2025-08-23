import React, { useEffect, useState } from 'react';
import { FaFacebook } from 'react-icons/fa';

const FacebookTest = ({ appId }) => {
  const [fbStatus, setFbStatus] = useState('Loading...');
  const [userInfo, setUserInfo] = useState(null);

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
        setFbStatus('Facebook SDK loaded');
      };
      script.onerror = () => {
        setFbStatus('Failed to load Facebook SDK');
      };
      document.head.appendChild(script);
    } else {
      setFbStatus('Facebook SDK already loaded');
    }
  }, [appId]);

  const handleLogin = () => {
    if (window.FB) {
      window.FB.login((response) => {
        if (response.authResponse) {
          setFbStatus('Login successful');
          
          // Get user info
          window.FB.api('/me', { fields: 'id,name,email,picture' }, (user) => {
            setUserInfo(user);
            console.log('Facebook user info:', user);
          });
        } else {
          setFbStatus('Login failed');
        }
      }, { scope: 'email,public_profile' });
    } else {
      setFbStatus('Facebook SDK not available');
    }
  };

  const handleLogout = () => {
    if (window.FB) {
      window.FB.logout(() => {
        setFbStatus('Logged out');
        setUserInfo(null);
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Facebook Login Test</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Status: {fbStatus}</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleLogin}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaFacebook className="text-blue-600 text-lg mr-2" />
            Test Facebook Login
          </button>

          {userInfo && (
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 border border-red-300 rounded-md shadow-sm bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Logout
            </button>
          )}
        </div>

        {userInfo && (
          <div className="p-3 bg-white border rounded">
            <h4 className="font-medium mb-2">User Info:</h4>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacebookTest;
