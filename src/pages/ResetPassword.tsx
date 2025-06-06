import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";

const passwordComplexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const resetSchema = z.object({
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      passwordComplexity,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    ),
  confirmPassword: z.string().min(8, "Confirmez le mot de passe"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetFormData) => {
    if (!token) {
      toast.error("Lien de réinitialisation invalide ou expiré.");
      return;
    }
    setIsPending(true);
    try {
      const res = await fetch("https://backend-cm-assistance.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: data.password }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result?.message || "Mot de passe réinitialisé !");
        navigate("/auth");
      } else {
        toast.error(result?.message || "Erreur lors de la réinitialisation.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la réinitialisation.");
    }
    setIsPending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-light/30">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Réinitialiser le mot de passe</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner />
                  Réinitialisation...
                </div>
              ) : (
                "Réinitialiser"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;