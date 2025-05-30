import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

type UpdateProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position: string;
  avatar: string;
  phone: string; // Ajout du champ phone
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UpdateProfileData) => {
      // Validation simple côté frontend
      if (!profile.email || !profile.firstName || !profile.lastName) {
        throw new Error("Veuillez remplir tous les champs obligatoires.");
      }
      const res = await apiClient("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erreur lors de la mise à jour du profil");
      }
      return res.json();
    },
    onSuccess: (data) => {
      // Met à jour le cache utilisateur pour refléter immédiatement les changements
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};