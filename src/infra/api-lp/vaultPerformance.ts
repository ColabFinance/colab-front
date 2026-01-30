import { apiLpGet } from "@/infra/api-lp/client";
import type { VaultPerformanceResponse } from "@/domain/vault/performance";

export async function getVaultPerformanceApi(params: {
  accessToken?: string;
  vault: string; // alias or address
  episodesLimit?: number;
}): Promise<VaultPerformanceResponse> {
  const limit =
    typeof params.episodesLimit === "number" ? params.episodesLimit : 300;

  const qs = `episodes_limit=${encodeURIComponent(String(limit))}`;

  return apiLpGet<VaultPerformanceResponse>(
    `/vaults/${encodeURIComponent(params.vault)}/performance?${qs}`,
    params.accessToken,
  );
}
