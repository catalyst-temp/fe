import { useEffect, useState } from "react";
import { apiRequest, getApiUrl } from "./apiClient.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refreshUser() {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/auth/me");
      setUser(data.user);
    } catch (requestError) {
      setError(requestError.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function login() {
    window.location.href = getApiUrl("/api/auth/google");
  }

  async function logout() {
    await apiRequest("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return { user, loading, error, isAuthenticated: Boolean(user), login, logout, refreshUser };
}
