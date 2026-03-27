import { persistVaultWithdrawEventApi } from "@/core/infra/api/api-lp/vaultUserEvents";
import type { PersistWithdrawEventRequest, VaultUserEvent } from "@/core/domain/vault/events";

export async function persistVaultWithdrawEventUseCase(params: {
  accessToken?: string;
  vault: string; // alias or address
  payload: PersistWithdrawEventRequest;
}): Promise<VaultUserEvent> {
  return persistVaultWithdrawEventApi(params);
}
