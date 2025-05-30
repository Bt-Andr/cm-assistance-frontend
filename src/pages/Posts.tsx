import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, ThumbsUp, MessageSquare, Share, Facebook, Twitter, Instagram, Linkedin, Search } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePosts } from "@/hooks/usePosts";

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <Facebook className="h-4 w-4" />;
    case 'twitter':
      return <Twitter className="h-4 w-4" />;
    case 'instagram':
      return <Instagram className="h-4 w-4" />;
    case 'linkedin':
      return <Linkedin className="h-4 w-4" />;
    default:
      return <Share className="h-4 w-4" />;
  }
};

const getPlatformColor = (platform: string): string => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return 'bg-[#1877F2] hover:bg-[#1877F2]/90';
    case 'twitter':
      return 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/90';
    case 'instagram':
      return 'bg-[#E4405F] hover:bg-[#E4405F]/90';
    case 'linkedin':
      return 'bg-[#0A66C2] hover:bg-[#0A66C2]/90';
    default:
      return 'bg-slate-600 hover:bg-slate-600/90';
  }
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    pad(date.getDate()) +
    "/" +
    pad(date.getMonth() + 1) +
    "/" +
    date.getFullYear().toString().slice(-2) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}

const Posts = () => {
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const postsPerPage = 5;
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = usePosts(page, postsPerPage);

  const posts = data?.posts || [];
  const totalPages = data ? Math.ceil(data.total / postsPerPage) : 1;

  // Recherche et filtre avancé
  const filteredPosts = posts.filter((post) => {
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.platforms.some((p: string) => p.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handlePostClick = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  if (isLoading) {
    // Skeleton loader pour une meilleure UX
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
  if (isError) {
    return <div className="text-center py-10 text-red-500">Erreur lors du chargement des posts.</div>;
  }

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Publications</h1>
          <p className="text-gray-500">Gérez vos posts sur les réseaux sociaux</p>
        </div>
        <Link to="/posts/new" aria-label="Créer un nouveau post">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            Nouveau Post
          </Button>
        </Link>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Recherche par titre, contenu ou plateforme..."
              className="border rounded-lg px-3 py-2 w-full pl-9 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>Tous</Button>
          <Button variant={statusFilter === "published" ? "default" : "outline"} onClick={() => setStatusFilter("published")}>Publié</Button>
          <Button variant={statusFilter === "draft" ? "default" : "outline"} onClick={() => setStatusFilter("draft")}>Brouillon</Button>
          <Button variant={statusFilter === "pending" ? "default" : "outline"} onClick={() => setStatusFilter("pending")}>En cours</Button>
          <Button variant={statusFilter === "scheduled" ? "default" : "outline"} onClick={() => setStatusFilter("scheduled")}>Programmé</Button>
          <Button variant={statusFilter === "failed" ? "default" : "outline"} onClick={() => setStatusFilter("failed")}>Échec</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sortedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <img
              src="https://illustrations.popsy.co/gray/empty-state.svg"
              alt="Aucun post"
              className="w-40 mb-4"
            />
            Aucun post trouvé.
          </div>
        ) : (
          sortedPosts.map((post) => (
            <Collapsible
              key={post.id}
              open={expandedPost === post.id}
              onOpenChange={() => handlePostClick(post.id)}
              className="border rounded-lg overflow-hidden bg-white animate-fade-in transition-all duration-200"
            >
              <CollapsibleTrigger className="w-full" aria-label={`Voir les détails du post ${post.title}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 px-4 hover:bg-gray-50 cursor-pointer text-left transition-all duration-200">
                  <div className="flex items-center">
                    {post.image && (
                      <div className="w-10 h-10 rounded-md overflow-hidden mr-4 flex-shrink-0">
                        <img
                          src={post.image}
                          alt={`Image du post : ${post.title}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-sm">{post.title}</h3>
                      <div className="flex items-center mt-0.5 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2 sm:mt-0 items-center">
                    {post.platforms.map((platform) => (
                      <span key={platform} title={platform}>
                        {getPlatformIcon(platform)}
                      </span>
                    ))}
                    {/* Statut du post */}
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : post.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : post.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : post.status === "pending"
                        ? "bg-blue-100 text-blue-700"
                        : post.status === "scheduled"
                        ? "bg-purple-100 text-purple-700"
                        : ""
                    }`}>
                      {post.status === "draft"
                        ? "Brouillon"
                        : post.status === "published"
                        ? "Publié"
                        : post.status === "failed"
                        ? "Échec"
                        : post.status === "pending"
                        ? "En cours"
                        : post.status === "scheduled"
                        ? "Programmé"
                        : ""}
                    </span>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="grid md:grid-cols-2 gap-4 p-4 border-t">
                  {/* Post Details (Left Side) */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Détails du post</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-gray-600 mt-2">{post.content}</p>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                            <span>Publié le {formatDate(post.date)}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-sm font-medium">
                              {post.status === "published"
                                ? "Publié sur :"
                                : post.status === "draft"
                                ? "Brouillon"
                                : post.status === "pending"
                                ? "En cours de publication"
                                : post.status === "failed"
                                ? "Échec de publication"
                                : post.status === "scheduled"
                                ? "Programmé"
                                : ""}
                            </span>
                            {post.status === "published" &&
                              post.platforms.map((platform: string) => (
                                <Badge
                                  key={platform}
                                  className={`flex items-center ${getPlatformColor(platform)}`}
                                  aria-label={`Publié sur ${platform}`}
                                >
                                  {getPlatformIcon(platform)}
                                  <span className="ml-1">{platform}</span>
                                </Badge>
                              ))}
                            {post.status === "scheduled" && (
                              <span className="ml-2 text-xs text-purple-700">
                                Programmée pour le {formatDate(post.date)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reactions (Right Side) */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Réactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className={cn("flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50")}>
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <ThumbsUp className="h-5 w-5 text-blue-500" aria-label="Nombre de J'aime" />
                          </div>
                          <span className="text-2xl font-bold">{post.reactions.likes}</span>
                          <span className="text-sm text-gray-500">J'aime</span>
                        </div>

                        <div className={cn("flex flex-col items-center justify-center p-4 rounded-lg bg-green-50")}>
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                            <MessageSquare className="h-5 w-5 text-green-500" aria-label="Nombre de commentaires" />
                          </div>
                          <span className="text-2xl font-bold">{post.reactions.comments}</span>
                          <span className="text-sm text-gray-500">Commentaires</span>
                        </div>

                        <div className={cn("flex flex-col items-center justify-center p-4 rounded-lg bg-purple-50")}>
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                            <Share className="h-5 w-5 text-purple-500" aria-label="Nombre de partages" />
                          </div>
                          <span className="text-2xl font-bold">{post.reactions.shares}</span>
                          <span className="text-sm text-gray-500">Partages</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Performance</h4>
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${Math.min(100, (post.reactions.likes + post.reactions.comments * 2 + post.reactions.shares * 3) / 5)}%`
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">0</span>
                          <span className="text-xs text-gray-500">Excellente</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            aria-label="Page précédente"
            className="px-3 py-1 rounded bg-secondary-light text-secondary disabled:opacity-50 transition-all duration-200"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Précédent
          </button>
          <span className="px-2 py-1 text-sm">{page} / {totalPages}</span>
          <button
            aria-label="Page suivante"
            className="px-3 py-1 rounded bg-secondary-light text-secondary disabled:opacity-50 transition-all duration-200"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;