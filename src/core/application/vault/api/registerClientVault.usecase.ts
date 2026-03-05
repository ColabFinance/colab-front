import { registerClientVaultApi } from "@/core/infra/api/api-lp/vault";
import type { RegisterClientVaultRequest, RegisterClientVaultResponse } from "@/core/domain/vault/types";

export async function registerClientVault(params: {
  payload: RegisterClientVaultRequest;
  accessToken: string;
}): Promise<RegisterClientVaultResponse> {
  return registerClientVaultApi(params);
}
