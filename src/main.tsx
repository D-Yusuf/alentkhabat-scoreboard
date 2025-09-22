import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "./i18n";
import React from "react";
import LoadingPage from "./components/LoadingPage";

createRoot(document.getElementById("root")!).render(
  <React.Suspense fallback={<LoadingPage />}>
    <App />
  </React.Suspense>
);