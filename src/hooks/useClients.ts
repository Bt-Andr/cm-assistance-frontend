import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export type SocialNetwork = {
  type: string;
  handle: string;
  status: "Active" | "Inactive";
};

export type Client = {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: "Active" | "Inactive";
  socialNetworks: SocialNetwork[];
};

const fetchClients = async (): Promise<Client[]> => {
  const res = await apiClient("https://backend-cm-assistance.onrender.com/api/clients");
  return res.clients || [];
};

export const useClients = () =>
  useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });