import type { VaultStatus } from "@/core/domain/vault/status";
import { apiLpGet } from "@/core/infra/api/api-lp/client";

export async function getVaultStatus(vaultAddress: string): Promise<VaultStatus> {
  return apiLpGet<VaultStatus>(`/vaults/${vaultAddress}/status`);
}
