import { listVaultUserEventsApi } from "@/core/infra/api/api-lp/vaultUserEvents";
import type { VaultUserEventsListResponse } from "@/core/domain/vault/events";

export async function listVaultUserEventsUseCase(params: {
  accessToken?: string;
  vault: string; // alias or address
  limit?: number;
  offset?: number;
}): Promise<VaultUserEventsListResponse> {
  return listVaultUserEventsApi(params);
}
