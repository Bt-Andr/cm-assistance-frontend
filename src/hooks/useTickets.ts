import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type TicketHistory = {
  action: string;
  message: string;
  author: string;
  date: string;
};

type Ticket = {
  _id: string;
  subject: string;
  message: string;
  status: "open" | "pending" | "closed";
  priority: "low" | "medium" | "high";
  user: string;
  email: string;
  avatarUrl?: string;
  assignedTo?: string;
  category?: string;
  tags?: string[];
  attachments?: string[];
  history?: TicketHistory[];
  slaDueAt?: string;
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string | null;
  closedAt?: string | null;
  resolutionTime?: string;
  evaluated?: boolean;
  description?: string;
};

export const useTickets = () => {
  return useQuery<Ticket[]>({
    queryKey: ["tickets"],
    queryFn: async () => {
      const res = await apiClient("https://backend-cm-assistance.onrender.com/api/tickets");
      // Si l'API retourne { data: Ticket[] }
      if (res.data) return res.data;
      // Si l'API retourne directement un tableau
      if (Array.isArray(res)) return res;
      // Si apiClient retourne un objet Response
      if (typeof res.json === "function") {
        const data = await res.json();
        return data.data ?? data;
      }
      // Par défaut, retourne un tableau vide
      return [];
    },
  });
};
