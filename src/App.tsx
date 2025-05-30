import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import RedirectByAuth from "@/components/routing/RedirectByAuth";
import React, { Suspense } from "react";
import Spinner from "@/components/ui/spinner";

// Lazy loading pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Tickets = React.lazy(() => import("./pages/Tickets"));
const Posts = React.lazy(() => import("./pages/Posts"));
const CreatePost = React.lazy(() => import("./pages/CreatePost"));
const Settings = React.lazy(() => import("./pages/Settings"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Clients = React.lazy(() => import("./pages/Clients"));
// Ajoute ici d'autres pages si besoin
const Index = React.lazy(() => import("./pages/Index"));
const EditPost = React.lazy(() => import("./pages/EditPost"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors position="top-right" />
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Spinner />
          </div>
        }>
          <Routes>
            <Route path="/" element={<RedirectByAuth />} />
            <Route path="/index" element={<Index />} />
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
              path="/posts" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Posts />
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
              path="/clients" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Clients />
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
              path="/auth" 
              element={<Auth />} 
            />
            {/* Ajout d'une route pour la création de ticket */}
            <Route 
              path="/tickets/new"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div>Créer un ticket (à implémenter)</div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            {/* Ajout d'une route pour la modification d'un post */}
            <Route 
              path="/posts/:postId/edit"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <React.Suspense fallback={<Spinner />}>
                      <EditPost />
                    </React.Suspense>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="*"
              element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
