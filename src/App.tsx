import React, { useEffect } from 'react';

const App: React.FC = () => {
  useEffect(() => {
    const initApp = async () => {
      try {
        // Check if the backend is available
        const response = await fetch('/api/health');
        if (response.ok) {
          window.location.href = '/';
        } else {
          throw new Error('Backend service not available');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        // Keep showing the loading screen with error message
        const errorElement = document.querySelector('.text-gray-600');
        if (errorElement) {
          errorElement.textContent = 'Error initializing application. Please try again or contact support.';
        }
      }
    };
    
    initApp();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Loading GCT UI...</h1>
        <p className="text-gray-600">Please wait while we initialize the application.</p>
      </div>
    </div>
  );
};

export default App;
