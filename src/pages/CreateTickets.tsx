import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/ui/spinner";
import { useCreateTickets } from "@/hooks/useCreateTickets";

type Priority = "low" | "medium" | "high";

const CreateTickets = () => {
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useUser();
  const { mutate: createTicket, isPending } = useCreateTickets();

  const [form, setForm] = useState<{
    subject: string;
    description: string;
    priority: Priority;
  }>({
    subject: "",
    description: "",
    priority: "medium",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "priority" ? (value as Priority) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket(form, {
      onSuccess: () => {
        toast.success("Ticket créé avec succès !");
        navigate("/tickets");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Erreur lors de la création du ticket.");
      },
    });
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Button
        variant="ghost"
        className="mb-4 flex items-center gap-2"
        onClick={() => navigate("/tickets")}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux tickets
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Créer un ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-secondary mb-1">
                Sujet <span className="text-red-500">*</span>
              </label>
              <Input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="Ex : Problème de connexion"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Décrivez votre problème ou question en détail..."
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-secondary mb-1">
                Priorité
              </label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                <Send className="h-4 w-4 mr-2" />
                {isPending ? "Création..." : "Créer le ticket"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTickets;