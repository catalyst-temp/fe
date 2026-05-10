const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

console.log(`[API Client] Env: ${import.meta.env.VITE_APP_ENV}, Base URL: ${apiBaseUrl}`);


export async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const error = new Error(payload.message || `API request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export function getApiUrl(path) {
  return `${apiBaseUrl}${path}`;
}
