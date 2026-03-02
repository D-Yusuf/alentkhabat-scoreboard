import React, { useState, useEffect } from "react";

const LoadingPage = () => {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 1500);
    const unmountTimer = setTimeout(() => setMounted(false), 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--dark-bg)] transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <img
        src="/Full-Logo.png"
        alt="Logo"
        className="w-[180px] h-auto loader-logo-img"
      />
    </div>
  );
};

export default LoadingPage;
