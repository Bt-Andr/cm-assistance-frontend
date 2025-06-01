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
      return await apiClient("https://backend-cm-assistance.onrender.com/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
    },
  });