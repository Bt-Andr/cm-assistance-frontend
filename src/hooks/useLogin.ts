import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type LoginData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      return await apiClient("https://backend-cm-assistance.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
    },
  });
};