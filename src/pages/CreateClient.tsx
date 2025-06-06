import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateClient, ClientData } from "@/hooks/useCreateClient";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const clientSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).default("Active"),
  socialNetworks: z
    .array(
      z.object({
        type: z.string().min(2, "Plateforme requise"),
        handle: z.string().min(2, "Identifiant requis"),
        status: z.enum(["Active", "Inactive"]).default("Active"),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof clientSchema>;

const CreateClient = () => {
  const navigate = useNavigate();
  const { mutate: createClient, isPending } = useCreateClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
      socialNetworks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialNetworks",
  });

  const onSubmit = (data: FormValues) => {
    const payload: ClientData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      status: data.status,
      socialNetworks: data.socialNetworks?.map((sn) => ({
        type: sn.type,
        handle: sn.handle,
        status: sn.status,
      })) || [],
    };

    createClient(payload, {
      onSuccess: () => {
        toast.success("Client ajouté avec succès !");
        navigate("/clients");
      },
      onError: () => {
        toast.error("Erreur lors de l'ajout du client.");
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/clients">
          <Button variant="outline" size="sm" aria-label="Retour à la liste des clients">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-secondary">Ajouter un client</h1>
      </div>
      <Card className="shadow-card border border-secondary-light">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-secondary">Nouveau client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-secondary font-medium">
                  Nom <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("name")}
                  placeholder="Nom du client"
                  className="flex-1"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs ml-32">{errors.name.message}</p>}

              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-secondary font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("email")}
                  placeholder="Email"
                  className="flex-1"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs ml-32">{errors.email.message}</p>}

              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-secondary font-medium">Téléphone</label>
                <Input
                  {...register("phone")}
                  placeholder="Téléphone"
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-secondary font-medium">Adresse</label>
                <Input
                  {...register("address")}
                  placeholder="Adresse"
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-32 text-sm text-secondary font-medium">Statut</label>
                <select
                  {...register("status")}
                  className="flex-1 px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none bg-white"
                >
                  <option value="Active">Actif</option>
                  <option value="Inactive">Inactif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-secondary font-medium mb-2">Réseaux sociaux</label>
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 mb-2 items-end">
                    <Input
                      {...register(`socialNetworks.${idx}.type` as const)}
                      placeholder="Plateforme (ex: Facebook)"
                      className="w-40"
                    />
                    <Input
                      {...register(`socialNetworks.${idx}.handle` as const)}
                      placeholder="Identifiant"
                      className="w-40"
                    />
                    <select
                      {...register(`socialNetworks.${idx}.status` as const)}
                      className="px-2 py-1 rounded-md border border-secondary-light bg-white"
                      defaultValue="Active"
                    >
                      <option value="Active">Actif</option>
                      <option value="Inactive">Inactif</option>
                    </select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => remove(idx)}
                      aria-label="Supprimer ce réseau"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {errors.socialNetworks && typeof errors.socialNetworks === "object" && (
                  <p className="text-red-500 text-xs">
                    {/* Affiche la première erreur trouvée */}
                    {Array.isArray(errors.socialNetworks) &&
                      errors.socialNetworks.find((sn) => sn?.type?.message || sn?.handle?.message)?.type?.message}
                    {Array.isArray(errors.socialNetworks) &&
                      errors.socialNetworks.find((sn) => sn?.type?.message || sn?.handle?.message)?.handle?.message}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ type: "", handle: "", status: "Active" })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un réseau social
                </Button>
              </div>

              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Ajout en cours..." : "Ajouter le client"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateClient;