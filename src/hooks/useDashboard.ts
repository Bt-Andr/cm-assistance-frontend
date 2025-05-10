// src/hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

interface DashboardActivity {
  title: string;
  description: string;
  time: string;
  icon?: string;
  type?: "open" | "closed" | "info"; // on peut étendre selon les types possibles
}

interface DashboardData {
  stats: {
    openTickets: number;
    openTicketsTrend: string;
    avgResponseTime: string;
    avgResponseTimeTrend: string;
    resolutionRate: string;
    resolutionRateTrend: string;
    newClients: number;
    newClientsTrend: string;
  };
  activities: DashboardActivity[]; // renommé pour correspondre à ton code
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () =>
      apiClient("https://backend-cm-assistance.onrender.com/api/dashboard"),
  });
};
