import { getVaultPerformanceApi } from "@/core/infra/api/api-lp/vaultPerformance";
import type { VaultPerformanceResponse } from "@/core/domain/vault/performance";

export async function getVaultPerformanceUseCase(params: {
  accessToken?: string;
  vault: string; // alias or address
  episodesLimit?: number;
}): Promise<VaultPerformanceResponse> {
  return getVaultPerformanceApi(params);
}
