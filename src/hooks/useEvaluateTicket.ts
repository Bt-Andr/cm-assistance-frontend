import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type EvaluateTicketData = {
  ticketId: string;
  rating: number;
  comment?: string;
};

export const useEvaluateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ticketId, rating, comment }: EvaluateTicketData) => {
      const res = await apiClient(`/api/tickets/${ticketId}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'évaluation du ticket");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};