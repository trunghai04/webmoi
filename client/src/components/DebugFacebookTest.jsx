import React, { useEffect, useState } from 'react';
import { FaFacebook, FaBug, FaInfoCircle } from 'react-icons/fa';

const DebugFacebookTest = ({ appId }) => {
  const [debugInfo, setDebugInfo] = useState({
    sdkLoaded: false,
    fbInit: false,
    loginStatus: 'unknown',
    userInfo: null,
    errors: []
  });

  useEffect(() => {
    const checkFacebookSDK = () => {
      const info = { ...debugInfo };
      
      // Check if FB SDK is loaded
      info.sdkLoaded = typeof window.FB !== 'undefined';
      
      // Check if FB is initialized
      if (info.sdkLoaded) {
        try {
          window.FB.getLoginStatus((response) => {
            info.loginStatus = response.status;
            setDebugInfo(info);
          });
        } catch (error) {
          info.errors.push(`FB.getLoginStatus error: ${error.message}`);
        }
      }
      
      setDebugInfo(info);
    };

    // Check every 2 seconds
    const interval = setInterval(checkFacebookSDK, 2000);
    
    return () => clearInterval(interval);
  }, [debugInfo]);

  const handleTestLogin = () => {
    if (!window.FB) {
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors, 'Facebook SDK not loaded']
      }));
      return;
    }

    window.FB.login((response) => {
      const info = { ...debugInfo };
      
      if (response.authResponse) {
        info.loginStatus = 'connected';
        
        // Get user info
        window.FB.api('/me', { fields: 'id,name,email,picture' }, (user) => {
          info.userInfo = user;
          setDebugInfo(info);
        });
      } else {
        info.loginStatus = 'not_authorized';
        info.errors.push('User cancelled login or authorization failed');
      }
      
      setDebugInfo(info);
    }, { scope: 'email,public_profile' });
  };

  const handleTestLogout = () => {
    if (window.FB) {
      window.FB.logout(() => {
        setDebugInfo(prev => ({
          ...prev,
          loginStatus: 'unknown',
          userInfo: null
        }));
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <FaBug className="text-red-500" />
        <h3 className="text-lg font-semibold">Facebook Debug Test</h3>
      </div>
      
      <div className="space-y-4">
        {/* Debug Info */}
        <div className="bg-white p-3 border rounded">
          <h4 className="font-medium mb-2 flex items-center gap-1">
            <FaInfoCircle className="text-blue-500" />
            Debug Information
          </h4>
          <div className="text-xs space-y-1">
            <p>SDK Loaded: <span className={debugInfo.sdkLoaded ? 'text-green-600' : 'text-red-600'}>{debugInfo.sdkLoaded ? 'Yes' : 'No'}</span></p>
            <p>Login Status: <span className="text-blue-600">{debugInfo.loginStatus}</span></p>
            <p>App ID: <span className="text-gray-600">{appId}</span></p>
          </div>
        </div>

        {/* User Info */}
        {debugInfo.userInfo && (
          <div className="bg-white p-3 border rounded">
            <h4 className="font-medium mb-2">User Info</h4>
            <pre className="text-xs text-gray-600 overflow-auto max-h-32">
              {JSON.stringify(debugInfo.userInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Errors */}
        {debugInfo.errors.length > 0 && (
          <div className="bg-red-50 p-3 border border-red-200 rounded">
            <h4 className="font-medium mb-2 text-red-700">Errors</h4>
            <ul className="text-xs text-red-600 space-y-1">
              {debugInfo.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleTestLogin}
            className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FaFacebook className="text-blue-600 text-lg mr-2" />
            Test Login
          </button>

          {debugInfo.loginStatus === 'connected' && (
            <button
              onClick={handleTestLogout}
              className="w-full py-2 px-4 border border-red-300 rounded-md shadow-sm bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Test Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugFacebookTest;
