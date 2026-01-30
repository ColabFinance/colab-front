import { registerClientVaultApi } from "@/infra/api-lp/vault";
import type { RegisterClientVaultRequest, RegisterClientVaultResponse } from "@/domain/vault/types";

export async function registerClientVault(params: {
  payload: RegisterClientVaultRequest;
  accessToken: string;
}): Promise<RegisterClientVaultResponse> {
  return registerClientVaultApi(params);
}
