import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreVertical, MessageSquare, CheckCircle, Clock, Trash2, Edit, Eye, Star, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTickets } from "@/hooks/useTickets";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { useDeleteTicket } from "@/hooks/useDeleteTicket"; // Ajoute cette ligne
import { useHideTicket } from "@/hooks/useHideTicket"; // Ajoute cette ligne

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
  const { user } = useUser();
  const deleteTicket = useDeleteTicket(); // Ajoute cette ligne
  const hideTicket = useHideTicket();

  // Pour la gestion de l'évaluation (exemple simple)
  const [evaluatedTicketId, setEvaluatedTicketId] = useState<string | null>(null);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  const filteredTickets = (tickets || []).filter(ticket => {
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        ticket._id.toLowerCase().includes(query) || 
        ticket.subject.toLowerCase().includes(query) ||
        ticket.user.toLowerCase().includes(query);
        
      if (!matchesSearch) return false;
    }
    
    // Apply status filter
    if (selectedFilter !== 'all' && ticket.status !== selectedFilter) {
      return false;
    }
    
    return true;
  });

  // Actions
  const handleDelete = (ticketId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce ticket ?")) {
      deleteTicket.mutate(ticketId, {
        onSuccess: () => {
          toast.success("Ticket supprimé avec succès");
        },
        onError: () => {
          toast.error("Erreur lors de la suppression du ticket");
        },
      });
    }
  };

  const handleEdit = (ticketId: string) => {
    // Redirige vers la page d'édition ou ouvre une modale
    toast.info("Redirection vers l'édition du ticket (simulation)");
  };

  const handleView = (ticketId: string) => {
    // Redirige vers la page de détail ou ouvre une modale
    toast.info("Affichage du détail du ticket (simulation)");
  };

  const handleReply = (ticketId: string) => {
    // Ouvre une modale de réponse ou redirige
    toast.info("Répondre au ticket (simulation)");
  };

  const handleEvaluate = (ticketId: string) => {
    setEvaluatedTicketId(ticketId);
    toast.success("Merci pour votre évaluation !");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 min-h-[50vh] animate-pulse px-4">
        <div className="h-8 w-1/3 bg-secondary-light rounded mb-4" />
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-secondary-light rounded" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return <p className="text-center text-red-500 py-10">Erreur lors du chargement des tickets.</p>;
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 overflow-x-hidden">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-secondary">Support Tickets</h1>
          {user?.role !== "admin" && (
            <div className="container mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Publications</h1>
                  <p className="text-gray-500">Gérez vos posts sur les réseaux sociaux</p>
                </div>
                <Link to="/tickets/new" aria-label="Créer un nouveau post">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    New Ticket
                  </Button>
                </Link>
              </div>
            </div>
          )}
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
                    filteredTickets.map((ticket) => {
                      const isAdmin = user?.role === "admin";
                      const isOwner = user?.email === ticket.email;
                      const canEdit = !isAdmin && isOwner && ticket.status === "open";
                      const canDelete = user?.role === "admin";
                      const canReply = isAdmin && ticket.status !== "closed";
                      const canEvaluate = !isAdmin && isOwner && ticket.status === "closed" && !ticket.evaluated;
                      const isExpanded = expandedTicketId === ticket._id;

                      return (
                        <React.Fragment key={ticket._id}>
                          <tr
                            className={`hover:bg-secondary-light/20 transition cursor-pointer`}
                            onClick={() =>
                              setExpandedTicketId(isExpanded ? null : ticket._id)
                            }
                            aria-expanded={isExpanded}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-primary">
                              {ticket._id}
                            </td>
                            <td className="px-6 py-4 text-sm text-secondary">
                              {ticket.subject}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs mr-2">
                                  {ticket.avatarUrl
                                    ? <img src={ticket.avatarUrl} alt={ticket.user} className="w-8 h-8 rounded-full object-cover" />
                                    : ticket.user[0]}
                                </div>
                                <span className="text-sm text-secondary">{ticket.user}</span>
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
                                <Button
                                  variant="outline"
                                  size="sm"
                                  aria-label="Voir le ticket"
                                  onClick={e => { e.stopPropagation(); setExpandedTicketId(isExpanded ? null : ticket._id); }}
                                >
                                  <Eye className="h-4 w-4 mr-1" /> {isExpanded ? "Masquer" : "Voir"}
                                </Button>
                                {canEdit && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label="Modifier le ticket"
                                    onClick={e => { e.stopPropagation(); handleEdit(ticket._id); }}
                                  >
                                    <Edit className="h-4 w-4 mr-1" /> Modifier
                                  </Button>
                                )}
                                {canDelete && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Supprimer le ticket"
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleDelete(ticket._id);
                                    }}
                                    disabled={deleteTicket.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                                {!isAdmin && isOwner && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Masquer le ticket"
                                    onClick={e => {
                                      e.stopPropagation();
                                      if (window.confirm("Voulez-vous masquer ce ticket ?")) {
                                        hideTicket.mutate(ticket._id);
                                      }
                                    }}
                                    disabled={hideTicket.isPending}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                                {canReply && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label="Répondre au ticket"
                                    onClick={e => { e.stopPropagation(); handleReply(ticket._id); }}
                                  >
                                    <Send className="h-4 w-4 mr-1" /> Répondre
                                  </Button>
                                )}
                                {canEvaluate && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label="Évaluer la réponse"
                                    onClick={e => { e.stopPropagation(); handleEvaluate(ticket._id); }}
                                    disabled={evaluatedTicketId === ticket._id}
                                  >
                                    <Star className="h-4 w-4 mr-1" /> Évaluer
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Plus d'actions"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={7} className="bg-gray-50 px-8 py-6 border-t">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold mb-2">Description</h4>
                                    <p className="text-sm text-secondary mb-4 whitespace-pre-line">{ticket.description}</p>
                                    <div className="mb-2">
                                      <span className="font-medium">Créé le :</span>{" "}
                                      <span className="text-secondary/70">{formatDate(ticket.createdAt)}</span>
                                    </div>
                                    <div className="mb-2">
                                      <span className="font-medium">Statut :</span>{" "}
                                      <StatusBadge status={ticket.status} />
                                    </div>
                                    <div className="mb-2">
                                      <span className="font-medium">Priorité :</span>{" "}
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
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Informations utilisateur</h4>
                                    <div className="flex items-center mb-2">
                                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white text-lg mr-3">
                                        {ticket.avatarUrl
                                          ? <img src={ticket.avatarUrl} alt={ticket.user} className="w-10 h-10 rounded-full object-cover" />
                                          : ticket.user[0]}
                                      </div>
                                      <div>
                                        <div className="font-medium">{ticket.user}</div>
                                        <div className="text-xs text-secondary/70">{ticket.email}</div>
                                      </div>
                                    </div>
                                    {/* Ajoute ici d'autres infos si besoin */}
                                  </div>
                                </div>
                                {/* Ajoute ici d'autres sections détaillées si besoin */}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
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
    </div>
  );
};

export default Tickets;
