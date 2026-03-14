const getBaseUrl = () => {
  const url =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_BASE_URL (or API_URL) must be set");
  return url.replace(/\/$/, "");
};

export type ApiOptions = RequestInit & {
  token?: string | null;
};

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, ...init } = options;
  const baseUrl = getBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const err = new Error(res.statusText || "API request failed");
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}
