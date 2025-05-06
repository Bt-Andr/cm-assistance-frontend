import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const RedirectByAuth = () => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) return null; // ou afficher un <Spinner /> si tu veux

  return <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />;
};

export default RedirectByAuth;
