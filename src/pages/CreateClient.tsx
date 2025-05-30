import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateClient, ClientData, SocialNetwork } from "@/hooks/useCreateClient";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
    // On force la structure attendue par ClientData
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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      {/* Bouton retour */}
      <div className="mb-6 flex items-center gap-2">
        <Link
          to="/clients"
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          Retour à la liste des clients
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Ajouter un client</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nom *</label>
          <input
            {...register("name")}
            className="w-full border rounded px-3 py-2"
            placeholder="Nom du client"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            {...register("email")}
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            {...register("phone")}
            className="w-full border rounded px-3 py-2"
            placeholder="Téléphone"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Adresse</label>
          <input
            {...register("address")}
            className="w-full border rounded px-3 py-2"
            placeholder="Adresse"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Statut</label>
          <select {...register("status")} className="w-full border rounded px-3 py-2">
            <option value="Active">Actif</option>
            <option value="Inactive">Inactif</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Réseaux sociaux</label>
          {fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 mb-2 items-end">
              <div>
                <input
                  {...register(`socialNetworks.${idx}.type` as const)}
                  className="border rounded px-2 py-1"
                  placeholder="Plateforme (ex: Facebook)"
                />
                {errors.socialNetworks?.[idx]?.type &&
                  typeof errors.socialNetworks[idx]?.type === "object" &&
                  "message" in errors.socialNetworks[idx]?.type && (
                    <p className="text-red-500 text-xs">
                      {errors.socialNetworks[idx]?.type.message}
                    </p>
                  )}
              </div>
              <div>
                <input
                  {...register(`socialNetworks.${idx}.handle` as const)}
                  className="border rounded px-2 py-1"
                  placeholder="Identifiant"
                />
                {errors.socialNetworks?.[idx]?.handle &&
                  typeof errors.socialNetworks[idx]?.handle === "object" &&
                  "message" in errors.socialNetworks[idx]?.handle && (
                    <p className="text-red-500 text-xs">
                      {errors.socialNetworks[idx]?.handle.message}
                    </p>
                  )}
              </div>
              <div>
                <select
                  {...register(`socialNetworks.${idx}.status` as const)}
                  className="border rounded px-2 py-1"
                  defaultValue="Active"
                >
                  <option value="Active">Actif</option>
                  <option value="Inactive">Inactif</option>
                </select>
              </div>
              <button
                type="button"
                className="text-red-500 ml-2"
                onClick={() => remove(idx)}
                title="Supprimer"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-3 py-1 bg-primary text-white rounded"
            onClick={() => append({ type: "", handle: "", status: "Active" })}
          >
            Ajouter un réseau social
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded font-semibold"
          disabled={isPending}
        >
          {isPending ? "Ajout en cours..." : "Ajouter le client"}
        </button>
      </form>
    </div>
  );
};

export default CreateClient;