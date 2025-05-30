import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type EditPostData = {
  id: string;
  title: string;
  content: string;
  image?: string;
};

export const useEditPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: EditPostData) => {
      const res = await apiClient(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          image: post.image,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la modification du post");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalide le cache des posts pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};