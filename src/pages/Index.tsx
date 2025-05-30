import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/spinner";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/auth");
    }, 800); // Petite pause pour afficher le loader
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner />
      <span className="ml-3 text-secondary text-sm">Redirection en cours...</span>
    </div>
  );
};

export default Index;
