import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    message: string;
    priority: Priority;
  }>({
    subject: "",
    message: "",
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
    <div className="max-w-lg mx-auto mt-10">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/tickets">
          <Button variant="outline" size="sm" aria-label="Retour à la liste des tickets">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold text-secondary">Créer un ticket</h1>
      </div>
      <Card className="shadow-card border border-secondary-light">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-secondary">Nouveau ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-0" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label htmlFor="subject" className="w-28 text-sm text-secondary font-medium">
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
                  className="flex-1"
                />
              </div>
              <div className="flex items-start gap-4">
                <label htmlFor="message" className="w-28 text-sm text-secondary font-medium pt-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Décrivez votre problème ou question en détail..."
                  className="flex-1 resize-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="priority" className="w-28 text-sm text-secondary font-medium">
                  Priorité
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none bg-white"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
              <div className="flex justify-end mt-4">
                <Button type="submit" disabled={isPending}>
                  <Send className="h-4 w-4 mr-2" />
                  {isPending ? "Création..." : "Créer le ticket"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTickets;