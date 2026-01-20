import { apiLpPost } from "@/infra/api-lp/client";
import type { CreateClientVaultResponse, CreateClientVaultRequest, RegisterClientVaultResponse } from "@/domain/vault/types";

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