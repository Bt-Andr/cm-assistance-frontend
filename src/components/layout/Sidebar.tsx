import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Settings,
  Users,
  Calendar,
  BarChart,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
};

const SidebarItem = ({ icon: Icon, label, to, active }: SidebarItemProps) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      "hover:bg-secondary-light hover:text-primary",
      active ? "bg-primary text-white hover:bg-primary hover:text-white" : "text-secondary"
    )}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

// Fonction utilitaire pour les initiales
function getInitials(name?: string, email?: string) {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "U";
}

const Sidebar = () => {
  const currentPath = window.location.pathname;
  const { user } = useUser();

  return (
    <div className="w-64 min-h-screen bg-white border-r border-secondary-light flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-secondary-light">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold">
            CM
          </div>
          <span className="text-lg font-semibold text-secondary">Assistance</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="p-3 flex-1 space-y-1 overflow-y-auto">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          to="/" 
          active={currentPath === '/'}
        />
        <SidebarItem 
          icon={MessageSquare} 
          label="Tickets" 
          to="/tickets" 
          active={currentPath.startsWith('/tickets')}
        />
        <SidebarItem 
          icon={FileText} 
          label="Posts" 
          to="/posts" 
          active={currentPath.startsWith('/posts')}
        />
        <SidebarItem 
          icon={Users} 
          label="Clients" 
          to="/clients" 
          active={currentPath.startsWith('/clients')}
        />
        <SidebarItem 
          icon={Calendar} 
          label="Calendar" 
          to="/calendar" 
          active={currentPath.startsWith('/calendar')}
        />
        {/* Affichage conditionnel pour l'admin */}
        {user?.role === "admin" && (
          <SidebarItem 
            icon={BarChart} 
            label="Analytics" 
            to="/analytics" 
            active={currentPath.startsWith('/analytics')}
          />
        )}
        
        <div className="py-2">
          <div className="h-px bg-secondary-light"></div>
        </div>
        
        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          to="/settings" 
          active={currentPath.startsWith('/settings')}
        />
        <SidebarItem 
          icon={HelpCircle} 
          label="Help" 
          to="/help" 
          active={currentPath.startsWith('/help')}
        />
      </div>
      
      {/* User Section */}
      <div className="p-4 border-t border-secondary-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg">
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-secondary truncate">{user?.name || "John Doe"}</p>
            <p className="text-xs text-secondary/60 truncate">{user?.email || "john@example.com"}</p>
            <p className="text-xs text-primary/80 mt-1">{user?.role === "admin" ? "Administrateur" : "Utilisateur"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
