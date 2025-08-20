import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestBuyNow = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(message);
  };

  const testBuyNowFlow = () => {
    addLog('=== TESTING BUY NOW FLOW ===');
    
    // Clear previous data
    localStorage.removeItem('checkoutItems');
    addLog('Cleared localStorage');
    
    // Create test product
    const testProduct = {
      id: 999,
      name: 'Test Product',
      price: 100000,
      discountPrice: 90000,
      images: ['/uploads/products/default.svg'],
      shop: { name: 'Test Shop' }
    };
    
    const quantity = 1;
    
    // Simulate handleBuyNow
    const cartProduct = {
      id: testProduct.id,
      name: testProduct.name,
      price: testProduct.discountPrice,
      image: testProduct.images[0],
      quantity: quantity,
      shopName: testProduct.shop.name
    };
    
    addLog('Created cart product: ' + JSON.stringify(cartProduct));
    
    try {
      // Save to localStorage
      localStorage.setItem('checkoutItems', JSON.stringify([cartProduct]));
      addLog('Saved to localStorage successfully');
      
      // Verify save
      const saved = localStorage.getItem('checkoutItems');
      addLog('Verification - localStorage content: ' + saved);
      
      // Navigate to checkout
      addLog('Navigating to checkout...');
      setTimeout(() => {
        navigate('/checkout');
      }, 500);
      
    } catch (error) {
      addLog('ERROR: ' + error.message);
    }
  };

  const checkLocalStorage = () => {
    const items = localStorage.getItem('checkoutItems');
    addLog('Current localStorage checkoutItems: ' + (items || 'null'));
    if (items) {
      try {
        const parsed = JSON.parse(items);
        addLog('Parsed items: ' + JSON.stringify(parsed));
      } catch (error) {
        addLog('Parse error: ' + error.message);
      }
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Test Buy Now Flow</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-4">
            <button
              onClick={testBuyNowFlow}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600"
            >
              Test Buy Now Flow
            </button>
            
            <button
              onClick={checkLocalStorage}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
            >
              Check localStorage
            </button>
            
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
            >
              Go to Checkout Directly
            </button>
            
            <button
              onClick={() => localStorage.removeItem('checkoutItems')}
              className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600"
            >
              Clear localStorage
            </button>
            
            <button
              onClick={clearLogs}
              className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600"
            >
              Clear Logs
            </button>
          </div>
          
          {/* Logs */}
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
            <div className="mb-2 text-white font-bold">Console Logs:</div>
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
          <h3 className="font-bold mb-2">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open Developer Tools (F12) → Console</li>
            <li>Click "Test Buy Now Flow" button</li>
            <li>Watch both the logs here and in browser console</li>
            <li>Should navigate to checkout page after 0.5 seconds</li>
            <li>Check if checkout page shows the test product</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestBuyNow;
