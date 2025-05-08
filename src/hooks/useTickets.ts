import { apiClient } from "@/lib/api";

export const fetchTickets = async () => {
  return await apiClient("/api/tickets");
};