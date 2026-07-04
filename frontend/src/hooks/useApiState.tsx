import { useState } from "react";

 function useApiState(initialLoading = true) {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  function startLoading() {
    setLoading(true);
    setError(null);
  }

  function stopLoading() {
    setLoading(false);
  }

  function setApiError(message: string) {
    setError(message);
    setLoading(false);
  }

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setApiError,
  };
}