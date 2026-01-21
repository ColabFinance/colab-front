import { apiLpGet, apiLpPost } from "@/infra/api-lp/client";
import type { CreateClientVaultResponse, CreateClientVaultRequest, RegisterClientVaultResponse } from "@/domain/vault/types";

export type VaultRegistryRecord = {
  id?: string;

  dex?: string;
  address: string;
  alias: string;
  is_active?: boolean;

  chain?: string;
  owner?: string;
  par_token?: string;

  name?: string;
  description?: string;
  strategy_id?: number;

  config?: Record<string, any>;

  created_at?: number;
  created_at_iso?: string;
  updated_at?: number;
  updated_at_iso?: string;
};

export async function createClientVaultApi(params: {
  payload: CreateClientVaultRequest;
  accessToken?: string;
}): Promise<CreateClientVaultResponse> {
  return apiLpPost<CreateClientVaultResponse>(
    "/vaults/create-client-vault",
    params.payload,
    params.accessToken,
  );
}

export async function registerClientVaultApi(params: {
  payload: any;
  accessToken: string;
}): Promise<RegisterClientVaultResponse> {
  return apiLpPost(
    "/vaults/register-client-vault",
    params.payload,
    params.accessToken
  );
}

export async function apiLpListVaultsByOwner(
  accessToken: string,
  query: {
    owner: string;
    chain?: string;
    dex?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ ok: boolean; data?: VaultRegistryRecord[]; message?: string }> {
  const qs =
    `owner=${encodeURIComponent(query.owner)}` +
    (query.chain ? `&chain=${encodeURIComponent(query.chain)}` : "") +
    (query.dex ? `&dex=${encodeURIComponent(query.dex)}` : "") +
    (typeof query.limit === "number" ? `&limit=${encodeURIComponent(String(query.limit))}` : "") +
    (typeof query.offset === "number" ? `&offset=${encodeURIComponent(String(query.offset))}` : "");

  return apiLpGet(`/vaults/by-owner?${qs}`, accessToken);
}
