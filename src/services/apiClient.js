const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");

function assertApiConfigured() {
  if (!apiBaseUrl) {
    throw new Error(
      "VITE_API_BASE_URL is missing. Set it to your deployed backend URL before building the frontend.",
    );
  }
}

export async function apiRequest(path, options = {}) {
  assertApiConfigured();

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
  assertApiConfigured();
  return `${apiBaseUrl}${path}`;
}
