const DEFAULT_BASE_URL = "http://localhost:5000";

export const TOKEN_KEY = "auth_token";
const BASE_URL_KEY = "api_base_url";

export function getBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_BASE_URL;
  const stored = localStorage.getItem(BASE_URL_KEY);
  return (stored || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

export function setBaseUrl(url: string) {
  localStorage.setItem(BASE_URL_KEY, url.replace(/\/+$/, ""));
}

export function clearBaseUrl() {
  localStorage.removeItem(BASE_URL_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

type Options = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

export async function api<T = unknown>(path: string, opts: Options = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${getBaseUrl()}${cleanPath}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const d = data as { msg?: string; message?: string } | null;
    const msg = d?.msg || d?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

type JwtPayload = { id: string; role: string; iat?: number; exp?: number };

export function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}