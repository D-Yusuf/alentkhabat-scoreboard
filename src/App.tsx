import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import ScoreList from "./pages/ScoreList";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ScoreProvider } from "@/context/ScoreContext";
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const AppContent = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Teams />} />
        <Route path="/players" element={<Players />} />
        <Route path="/score-list" element={<ScoreList />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <ScoreProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ScoreProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;