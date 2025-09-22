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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <img 
          src="/Full-Logo.png" 
          alt="Scoreboard Logo" 
          className="w-32 h-32 animate-pulse"
        />
        <p className="mt-4 text-foreground text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;