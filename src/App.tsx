import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "@/components/routing/ProtectedRoute";
import RedirectByAuth from "@/components/routing/RedirectByAuth";
import React, { Suspense } from "react";
import Spinner from "@/components/ui/spinner";
import CreateTickets from "./pages/CreateTickets";
import CreateClient from "./pages/CreateClient";
import ProfileUpdateConfirm from "./pages/ProfileUpdateConfirm";
import ResetPassword from "./pages/ResetPassword";

// Lazy loading pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Tickets = React.lazy(() => import("./pages/Tickets"));
const Posts = React.lazy(() => import("./pages/Posts"));
const CreatePost = React.lazy(() => import("./pages/CreatePost"));
const Settings = React.lazy(() => import("./pages/Settings"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Clients = React.lazy(() => import("./pages/Clients"));
const Index = React.lazy(() => import("./pages/Index"));
const EditPost = React.lazy(() => import("./pages/EditPost"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors position="top-right" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Spinner />
          </div>
        }
      >
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
            path="/clients/Createclient"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateClient />
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
            path="/profile/confirm-update"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProfileUpdateConfirm />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/tickets/new"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateTickets />
                </AppLayout>
              </ProtectedRoute>
            }
          />
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
          <Route path="/reset-password" element={<ResetPassword />} />
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
