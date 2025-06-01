import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type CreateTicketData = {
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
};

export const useCreateTickets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postData: CreateTicketData) => {
      return await apiClient("https://backend-cm-assistance.onrender.com/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
    },
    onSuccess: () => {
      // Invalide le cache pour rafraîchir la liste des tickets
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};