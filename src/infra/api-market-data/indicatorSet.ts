import { apiMarketDataGet, apiMarketDataPost } from "@/infra/api-market-data/client";

export type IndicatorSetRecord = {
  id?: string;

  stream_key: string;
  source: string;
  symbol: string;
  interval: string;

  ema_fast: number;
  ema_slow: number;
  atr_window: number;

  status: string;
  cfg_hash: string;

  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;

  pool_address?: string | null;
};

export type CreateIndicatorSetBody = {
  symbol: string;
  ema_fast: number;
  ema_slow: number;
  atr_window: number;
  source?: string;
  pool_address?: string | null;
};

export async function apiMarketDataCreateIndicatorSet(accessToken: string, body: CreateIndicatorSetBody) {
  return apiMarketDataPost<IndicatorSetRecord>(`/market-data/indicator-sets`, body, accessToken);
}

export async function apiMarketDataListIndicatorSets(
  accessToken: string,
  query?: { stream_key?: string; status?: string; limit?: number }
) {
  const qs =
    `status=${encodeURIComponent(query?.status || "ACTIVE")}` +
    (query?.stream_key ? `&stream_key=${encodeURIComponent(query.stream_key)}` : "") +
    (query?.limit ? `&limit=${encodeURIComponent(String(query.limit))}` : "");

  return apiMarketDataGet<IndicatorSetRecord[]>(`/market-data/indicator-sets?${qs}`, accessToken);
}

export async function apiMarketDataGetIndicatorSet(accessToken: string, cfgHash: string) {
  return apiMarketDataGet<IndicatorSetRecord>(`/market-data/indicator-sets/${encodeURIComponent(cfgHash)}`, accessToken);
}
