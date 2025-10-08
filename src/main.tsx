import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "./i18n";
import React, { useState, useEffect } from "react";
import LoadingPage from "./components/LoadingPage";

const Root = () => {
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1250);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      {isLoading && <LoadingPage />}
      {!isLoading && <App />}
    </>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);