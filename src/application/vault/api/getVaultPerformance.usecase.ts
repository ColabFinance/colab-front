import { getVaultPerformanceApi } from "@/infra/api-lp/vaultPerformance";
import type { VaultPerformanceResponse } from "@/domain/vault/performance";

export async function getVaultPerformanceUseCase(params: {
  accessToken?: string;
  vault: string; // alias or address
  episodesLimit?: number;
}): Promise<VaultPerformanceResponse> {
  return getVaultPerformanceApi(params);
}
