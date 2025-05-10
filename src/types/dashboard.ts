export type DashboardActivity = {
    title: string;
    description: string;
    time: string;
    icon?: string;
    type?: "open" | "closed" | "other";
  };
  
  export type DashboardStats = {
    openTickets: number;
    avgResponseTime: string;
    resolutionRate: string;
    newClients: number;
  };
  
  export type DashboardUser = {
    id: string;
    email: string;
    name: string;
  };
  
  export type DashboardResponse = {
    stats: DashboardStats;
    activity: DashboardActivity[];
    user: DashboardUser;
  };