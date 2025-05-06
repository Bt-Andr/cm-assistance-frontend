// 📁 src/components/routing/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
