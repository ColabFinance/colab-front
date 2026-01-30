import type { CreateClientVaultRequest, CreateClientVaultResponse } from "@/domain/vault/types";
import { createClientVaultApi } from "@/infra/api-lp/vault";

export async function createVault(params: {
  payload: CreateClientVaultRequest;
  accessToken?: string;
}): Promise<CreateClientVaultResponse> {
  return createClientVaultApi({
    payload: params.payload,
    accessToken: params.accessToken,
  });
}
