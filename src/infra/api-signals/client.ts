import { CONFIG } from "@/shared/config/env";
import { getJson, postJson } from "@/infra/http/client";

export async function apiSignalsGet<T>(path: string, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  return getJson<T>(`${CONFIG.apiSignalsBaseUrl}${path}`, headers);
}

export async function apiSignalsPost<T>(path: string, body: unknown, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  return postJson<T>(`${CONFIG.apiSignalsBaseUrl}${path}`, body, headers);
}
