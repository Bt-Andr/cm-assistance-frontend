import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const RedirectByAuth = () => {
  const { isAuthenticated } = useUser();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />;
};

export default RedirectByAuth;