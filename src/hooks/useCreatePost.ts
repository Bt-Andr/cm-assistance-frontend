import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type PlatformStatus = {
  platform: string;
  status: "pending" | "published" | "failed";
  errorMessage?: string;
};

type PostData = {
  title: string;
  content: string;
  platforms: string[];
  date: string;
  status: string;
  image?: string;
  scheduledAt?: string;
  platformStatus?: PlatformStatus[];
  errorMessage?: string;
};

export const useCreatePost = () =>
  useMutation({
    mutationFn: async (postData: PostData) => {
      const res = await apiClient("https://backend-cm-assistance.onrender.com/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const data = await res.json?.() ?? res;
      if (!res.ok) {
        throw new Error(data?.message || "Erreur lors de la création du post");
      }
      return data;
    },
  });