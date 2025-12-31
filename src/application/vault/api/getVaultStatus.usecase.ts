import type { VaultStatus } from "@/domain/vault/status";
import { apiLpGet } from "@/infra/api-lp/client";

export async function getVaultStatus(vaultAddress: string): Promise<VaultStatus> {
  return apiLpGet<VaultStatus>(`/vaults/${vaultAddress}/status`);
}
