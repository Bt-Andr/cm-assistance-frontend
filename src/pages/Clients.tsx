import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, ChevronDown, ChevronUp, Plus, Edit, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/components/ui/spinner";
import { useClients } from "@/hooks/useClients";
import { useDeleteClient } from "@/hooks/useDeleteClient";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';

// Social network icon mapping
const getSocialNetworkIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'facebook':
      return <Facebook className="h-4 w-4" />;
    case 'instagram':
      return <Instagram className="h-4 w-4" />;
    case 'twitter':
      return <Twitter className="h-4 w-4" />;
    case 'linkedin':
      return <Linkedin className="h-4 w-4" />;
    case 'youtube':
      return <Youtube className="h-4 w-4" />;
    default:
      return <Facebook className="h-4 w-4" />;
  }
};

const Clients = () => {
  const [selectedClient, setSelectedClient] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const navigate = useNavigate();

  // Utilisation du hook useClients
  const { data: clientsData = [], isLoading, isError } = useClients();
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();

  const handleClientClick = (clientId: string | number) => {
    setSelectedClient(selectedClient === clientId ? null : clientId);
  };

  const handleDelete = (clientId: string | number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce client ?")) return;
    setDeletingId(clientId);
    deleteClient(clientId.toString(), {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Client supprimé avec succès !");
        setDeletingId(null);
        if (selectedClient === clientId) setSelectedClient(null);
      },
      onError: (error: any) => {
        toast.error(
          error?.message ||
          error?.response?.data?.message ||
          (typeof error === "string" ? error : "Erreur lors de la suppression du client")
        );
        setDeletingId(null);
      },
    });
  };

  // Recherche et filtre (exemple simple)
  const [search, setSearch] = useState("");
  const filteredClients = clientsData.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Une erreur est survenue lors du chargement des clients.
      </div>
    );
  }

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-gray-500">Manage your client accounts and social media presence</p>
        </div>
        <Link
          to="/clients/Createclient"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          Ajouter un client
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border rounded-lg px-3 py-2 w-full max-w-xs text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredClients.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Aucun client trouvé.</div>
        ) : (
          filteredClients.map((client) => (
            <Collapsible
              key={client.id}
              open={selectedClient === client.id}
              onOpenChange={() => handleClientClick(client.id)}
              className="border rounded-lg overflow-hidden bg-white transition-all duration-200"
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 px-4 hover:bg-gray-50 cursor-pointer text-left transition-all duration-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="font-medium">{client.name}</h3>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs mr-2 ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {client.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Éditer le client"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/clients/${client.id}/edit`);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Supprimer le client"
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(client.id);
                      }}
                      disabled={isDeleting && deletingId === client.id}
                    >
                      {isDeleting && deletingId === client.id ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                    {selectedClient === client.id ? 
                      <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    }
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="grid md:grid-cols-2 gap-4 p-4 border-t">
                  {/* Client Details (Left Side) */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Details</CardTitle>
                      <CardDescription>Contact and account information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="mt-1">{client.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1">{client.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Phone</dt>
                          <dd className="mt-1">{client.phone}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Address</dt>
                          <dd className="mt-1">{client.address}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {client.status}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>

                  {/* Social Networks List (Right Side) */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Networks</CardTitle>
                      <CardDescription>Client's social media accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Platform</TableHead>
                              <TableHead>Handle</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {client.socialNetworks.map((network, idx) => (
                              <TableRow key={idx}>
                                <TableCell>
                                  <div className="flex items-center">
                                    {getSocialNetworkIcon(network.type)}
                                    <span className="ml-2">{network.type}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{network.handle}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${network.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {network.status}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
};

export default Clients;
