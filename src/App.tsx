import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import PacksPage from "./pages/PacksPage.tsx";
import CollectionPage from "./pages/CollectionPage.tsx";
import BattlePage from "./pages/BattlePage.tsx";
import NotFound from "./pages/NotFound.tsx";
import StorePage from "./pages/StorePage.tsx";
import AuthPage from "./pages/AuthPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/packs" element={<PacksPage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/battle" element={<BattlePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;