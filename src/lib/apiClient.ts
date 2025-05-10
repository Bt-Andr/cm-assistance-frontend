export const apiClient = async (endpoint: string, options : RequestInit = {}) => {
    const token = localStorage.getItem("cm_token");
  
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || "Request failed");
    }
  
    return res.json();
  };