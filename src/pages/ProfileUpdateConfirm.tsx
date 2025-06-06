import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const ProfileUpdateConfirm = () => {
  const [status, setStatus] = useState<"pending" | "success" | "error" | "expired">("pending");
  const [message, setMessage] = useState("Confirmation en cours...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Lien de confirmation invalide.");
      return;
    }

    fetch(`https://backend-cm-assistance.onrender.com/api/profile/confirm-update?token=${token}`)
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          setMessage("Votre modification a bien été confirmée et appliquée !");
          localStorage.removeItem("profile_update_pending");
        } else if (res.status === 400) {
          const text = await res.text();
          setStatus("expired");
          setMessage(text || "Lien expiré.");
          localStorage.removeItem("profile_update_pending");
        } else {
          const text = await res.text();
          setStatus("error");
          setMessage(text || "Erreur lors de la confirmation.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Erreur réseau lors de la confirmation.");
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-light">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center max-w-md w-full">
        {status === "pending" && (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-secondary mb-2">Confirmation en cours…</h2>
            <p className="text-secondary/70">{message}</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-green-700 mb-2">Modification confirmée !</h2>
            <p className="text-secondary/70">{message}</p>
          </>
        )}
        {status === "expired" && (
          <>
            <XCircle className="w-12 h-12 text-yellow-600 mb-4" />
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">Lien expiré</h2>
            <p className="text-secondary/70">{message || "Ce lien de confirmation n'est plus valide. Veuillez refaire une demande de modification."}</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-600 mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Erreur</h2>
            <p className="text-secondary/70">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileUpdateConfirm;