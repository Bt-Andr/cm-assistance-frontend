import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDashboard } from "@/hooks/useDashboard";
import LogoutButton from "@/components/shared/LogoutButton";
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';

const getInitials = (name?: string, email?: string) => {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "U";
};

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const { data } = useDashboard();
  const user = data?.user;
  const notifications = data?.notifications || []; // notifications dynamiques
  const notifCount = notifications.length;
  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Suppose que la photo de profil est dans user.avatar ou user.photoURL
  const profilePhoto = user?.avatar || user?.photoURL;

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      // Ajout pour notifications
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (dropdownOpen || notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, notifOpen]);

  return (
    <div className="h-16 border-b border-secondary-light bg-white flex items-center px-6 justify-between">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-secondary">Dashboard</h1>
      </div>
      
      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-secondary/50" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 rounded-lg bg-secondary-light border-0 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className="p-2 rounded-lg hover:bg-secondary-light transition-colors relative"
            onClick={() => setNotifOpen((open) => !open)}
          >
            <Bell className="h-5 w-5 text-secondary" />
            {notifCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-white text-xs p-0 rounded-full">
                {notifCount}
              </Badge>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-secondary-light rounded-lg shadow-lg z-50">
              <div className="p-4 font-semibold text-secondary border-b border-secondary-light">
                Notifications
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifCount === 0 ? (
                  <div className="p-4 text-secondary/60 text-sm">Aucune notification</div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={idx} className="p-4 border-b border-secondary-light last:border-b-0 text-sm text-secondary">
                      <div className="font-medium">{notif.title}</div>
                      <div className="text-xs text-secondary/60">{notif.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center space-x-3 p-1 rounded-lg hover:bg-secondary-light transition-colors"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={user?.name || user?.email || "Utilisateur"}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold">
                {getInitials(user?.name, user?.email)}
              </div>
            )}
            <span className="text-sm font-medium text-secondary hidden sm:inline">
              {user?.name || user?.email || "Utilisateur"}
            </span>
            <ChevronDown className="h-4 w-4 text-secondary" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-secondary-light rounded-lg shadow-lg z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-secondary hover:bg-secondary-light transition-colors"
              >
                Mon profil
              </Link>
              <Link
                to="/tickets"
                className="block px-4 py-2 text-secondary hover:bg-secondary-light transition-colors"
              >
                Mes tickets
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-secondary hover:bg-secondary-light transition-colors"
              >
                Paramètres
              </Link>
              <div className="border-t border-secondary-light my-1" />
                <LogoutButton className={cn("block px-4 py-2 text-red-600 hover:bg-secondary-light transition-colors")}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
