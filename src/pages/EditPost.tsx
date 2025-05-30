import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import { useUser } from "@/context/UserContext";
import { useEditPost } from "@/hooks/useEditPost";

// Remplace ce hook par ton vrai hook de récupération d'un post
const usePost = (postId: string | undefined) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    setIsLoading(true);
    // À remplacer par un vrai appel API
    fetch(`/api/posts/${postId}`)
      .then(res => res.json())
      .then(post => {
        setData(post);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [postId]);

  return { data, isLoading, error: null };
};

const EditPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const { data: post, isLoading } = usePost(postId);
  const { mutate: updatePost, isPending } = useEditPost();

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "",
        content: post.content || "",
        image: post.image || "",
      });
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePost(
      { ...form, id: postId! },
      {
        onSuccess: () => {
          toast.success("Post modifié avec succès !");
          navigate("/posts");
        },
        onError: (error: any) => {
          toast.error(error?.message || "Erreur lors de la modification du post.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate("/posts")}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux posts
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Modifier le post</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-secondary mb-1">
                Titre <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Titre du post"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-secondary mb-1">
                Contenu <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Contenu du post..."
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-secondary mb-1">
                Image (URL)
              </label>
              <Input
                id="image"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Aperçu"
                  className="mt-2 rounded w-full max-h-40 object-cover border"
                />
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                <Save className="h-4 w-4 mr-2" />
                {isPending ? "Modification..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPost;