import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      return await apiClient("https://backend-cm-assistance.onrender.com/api/tickets");
    },
  });
};
