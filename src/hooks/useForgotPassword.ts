import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type ForgotPasswordData = {
  email: string;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      // apiClient gère déjà la gestion des erreurs et retourne le JSON
      return await apiClient("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
  });
};