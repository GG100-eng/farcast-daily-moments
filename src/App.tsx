
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MiniKitProvider } from '@/context/MiniKitContext';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FrameView from "./pages/FrameView";
import CameraPage from "./pages/CameraPage";
import CameraRedirect from "./pages/CameraRedirect";
import HomeRedirect from "./pages/HomeRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MiniKitProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/frame" element={<FrameView />} />
            <Route path="/camera" element={<CameraPage />} />
            <Route path="/redirect/camera" element={<CameraRedirect />} />
            <Route path="/redirect/home" element={<HomeRedirect />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MiniKitProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
