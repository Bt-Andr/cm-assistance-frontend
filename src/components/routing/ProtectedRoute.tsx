// 📁 src/components/routing/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/ui/spinner"; // adapte le chemin si besoin

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // optionnel, ex: "admin"
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useUser();

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

  if (requiredRole && user?.role !== requiredRole) {
    // Redirige ou affiche un message d'accès refusé
    return <Navigate to="/dashboard" replace />;
    // Ou : return <div>Accès refusé</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
