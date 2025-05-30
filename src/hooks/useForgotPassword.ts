import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type ForgotPasswordData = {
  email: string;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const res = await apiClient("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la demande de réinitialisation");
      }
      return res.json();
    },
  });
};