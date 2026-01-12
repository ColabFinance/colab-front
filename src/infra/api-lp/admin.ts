import { apiLpGet, apiLpPost } from "@/infra/api-lp/client";

export type AdminFactoryResult = {
  ok: boolean;
  message: string;
  data?: unknown;
};

/**
 * NOTE:
 * These endpoints are placeholders for api-lp.
 * The real rules (status gating, "only one active", etc.) MUST be enforced server-side in api-lp.
 */
export async function apiLpAdminCreateStrategyFactory(accessToken: string): Promise<AdminFactoryResult> {
  return apiLpPost<AdminFactoryResult>("/admin/strategy-factory", {}, accessToken);
}

export async function apiLpAdminCreateVaultFactory(accessToken: string): Promise<AdminFactoryResult> {
  return apiLpPost<AdminFactoryResult>("/admin/vault-factory", {}, accessToken);
}

export async function apiLpAdminListOwners(accessToken: string): Promise<any[]> {
  return apiLpGet<any[]>("/admin/owners", accessToken);
}

export async function apiLpAdminListUsers(accessToken: string): Promise<any[]> {
  return apiLpGet<any[]>("/admin/users", accessToken);
}
