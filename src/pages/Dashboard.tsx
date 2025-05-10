import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Users,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/shared/LogoutButton";
import { useDashboard } from "@/hooks/useDashboard";
import Spinner from "@/components/ui/spinner";

// Activity item
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  iconColor: string;
}

const ActivityItem = ({
  title,
  description,
  time,
  icon: Icon,
  iconColor,
}: ActivityItemProps) => (
  <div className="flex gap-4 py-3">
    <div
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
        iconColor
      )}
    >
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div className="flex-1">
      <p className="font-medium text-secondary">{title}</p>
      <p className="text-sm text-secondary/70">{description}</p>
      <p className="text-xs text-secondary/50 mt-1">{time}</p>
    </div>
  </div>
);

// Stat card
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <Card className="shadow-card">
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium text-secondary/70">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold text-secondary">{value}</p>
      {trend && (
        <div className="flex items-center mt-1">
          {trend.value === "0%" || trend.value === "+0%" || trend.value === "-0%" ? null : (
            trend.isPositive ? (
              <ArrowUp className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500" />
            )
          )}
          <span
            className={cn(
              "text-xs ml-1",
              trend.value === "0%" || trend.value === "+0%" || trend.value === "-0%"
                ? "text-gray-400"
                : trend.isPositive
                ? "text-green-500"
                : "text-red-500"
            )}
          >
            {trend.value}
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Main Dashboard
const Dashboard = () => {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Une erreur réseau ou serveur est survenue lors du chargement du tableau de bord.
      </div>
    );
  }
  if (!data) {
    return (
      <div className="text-center text-red-500">
        Les données du tableau de bord sont absentes.
      </div>
    );
  }
  if (!data.user) {
    return (
      <div className="text-center text-red-500">
        Les informations utilisateur sont absentes dans la réponse du tableau de bord.
      </div>
    );
  }
  if (!data.stats) {
    return (
      <div className="text-center text-red-500">
        Les statistiques du tableau de bord sont absentes dans la réponse.
      </div>
    );
  }

  const { user, stats, activities } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary">
            Welcome back, {user?.name || user?.email || "Utilisateur"}
          </h1>
          <p className="text-secondary/70 mt-1">
            Here's what's happening with your clients today.
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80"
            alt="Dashboard illustration"
            className="rounded-lg h-16 object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open Tickets"
          value={stats.openTickets?.toString() ?? "0"}
          trend={{ value: stats.openTicketsTrend, isPositive: false }}
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <StatCard
          title="Avg. Response Time"
          value={stats.avgResponseTime ?? "N/A"}
          trend={{ value: stats.avgResponseTimeTrend, isPositive: true }}
          icon={<Clock className="h-4 w-4 text-primary" />}
        />
        <StatCard
          title="Resolution Rate"
          value={stats.resolutionRate ?? "N/A"}
          trend={{ value: stats.resolutionRateTrend, isPositive: true }}
          icon={<CheckCircle className="h-4 w-4 text-primary" />}
        />
        <StatCard
          title="New Clients"
          value={stats.newClients?.toString() ?? "0"}
          trend={{ value: stats.newClientsTrend, isPositive: true }}
          icon={<UserPlus className="h-4 w-4 text-primary" />}
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-secondary-light">
          {activities && activities.length > 0 ? (
            activities.map((item, index) => (
              <ActivityItem
                key={index}
                title={item.title}
                description={item.description}
                time={item.time}
                icon={
                  item.type === "open"
                    ? MessageSquare
                    : item.type === "closed"
                    ? CheckCircle
                    : BarChart
                }
                iconColor={
                  item.type === "open"
                    ? "bg-blue-500"
                    : item.type === "closed"
                    ? "bg-green-500"
                    : "bg-primary"
                }
              />
            ))
          ) : (
            <p className="text-sm text-center text-secondary/60 py-6">
              Aucune activité récente.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
