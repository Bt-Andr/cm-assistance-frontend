export type DashboardActivity = {
  title: string;
  description: string;
  time: string; // ISO string recommandé
  icon?: string;
  type?: "open" | "closed" | "other";
};

export type DashboardStats = {
  openTickets: number;
  avgResponseTime: string;
  resolutionRate: string;
  newClients: number;
  // Champs extensibles pour de futures métriques
  [key: string]: number | string | undefined;
};

export type DashboardUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "manager";
};

export type DashboardNotification = {
  title: string;
  time: string; // ISO string recommandé
  type?: "info" | "warning" | "error";
};

export type DashboardResponse = {
  stats: DashboardStats;
  activity: DashboardActivity[];
  user: DashboardUser;
  notifications?: DashboardNotification[];
  hasMoreActivity?: boolean; // Pour la pagination éventuelle
};