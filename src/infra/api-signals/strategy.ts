import { apiSignalsGet, apiSignalsPost } from "@/infra/api-signals/client";

export type StrategyParamsRecord = {
  id?: string;

  chain: "base" | "bnb";
  owner: string;
  strategy_id: number;

  name: string;
  symbol: string;
  indicator_set_id: string;
  status: string;

  params: Record<string, any>;

  adapter?: string | null;
  dex_router?: string | null;
  token0?: string | null;
  token1?: string | null;
  tx_hash?: string | null;

  created_at?: number | null;
  created_at_iso?: string | null;
  updated_at?: number | null;
  updated_at_iso?: string | null;
};

export type UpsertStrategyParamsBody = {
  chain: "base" | "bnb";
  owner: string;
  strategy_id: number;

  // required to keep compatibility with existing collection
  name: string;
  symbol: string;
  indicator_set_id: string;
  status?: string;

  params: Record<string, any>;

  // optional onchain metadata
  adapter?: string;
  dex_router?: string;
  token0?: string;
  token1?: string;
  tx_hash?: string;
};

export async function apiSignalsGetStrategyParams(
  accessToken: string,
  chain: "base" | "bnb",
  owner: string,
  strategyId: number
): Promise<{ ok: boolean; data?: StrategyParamsRecord | null; message?: string }> {
  return apiSignalsGet(`/strategies/params?chain=${chain}&owner=${owner}&strategy_id=${strategyId}`, accessToken);
}

export async function apiSignalsUpsertStrategyParams(
  accessToken: string,
  body: UpsertStrategyParamsBody
): Promise<{ ok: boolean; data?: StrategyParamsRecord; message?: string }> {
  return apiSignalsPost(`/strategies/params/upsert`, body, accessToken);
}
