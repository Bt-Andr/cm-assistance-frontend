
import React, { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const [searchValue, setSearchValue] = useState('');
  
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
        <div className="relative">
          <button className="p-2 rounded-lg hover:bg-secondary-light transition-colors relative">
            <Bell className="h-5 w-5 text-secondary" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-white text-xs p-0 rounded-full">
              3
            </Badge>
          </button>
        </div>
        
        {/* Profile */}
        <div>
          <button className="flex items-center space-x-3 p-1 rounded-lg hover:bg-secondary-light transition-colors">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white">
              JD
            </div>
            <span className="text-sm font-medium text-secondary hidden sm:inline">John Doe</span>
            <ChevronDown className="h-4 w-4 text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
