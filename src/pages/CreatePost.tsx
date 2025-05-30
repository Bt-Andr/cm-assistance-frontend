import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Image, FileText, Save, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreatePost } from "@/hooks/useCreatePost"; // <-- Ajout du hook
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { X } from "lucide-react";

const PLATFORMS = [
  { name: "Facebook", color: "bg-[#1877F2] text-white border-0 hover:bg-[#1877F2]/90" },
  { name: "Twitter", color: "bg-[#1DA1F2] text-white border-0 hover:bg-[#1DA1F2]/90" },
  { name: "Instagram", color: "bg-[#E4405F] text-white border-0 hover:bg-[#E4405F]/90" },
  { name: "LinkedIn", color: "bg-[#0A66C2] text-white border-0 hover:bg-[#0A66C2]/90" },
];

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTab, setSelectedTab] = useState('create');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Utilisation du hook useCreatePost
  const { mutate: createPost, isPending, error: mutationError } = useCreatePost();

  const handlePlatformToggle = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const [image, setImage] = useState<string>("");

  const handleSubmit = (action: "publish" | "draft" | "schedule") => {
    setError(null);

    // Validation simple
    if (!title.trim() || !content.trim()) {
      setError("Le titre et le contenu sont obligatoires.");
      return;
    }

    // Champ date : toujours envoyé (programmée ou immédiate)
    const scheduledDate = date && time ? `${date}T${time}` : new Date().toISOString();

    // Champ status : "published" ou "draft" selon le bouton
    createPost(
      {
        title,
        content,
        platforms,
        date: scheduledDate,
        status: action,
        image,
      },
      {
        onSuccess: () => navigate("/posts"),
        onError: () => setError("Erreur lors de la création du post."),
      }
    );
  };

  // Drag & drop handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setImageError(null);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setShowImageDialog(false);
      };
      reader.readAsDataURL(file);
    } else {
      setImageError("Le fichier doit être une image.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setShowImageDialog(false);
      };
      reader.readAsDataURL(file);
    } else {
      setImageError("Le fichier doit être une image.");
    }
  };

  const handleUrlValidate = () => {
    if (!imageUrlInput.trim()) {
      setImageError("Veuillez entrer une URL.");
      return;
    }
    setImage(imageUrlInput.trim());
    setShowImageDialog(false);
    setImageUrlInput("");
    setImageError(null);
  };

  function isScheduled(date: string, time: string) {
    const now = new Date();

    // Cas : heure future sans date (on suppose aujourd'hui)
    if (!date && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const scheduled = new Date();
      scheduled.setHours(hours, minutes, 0, 0);
      return scheduled > now;
    }

    // Cas : date seule ou date+heure
    if (date) {
      if (time) {
        return new Date(`${date}T${time}`) > now;
      }
      // Si pas d'heure, on considère la fin de la journée
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      return endOfDay > now;
    }

    return false;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/posts">
            <Button variant="outline" size="sm" aria-label="Retour à la liste des posts">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-secondary">Create New Post</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            aria-label="Enregistrer comme brouillon"
            onClick={() => handleSubmit("draft")}
            disabled={isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Save as Draft
          </Button>
          <Button
            aria-label={isScheduled(date, time) ? "Programmer" : "Publier maintenant"}
            onClick={() => isScheduled(date, time) ? handleSubmit("schedule") : handleSubmit("publish")}
            disabled={isPending}
          >
            {isScheduled(date, time) ? "Programmer" : "Publier maintenant"}
          </Button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}
      {mutationError && <div className="text-red-600 mb-2">{mutationError.message}</div>}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="bg-white rounded-lg shadow-card"
          >
            <div className="border-b border-secondary-light">
              <TabsList className="bg-transparent p-0 h-12">
                <TabsTrigger
                  value="create"
                  className="flex-1 h-full border-r border-secondary-light data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none"
                  aria-label="Créer un post"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Create
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex-1 h-full data-[state=active]:border-b-2 data-[state=active]:border-b-primary rounded-none"
                  aria-label="Aperçu du post"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="create" className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-secondary mb-1">
                    Post Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-secondary mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none min-h-[300px] resize-y"
                    placeholder="Write your post content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Ajouter une image"
                    type="button"
                    onClick={() => setShowImageDialog(true)}
                  >
                    <Image className="h-4 w-4 mr-1" />
                    {image ? "Changer l'image" : "Add Image"}
                  </Button>
                  <Button variant="outline" size="sm" aria-label="Ajouter des tags">
                    # Add Tags
                  </Button>
                  {image && (
                    <div className="flex items-center gap-2 ml-2">
                      <img src={image} alt="Aperçu" className="h-10 w-10 object-cover rounded" />
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Supprimer l'image"
                        onClick={() => setImage("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="p-4">
              {title || content ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-secondary">{title || "Untitled Post"}</h2>
                  <div className="prose">
                    {content ? (
                      <p className="text-secondary">{content}</p>
                    ) : (
                      <p className="text-secondary/50 italic">No content yet</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="font-medium text-secondary">Platforms: </span>
                    {platforms.length > 0 ? platforms.join(", ") : <span className="text-secondary/50">Aucune sélectionnée</span>}
                  </div>
                  <div className="mt-2">
                    <span className="font-medium text-secondary">Date de publication: </span>
                    {(date && time) ? `${date} ${time}` : <span className="text-secondary/50">Non programmée</span>}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="h-16 w-16 text-secondary/30 mb-4" />
                  <h3 className="text-lg font-medium text-secondary">Nothing to preview yet</h3>
                  <p className="text-secondary/70 mt-1">Add a title and content to see the preview</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar */}
        <div className="lg:w-80">
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <h3 className="font-medium text-secondary mb-4">Publishing Options</h3>
                <div className="space-y-4">
                  <div>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                      aria-label="Programmer la publication"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Post
                    </Button>
                  </div>

                  {isScheduleOpen && (
                    <div className="p-3 bg-secondary-light rounded-md space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1">
                          Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="w-full px-3 py-2 rounded-md border border-secondary-light bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                          />
                          <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1">
                          Time
                        </label>
                        <div className="relative">
                          <input
                            type="time"
                            className="w-full px-3 py-2 rounded-md border border-secondary-light bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                          />
                          <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary/50 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-secondary">
                      Platforms
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((platform) => (
                        <Button
                          key={platform.name}
                          variant="outline"
                          size="sm"
                          className={
                            platforms.includes(platform.name)
                              ? `${platform.color} ring-2 ring-primary`
                              : "bg-white text-secondary border border-secondary-light"
                          }
                          onClick={() => handlePlatformToggle(platform.name)}
                          aria-pressed={platforms.includes(platform.name)}
                          type="button"
                        >
                          {platform.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium text-secondary mb-2">Post Guidelines</h3>
                <ul className="text-sm space-y-2 text-secondary/70">
                  <li>• Keep titles under 60 characters</li>
                  <li>• Include at least one relevant image</li>
                  <li>• Use 2-5 hashtags maximum</li>
                  <li>• Best posting times: 9-11 AM, 1-3 PM</li>
                </ul>
              </div>

              <div className="p-4 bg-secondary-light/50">
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&q=80"
                  alt="Create post illustration"
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
      {/* Fenêtre flottante pour l'ajout d'image */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une image</DialogTitle>
          </DialogHeader>
          <div
            className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center mb-4 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <p className="mb-2">Glissez-déposez une image ici</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer text-primary underline">
              Ou choisissez une image sur votre ordinateur
            </label>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Ou collez une URL d'image"
              className="flex-1 px-2 py-1 border rounded"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
            />
            <Button size="sm" onClick={handleUrlValidate}>
              Valider
            </Button>
          </div>
          {imageError && <div className="text-red-500 text-sm">{imageError}</div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;