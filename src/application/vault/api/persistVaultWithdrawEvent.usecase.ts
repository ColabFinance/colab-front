import { persistVaultWithdrawEventApi } from "@/infra/api-lp/vaultUserEvents";
import type { PersistWithdrawEventRequest, VaultUserEvent } from "@/domain/vault/events";

export async function persistVaultWithdrawEventUseCase(params: {
  accessToken?: string;
  vault: string; // alias or address
  payload: PersistWithdrawEventRequest;
}): Promise<VaultUserEvent> {
  return persistVaultWithdrawEventApi(params);
}
