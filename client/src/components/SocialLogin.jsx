import React from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';

const SocialLogin = ({ onFacebookLogin, onGoogleLogin, isLoading = false }) => {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onFacebookLogin}
          disabled={isLoading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaFacebook className="text-blue-600 text-lg" />
          <span className="ml-2">Facebook</span>
        </button>

        <button
          onClick={onGoogleLogin}
          disabled={isLoading}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaGoogle className="text-red-600 text-lg" />
          <span className="ml-2">Google</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
