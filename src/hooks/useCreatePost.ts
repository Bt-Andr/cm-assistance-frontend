import { apiClient } from "@/lib/apiClient";

export const createPost = async (postData) => {
  return await apiClient("/api/posts", {
    method: "POST",
    body: JSON.stringify(postData),
  });
};