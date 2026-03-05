import { persistVaultDepositEventApi } from "@/core/infra/api/api-lp/vaultUserEvents";
import type { PersistDepositEventRequest, VaultUserEvent } from "@/core/domain/vault/events";

export async function persistVaultDepositEventUseCase(params: {
  accessToken?: string;
  vault: string; // alias or address
  payload: PersistDepositEventRequest;
}): Promise<VaultUserEvent> {
  return persistVaultDepositEventApi(params);
}
