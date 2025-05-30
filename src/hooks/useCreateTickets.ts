import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type CreateTicketData = {
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
};

export const useCreateTickets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticket: CreateTicketData) => {
      const res = await apiClient("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la création du ticket");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalide le cache pour rafraîchir la liste des tickets
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};