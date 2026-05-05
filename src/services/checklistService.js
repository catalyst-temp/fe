import { useEffect, useMemo, useState } from "react";
import { checklistPhases } from "../data/checklist.js";
import { apiRequest } from "./apiClient.js";

export function useChecklistProgress(enabled = true) {
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadProgress() {
    if (!enabled) {
      setCompletedIds([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/checklist");
      setCompletedIds(data.completedIds || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function persist(nextIds) {
    if (!enabled) return;

    const previousIds = completedIds;
    setCompletedIds(nextIds);
    setError("");
    try {
      const data = await apiRequest("/api/checklist", {
        method: "PUT",
        body: JSON.stringify({ completedIds: nextIds }),
      });
      setCompletedIds(data.completedIds || []);
    } catch (requestError) {
      setCompletedIds(previousIds);
      setError(requestError.message);
    }
  }

  function toggleItem(itemId) {
    if (!enabled) return;

    const nextIds = completedIds.includes(itemId)
      ? completedIds.filter((id) => id !== itemId)
      : [...completedIds, itemId];
    persist(nextIds);
  }

  async function reset() {
    if (!enabled) return;

    const previousIds = completedIds;
    setCompletedIds([]);
    setError("");
    try {
      const data = await apiRequest("/api/checklist", { method: "DELETE" });
      setCompletedIds(data.completedIds || []);
    } catch (requestError) {
      setCompletedIds(previousIds);
      setError(requestError.message);
    }
  }

  useEffect(() => {
    loadProgress();
  }, [enabled]);

  const progress = useMemo(() => {
    const total = checklistPhases.reduce((sum, phase) => sum + phase.items.length, 0);
    const done = completedIds.length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [completedIds]);

  return {
    phases: checklistPhases,
    completedIds,
    progress,
    loading,
    error,
    toggleItem,
    reset,
  };
}
