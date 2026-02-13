"use client";

let cachedCsrfToken: string | null = null;

export async function getCsrfToken() {
  if (cachedCsrfToken) return cachedCsrfToken;
  const response = await fetch("/api/auth/csrf", {
    method: "GET",
    credentials: "include"
  });
  const json = await response.json();
  cachedCsrfToken = json.data?.csrfToken as string;
  return cachedCsrfToken || "";
}

export async function apiFetch<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    },
    credentials: "include"
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Request failed");
  }
  return result.data as T;
}
