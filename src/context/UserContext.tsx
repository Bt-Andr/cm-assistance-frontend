import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "@/utils/token";
import { toast } from "sonner";

interface User {
  userId: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("cm_token");
    if (token && isTokenValid(token)) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser({ userId: decoded.userId, email: decoded.email });
    } else {
      localStorage.removeItem("cm_token");
      setUser(null);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("cm_token", token);
    const decoded = JSON.parse(atob(token.split(".")[1]));
    setUser({ userId: decoded.userId, email: decoded.email });
    toast.success("Connexion réussie");
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("cm_token");
    setUser(null);
    toast("Déconnecté");
    navigate("/auth");
  };

  return (
    <UserContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
