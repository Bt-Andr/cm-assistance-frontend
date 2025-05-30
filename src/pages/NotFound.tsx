import { useLocation, Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useUser();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Détermine la page d'accueil selon le rôle
  let homePath = "/auth";
  if (isAuthenticated) {
    homePath = user?.role === "admin" ? "/dashboard" : "/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-4">
          Oups ! Cette page n’existe pas.<br />
          <span className="text-sm text-gray-400">({location.pathname})</span>
        </p>
        <Link
          to={homePath}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
