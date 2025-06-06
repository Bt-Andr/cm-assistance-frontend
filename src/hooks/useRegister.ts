import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type RegisterData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      // apiClient gère déjà la gestion des erreurs et retourne le JSON
      return await apiClient("https://backend-cm-assistance.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
  });
};