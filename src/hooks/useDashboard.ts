// src/hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

interface DashboardActivity {
  title: string;
  description: string;
  time: string;
  icon?: string;
  type?: "open" | "closed" | "info" | "other";
}

interface DashboardData {
  stats: {
    openTickets: number;
    openTicketsTrend: string;
    openTicketsIsPositive?: boolean;
    avgResponseTime: string;
    avgResponseTimeTrend: string;
    avgResponseTimeIsPositive?: boolean;
    resolutionRate: string;
    resolutionRateTrend: string;
    resolutionRateIsPositive?: boolean;
    newClients: number;
    newClientsTrend: string;
    newClientsIsPositive?: boolean;
    activeUsers: number;
  };
  activities: DashboardActivity[];
  notifications: DashboardActivity[];
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    preferences?: {
      language?: string;
      notifications?: boolean;
    };
    emailVerified?: boolean;
    isActive?: boolean;
    lastActiveAt?: string;
    permissions?: string[];
    referredBy?: string;
  };
}

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () =>
      apiClient("https://backend-cm-assistance.onrender.com/api/dashboard"),
  });
};
