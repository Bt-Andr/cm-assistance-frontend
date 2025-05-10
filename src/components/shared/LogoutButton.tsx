import { useNavigate } from "react-router-dom";
import React from "react";
import { string } from "zod";

type LogoutButtonProps = {
  className?: string;
};

const LogoutButton = ({ className }: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("cm_token");
    navigate("/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className={className ?? "text-sm text-red-600 hover:underline"}
    >
      Déconnexion
    </button>
  );
};

export default LogoutButton;
