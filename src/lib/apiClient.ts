export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("cm_token");

  // Gestion du Content-Type pour FormData
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Authorization: token ? `Bearer ${token}` : "",
    ...(options.headers || {}),
  };

  // Timeout de 15 secondes
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      // Ici tu pourrais déclencher une notification globale ou logger
      throw new Error(error.error || "Request failed");
    }

    return res.json();
  } catch (err) {
    // Ici tu pourrais logger l’erreur ou la traiter globalement
    throw err;
  }
};