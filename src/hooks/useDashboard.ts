import { apiClient } from "@/lib/api";

export const fetchDashboardData = async () => {
  return await apiClient("/api/dashboard");
};