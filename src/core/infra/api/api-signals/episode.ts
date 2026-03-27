import { apiSignalsPost } from "@/core/infra/api/api-signals/client";

export type VaultEpisodeSummaryRef = {
  dex: string;
  alias: string;
};

export type VaultEpisodeSummaryRecord = {
  dex: string;
  alias: string;

  total_episodes: number;
  open_episodes: number;
  closed_episodes: number;

  has_open_episode: boolean;
  latest_status?: string | null;

  fee_total_usd: number;
  fee_24h_usd: number;

  gas_total_usd: number;
  gas_24h_usd: number;

  latest_open_time?: number | null;
  latest_open_time_iso?: string | null;

  latest_close_time?: number | null;
  latest_close_time_iso?: string | null;

  latest_updated_at?: number | null;
  latest_updated_at_iso?: string | null;
};

export async function apiSignalsListVaultEpisodeSummaries(params: {
  accessToken?: string;
  items: VaultEpisodeSummaryRef[];
}): Promise<{ ok: boolean; data?: VaultEpisodeSummaryRecord[]; total?: number; message?: string }> {
  return apiSignalsPost(
    `/episodes/summary/by_vaults`,
    { items: params.items },
    params.accessToken || ""
  );
}