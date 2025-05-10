
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreVertical, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTickets } from "@/hooks/useTickets";

// Status badge component
interface StatusBadgeProps {
  status: 'open' | 'closed' | 'pending';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let bgColor = '';
  let textColor = '';
  let label = '';
  let icon: React.ReactNode = null;
  
  switch (status) {
    case 'open':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-700';
      label = 'Open';
      icon = <MessageSquare className="h-3 w-3 mr-1" />;
      break;
    case 'closed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      label = 'Closed';
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      break;
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      label = 'Pending';
      icon = <Clock className="h-3 w-3 mr-1" />;
      break;
  }
  
  return (
    <span className={cn(
      "px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit",
      bgColor,
      textColor
    )}>
      {icon}
      {label}
    </span>
  );
};


// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Tickets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { data: tickets, isLoading, error } = useTickets();
  
  const filteredTickets = (tickets || []).filter(ticket => {
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        ticket.id.toLowerCase().includes(query) || 
        ticket.subject.toLowerCase().includes(query) ||
        ticket.client.toLowerCase().includes(query);
        
      if (!matchesSearch) return false;
    }
    
    // Apply status filter
    if (selectedFilter !== 'all' && ticket.status !== selectedFilter) {
      return false;
    }
    
    return true;
  });
  
  if (isLoading) {
    return <p className="text-center py-10">Chargement des tickets...</p>;
  }
  
  if (error) {
    return <p className="text-center text-red-500 py-10">Erreur lors du chargement des tickets.</p>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-secondary">Support Tickets</h1>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>
      
      <Card className="shadow-card">
        <CardHeader className="border-b border-secondary-light">
          <div className="flex items-center justify-between">
            <CardTitle>All Tickets</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg bg-secondary-light border-0 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none pl-10 pr-10 py-2 rounded-lg bg-secondary-light border-0 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-secondary-light bg-secondary-light/30">
                  <th className="px-6 py-3 text-xs font-medium text-secondary/70">TICKET ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-secondary/70">SUBJECT</th>
                  <th className="px-6 py-3 text-xs font-medium text-secondary/70">CLIENT</th>
                  <th className="px-6 py-3 text-xs font-medium text-secondary/70">DATE</th>
                  <th className="px-6 py-3 text-xs font-medium text-secondary/70">STATUS</th>
                  <th className="px-6 py-3 text-xs font-medium text-secondary/70">PRIORITY</th>
                  <th className="px-6 py-3 text-xs font-medium text-secondary/70">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-light">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-secondary-light/20">
                      <td className="px-6 py-4 text-sm font-medium text-primary">
                        {ticket.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs mr-2">
                            {ticket.clientAvatar}
                          </div>
                          <span className="text-sm text-secondary">{ticket.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary/70">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          {
                            'bg-red-100 text-red-700': ticket.priority === 'high',
                            'bg-yellow-100 text-yellow-700': ticket.priority === 'medium',
                            'bg-gray-100 text-gray-700': ticket.priority === 'low'
                          }
                        )}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <MessageSquare className="h-8 w-8 text-secondary/30 mb-2" />
                        <p className="text-sm font-medium text-secondary">No tickets found</p>
                        <p className="text-xs text-secondary/70 mt-1">
                          {searchQuery ? 'Try adjusting your search or filters' : 'No tickets currently in the system'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tickets;
