import { apiClient } from "@/lib/apiClient";

export const fetchSettings = async () => {
  return await apiClient("/api/settings");
};

export const updateSettings = async (settingsData) => {
  return await apiClient("/api/settings", {
    method: "PUT",
    body: JSON.stringify(settingsData),
  });
};