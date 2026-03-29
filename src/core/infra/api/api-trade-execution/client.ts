import { CONFIG } from "@/shared/config/env";
import { getJson, postJson } from "@/core/infra/http/client";

export async function apiTradeExecutionGet<T>(path: string, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  return getJson<T>(`${CONFIG.apiTradeExecutionBaseUrl}${path}`, headers);
}

export async function apiTradeExecutionPost<T>(
  path: string,
  body: unknown,
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  return postJson<T>(`${CONFIG.apiTradeExecutionBaseUrl}${path}`, body, headers);
}