import { CONFIG } from "@/shared/config/env";
import { getJson, postJson } from "@/infra/http/client";

export async function apiMarketDataGet<T>(
  path: string,
  accessToken?: string,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  return getJson<T>(`${CONFIG.apiMarketDataUrl}${path}`, headers);
}

export async function apiMarketDataPost<T>(
  path: string,
  body: unknown,
  accessToken?: string,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  return postJson<T>(`${CONFIG.apiMarketDataUrl}${path}`, body, headers);
}
