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
      const res = await apiClient("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de l'inscription");
      }
      return res.json();
    },
  });
};