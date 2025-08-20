import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TestCheckout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isReady, user, checkAuthStatus } = useContext(AuthContext);

  const testBuyNow = () => {
    console.log('Testing buy now functionality...');
    
    const testProduct = {
      id: 999,
      name: 'Test Product',
      price: 100000,
      image: '/uploads/products/default.svg',
      quantity: 1,
      shopName: 'Test Shop'
    };

    try {
      localStorage.setItem('checkoutItems', JSON.stringify([testProduct]));
      console.log('Test product saved to localStorage');
      navigate('/checkout');
    } catch (error) {
      console.error('Error in test:', error);
    }
  };

  const testCartCheckout = () => {
    console.log('Testing cart checkout functionality...');
    
    const testProducts = [
      {
        id: 1,
        name: 'Test Product 1',
        price: 50000,
        image: '/uploads/products/default.svg',
        quantity: 2,
        shopName: 'Test Shop 1'
      },
      {
        id: 2,
        name: 'Test Product 2',
        price: 75000,
        image: '/uploads/products/default.svg',
        quantity: 1,
        shopName: 'Test Shop 2'
      }
    ];

    try {
      localStorage.setItem('checkoutItems', JSON.stringify(testProducts));
      console.log('Test products saved to localStorage');
      navigate('/checkout');
    } catch (error) {
      console.error('Error in test:', error);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('checkoutItems');
    console.log('localStorage cleared');
  };

  const checkLocalStorage = () => {
    const items = localStorage.getItem('checkoutItems');
    console.log('Current checkoutItems in localStorage:', items);
    if (items) {
      console.log('Parsed items:', JSON.parse(items));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Test Checkout Functionality</h1>
        
        {/* Auth Status */}
        <div className="mb-6 p-4 bg-blue-100 rounded-lg">
          <h3 className="font-bold mb-2">Authentication Status:</h3>
          <div className="space-y-1 text-sm">
            <p><strong>isReady:</strong> {isReady ? '✅ True' : '❌ False'}</p>
            <p><strong>isAuthenticated:</strong> {isAuthenticated ? '✅ True' : '❌ False'}</p>
            <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'None'}</p>
            <p><strong>localStorage msv_auth:</strong> {localStorage.getItem('msv_auth') ? '✅ Present' : '❌ Missing'}</p>
            <p><strong>localStorage token:</strong> {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={testBuyNow}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600"
          >
            Test Buy Now (Single Product)
          </button>
          
          <button
            onClick={testCartCheckout}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
          >
            Test Cart Checkout (Multiple Products)
          </button>
          
          <button
            onClick={checkLocalStorage}
            className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
          >
            Check localStorage
          </button>
          
          <button
            onClick={clearLocalStorage}
            className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600"
          >
            Clear localStorage
          </button>
          
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600"
          >
            Go to Checkout Directly
          </button>
          
          <button
            onClick={() => {
              console.log('Current auth state:', { isReady, isAuthenticated, user });
              console.log('localStorage msv_auth:', localStorage.getItem('msv_auth'));
              console.log('localStorage token:', localStorage.getItem('token'));
            }}
            className="w-full bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600"
          >
            Debug Auth State
          </button>
          
          <button
            onClick={async () => {
              console.log('Checking auth status...');
              const isValid = await checkAuthStatus();
              console.log('Auth status check result:', isValid);
              alert(`Token is ${isValid ? 'valid' : 'invalid'}`);
            }}
            className="w-full bg-indigo-500 text-white py-3 px-6 rounded-lg hover:bg-indigo-600"
          >
            Check Token Validity
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
          <h3 className="font-bold mb-2">Debug Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open Developer Tools (F12)</li>
            <li>Go to Console tab</li>
            <li>Click any test button above</li>
            <li>Watch console logs for debugging info</li>
            <li>Check Application tab → Local Storage to see stored data</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestCheckout;
