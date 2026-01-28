import { persistVaultDepositEventApi } from "@/infra/api-lp/vaultUserEvents";
import type { PersistDepositEventRequest, VaultUserEvent } from "@/domain/vault/events";

export async function persistVaultDepositEventUseCase(params: {
  accessToken?: string;
  vault: string; // alias or address
  payload: PersistDepositEventRequest;
}): Promise<VaultUserEvent> {
  return persistVaultDepositEventApi(params);
}
