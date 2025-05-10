// 📁 src/components/routing/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/ui/spinner"; // adapte le chemin si besoin

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
