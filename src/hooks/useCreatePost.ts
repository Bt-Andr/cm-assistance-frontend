import { apiClient } from "@/lib/api";

export const createPost = async (postData) => {
  return await apiClient("/api/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
};