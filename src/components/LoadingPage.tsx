import React, { useState, useEffect } from 'react';

const LoadingPage = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <img 
          src="/Full-Logo.png" 
          alt="Scoreboard Logo" 
          className="w-48 h-48 animate-pulse"
        />
      </div>
    </div>
  );
};

export default LoadingPage;