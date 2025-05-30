import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type PlatformStatus = {
  platform: string;
  status: "pending" | "published" | "failed";
  errorMessage?: string;
};

type Post = {
  id: string;
  title: string;
  content: string;
  date: string;
  scheduledAt?: string;
  image?: string;
  platforms: string[];
  reactions: {
    likes: number;
    comments: number;
    shares: number;
  };
  status: "draft" | "published" | "failed" | "pending" | "scheduled";
  platformStatus?: PlatformStatus[];
  errorMessage?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
};

type PostsResponse = {
  posts: Post[];
  total: number;
};

export const usePosts = (page: number, limit: number) =>
  useQuery<PostsResponse>({
    queryKey: ["posts", page, limit],
    queryFn: async () => {
      const res = await apiClient(
        `https://backend-cm-assistance.onrender.com/api/posts?page=${page}&limit=${limit}`
      );
      // Si apiClient retourne un objet Response, il faut parser le JSON
      if (typeof res.json === "function") {
        return res.json();
      }
      return res;
    },
    // keepPreviousData: true,
  });