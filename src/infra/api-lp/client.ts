import { CONFIG } from "@/shared/config/env";
import { postJson } from "@/infra/http/client";

export async function apiLpPost<T>(
  path: string,
  body: unknown,
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  return postJson<T>(`${CONFIG.apiLpBaseUrl}${path}`, body, headers);
}
