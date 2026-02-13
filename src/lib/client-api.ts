"use client";

let cachedCsrfToken: string | null = null;
let refreshInFlight: Promise<boolean> | null = null;

async function fetchCsrfToken() {
  const response = await fetch("/api/auth/csrf", {
    method: "GET",
    credentials: "include"
  });
  const json = await response.json().catch(() => null);
  const token = (json?.data?.csrfToken as string | undefined) || "";
  cachedCsrfToken = token || null;
  return token;
}

export async function getCsrfToken(options?: { forceRefresh?: boolean }) {
  if (!options?.forceRefresh && cachedCsrfToken) {
    return cachedCsrfToken;
  }
  return fetchCsrfToken();
}

async function refreshSessionInternal() {
  let csrfToken = await getCsrfToken();
  if (!csrfToken) return false;

  let response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "x-csrf-token": csrfToken },
    credentials: "include"
  });

  // If csrf cookie/token drifted, renew once and retry refresh.
  if (response.status === 403) {
    csrfToken = await getCsrfToken({ forceRefresh: true });
    if (!csrfToken) return false;
    response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      credentials: "include"
    });
  }

  return response.ok;
}

export async function refreshAuthSession() {
  if (!refreshInFlight) {
    refreshInFlight = refreshSessionInternal().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

export async function fetchWithAuthRetry(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const response = await fetch(input, {
    ...init,
    credentials: "include"
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshed = await refreshAuthSession();
  if (!refreshed) {
    return response;
  }

  return fetch(input, {
    ...init,
    credentials: "include"
  });
}

type MeResponse = {
  data?: {
    user?: {
      role?: string;
    } | null;
  };
};

export async function ensureAdminSession() {
  const me = async () => {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store"
    });
    const json = (await response.json().catch(() => null)) as MeResponse | null;
    return json?.data?.user?.role === "ADMIN";
  };

  if (await me()) {
    return true;
  }

  const refreshed = await refreshAuthSession();
  if (!refreshed) {
    return false;
  }

  return me();
}

export async function apiFetch<T>(url: string, init?: RequestInit) {
  const response = await fetchWithAuthRetry(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Request failed");
  }
  return result.data as T;
}
