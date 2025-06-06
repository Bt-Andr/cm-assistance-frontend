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
      return await apiClient(`https://backend-cm-assistance.onrender.com/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          image: post.image,
        }),
      });
    },
    onSuccess: () => {
      // Invalide le cache des posts pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};