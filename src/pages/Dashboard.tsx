
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Clock, CheckCircle, ArrowUp, ArrowDown, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import LogoutButton from '@/components/shared/LogoutButton';

// Activity item component
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  iconColor: string;
}

const ActivityItem = ({ title, description, time, icon: Icon, iconColor }: ActivityItemProps) => (
  <div className="flex gap-4 py-3">
    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", iconColor)}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div className="flex-1">
      <p className="font-medium text-secondary">{title}</p>
      <p className="text-sm text-secondary/70">{description}</p>
      <p className="text-xs text-secondary/50 mt-1">{time}</p>
    </div>
  </div>
);

// Stat card component
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
      <CardTitle className="text-sm font-medium text-secondary/70">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold text-secondary">{value}</p>
      {trend && (
        <div className="flex items-center mt-1">
          {trend.isPositive ? (
            <ArrowUp className="h-3 w-3 text-green-500" />
          ) : (
            <ArrowDown className="h-3 w-3 text-red-500" />
          )}
          <span className={cn(
            "text-xs ml-1",
            trend.isPositive ? "text-green-500" : "text-red-500"
          )}>
            {trend.value}
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header with illustration */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Welcome back, John</h1>
        <p className="text-secondary/70 mt-1">Here's what's happening with your clients today.</p>
      </div>

      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80" 
          alt="Dashboard illustration" 
          className="rounded-lg h-16 object-cover"
        />
        <LogoutButton />
      </div>
    </div>

      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Open Tickets" 
          value="14"
          trend={{ value: "+2.5%", isPositive: false }}
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <StatCard 
          title="Avg. Response Time" 
          value="1.2h"
          trend={{ value: "-8%", isPositive: true }}
          icon={<Clock className="h-4 w-4 text-primary" />}
        />
        <StatCard 
          title="Resolution Rate" 
          value="94%"
          trend={{ value: "+5.3%", isPositive: true }}
          icon={<CheckCircle className="h-4 w-4 text-primary" />}
        />
        <StatCard 
          title="New Clients" 
          value="5"
          trend={{ value: "+12%", isPositive: true }}
          icon={<UserPlus className="h-4 w-4 text-primary" />}
        />
      </div>
      
      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-secondary-light">
          <ActivityItem 
            title="New Ticket Created"
            description="Sarah Johnson created a new support ticket: 'Unable to schedule posts'"
            time="10 minutes ago"
            icon={Users}
            iconColor="bg-blue-500"
          />
          <ActivityItem 
            title="Post Published"
            description="Monthly newsletter has been published to Facebook and Twitter"
            time="1 hour ago"
            icon={BarChart}
            iconColor="bg-green-500"
          />
          <ActivityItem 
            title="Ticket Resolved"
            description="You resolved ticket #45982: 'Login issues on mobile app'"
            time="2 hours ago"
            icon={CheckCircle}
            iconColor="bg-primary"
          />
          <ActivityItem 
            title="New Client Onboarded"
            description="TechCorp Inc. has been successfully onboarded to the platform"
            time="Yesterday"
            icon={UserPlus}
            iconColor="bg-purple-500"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
