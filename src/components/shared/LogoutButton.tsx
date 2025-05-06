import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("cm_token");
    navigate("/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 hover:underline"
    >
      Déconnexion
    </button>
  );
};

export default LogoutButton;
