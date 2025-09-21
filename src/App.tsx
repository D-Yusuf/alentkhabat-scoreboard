import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import ScoreList from "./pages/ScoreList";
import NotFound from "./pages/NotFound";
import { ScoreProvider } from "@/context/ScoreContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ScoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Teams />} />
              <Route path="/players" element={<Players />} />
              <Route path="/score-list" element={<ScoreList />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ScoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;