import { apiSignalsGet, apiSignalsPost } from "@/core/infra/api/api-signals/client";

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
  stream_key: string;
  status?: string;

  params: Record<string, any>;

  // optional onchain metadata
  adapter?: string;
  dex_router?: string;
  token0?: string;
  token1?: string;
  tx_hash?: string;
};

export type RegisterStrategyBody = {
  chain: "base" | "bnb";
  owner: string;
  strategy_id: number;
  name: string;

  symbol: string;
  indicator_set_id: string;
  stream_key: string;
  
  adapter?: string;
  dex_router?: string;
  token0?: string;
  token1?: string;

  tx_hash?: string;
  status?: "ACTIVE" | "INACTIVE";
};

export type StrategyExistsQuery = {
  chain: "base" | "bnb";
  owner: string;
  name: string;
  symbol: string;
};

export type StrategyExistsResult = {
  exists: boolean;
};

export type StrategyListQuery = {
  chain: "base" | "bnb";
  owner: string;
  status?: "ACTIVE" | "INACTIVE";
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

export async function apiSignalsRegisterStrategy(
  accessToken: string,
  body: RegisterStrategyBody
): Promise<{ ok: boolean; data?: StrategyParamsRecord; message?: string }> {
  return apiSignalsPost(`/strategies/register`, body, accessToken);
}

export async function apiSignalsStrategyExists(
  accessToken: string,
  query: StrategyExistsQuery
): Promise<{ ok: boolean; data?: StrategyExistsResult; message?: string }> {
  const qs =
    `chain=${encodeURIComponent(query.chain)}` +
    `&owner=${encodeURIComponent(query.owner)}` +
    `&name=${encodeURIComponent(query.name)}` +
    `&symbol=${encodeURIComponent(query.symbol)}`;

  return apiSignalsGet(`/strategies/exists?${qs}`, accessToken);
}

export type StrategyListApiRecord = {
  id?: string;
  name: string;
  symbol: string;
  status: string;
  description?: string;
  indicator_set_id?: string;
  chain?: string;
  owner?: string;
  strategy_id?: number;
  adapter?: string | null;
  dex_router?: string | null;
  token0?: string | null;
  token1?: string | null;
  tx_hash?: string | null;
  stream_key?: string | null;
  dex?: string | null;
  alias?: string | null;
  created_at?: number;
  created_at_iso?: string;
  updated_at?: number;
  updated_at_iso?: string;
};

export async function apiSignalsListStrategies(params: {
  accessToken: string;
  query: {
    chain: string;
    owner: string;
    status?: string;
  };
}): Promise<{ ok: boolean; data?: StrategyListApiRecord[]; message?: string }> {
  const qs =
    `chain=${encodeURIComponent(params.query.chain)}` +
    `&owner=${encodeURIComponent(params.query.owner)}` +
    (params.query.status ? `&status=${encodeURIComponent(params.query.status)}` : "");

  return apiSignalsGet(`/strategies/list?${qs}`, params.accessToken);
}

export async function apiSignalsSetStrategyStatus(
  accessToken: string,
  body: { chain: "base" | "bnb"; owner: string; strategy_id: number; status: "ACTIVE" | "INACTIVE" },
): Promise<{ ok: boolean; data?: StrategyParamsRecord; message?: string }> {
  return apiSignalsPost(`/strategies/status/set`, body, accessToken);
}
