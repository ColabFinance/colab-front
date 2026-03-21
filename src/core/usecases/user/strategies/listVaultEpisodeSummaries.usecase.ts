import {
  apiSignalsListVaultEpisodeSummaries,
  type VaultEpisodeSummaryRecord,
  type VaultEpisodeSummaryRef,
} from "@/core/infra/api/api-signals/episode";

export async function listVaultEpisodeSummariesUseCase(params: {
  accessToken?: string;
  items: VaultEpisodeSummaryRef[];
}): Promise<VaultEpisodeSummaryRecord[]> {
  const res = await apiSignalsListVaultEpisodeSummaries(params);

  if (!res?.ok) {
    throw new Error(res?.message || "Failed to load vault episode summaries");
  }

  return Array.isArray(res.data) ? res.data : [];
}