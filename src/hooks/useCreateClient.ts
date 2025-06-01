import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export type SocialNetwork = {
  type: string;
  handle: string;
  status: "Active" | "Inactive";
};

export type ClientData = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status?: "Active" | "Inactive";
  socialNetworks?: SocialNetwork[];
};

export const useCreateClient = () =>
  useMutation({
    mutationFn: async (clientData: ClientData) => {
      return await apiClient("https://backend-cm-assistance.onrender.com/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
    },
  });