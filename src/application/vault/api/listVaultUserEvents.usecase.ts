import { listVaultUserEventsApi } from "@/infra/api-lp/vaultUserEvents";
import type { VaultUserEventsListResponse } from "@/domain/vault/events";

export async function listVaultUserEventsUseCase(params: {
  accessToken?: string;
  vault: string; // alias or address
  limit?: number;
  offset?: number;
}): Promise<VaultUserEventsListResponse> {
  return listVaultUserEventsApi(params);
}
