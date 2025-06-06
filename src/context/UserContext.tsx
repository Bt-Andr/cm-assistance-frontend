import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenValid } from "@/utils/token";
import { toast } from "sonner";

interface User {
  avatarFile: string;
  userId: string;
  email: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  name?: string
  position?: string;
  company?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  // Ajoute d'autres champs utiles si besoin
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("cm_token");

    if (token && isTokenValid(token)) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        position: decoded.position,
        company: decoded.company,
        phone: decoded.phone,
        address: decoded.address,
        avatarUrl: decoded.avatarUrl,
        avatarFile: decoded.avatarFile,
      });
    } else {
      localStorage.removeItem("cm_token");
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  // Accepte un user optionnel pour compatibilité avec Auth.tsx
  const login = (token: string, userObj?: User) => {
    localStorage.setItem("cm_token", token);
    let userToSet: User;
    if (userObj) {
      userToSet = userObj;
    } else {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      userToSet = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        position: decoded.position,
        company: decoded.company,
        phone: decoded.phone,
        address: decoded.address,
        avatarUrl: decoded.avatarUrl,
        avatarFile: decoded.avatarFile,
      };
    }
    setUser(userToSet);
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
    <UserContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
