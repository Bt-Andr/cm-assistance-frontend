
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import RedirectByAuth from "@/components/routing/RedirectByAuth";

// Import pages
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster richColors position="top-right" />
        <Routes>
        <Route path="/" element={<RedirectByAuth />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tickets" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Tickets />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/posts/new" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CreatePost />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Navigate to="/posts/new" replace />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/auth" 
            element={
                  <Auth />
            } 
          />
          <Route path="*" 
            element={
              <ProtectedRoute>
                  <NotFound />
              </ProtectedRoute>
            } 
          />
        </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
