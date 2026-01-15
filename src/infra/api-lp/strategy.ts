import { apiLpGet, apiLpPost } from "@/infra/api-lp/client";

export type StrategyParamsRecord = {
  chain: "base" | "bnb";
  owner: string;
  strategy_id: number;
  params: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type UpsertStrategyParamsBody = {
  chain: "base" | "bnb";
  owner: string;
  strategy_id: number;
  params: Record<string, any>;
};

export async function apiLpGetStrategyParams(
  accessToken: string,
  chain: "base" | "bnb",
  owner: string,
  strategyId: number
): Promise<{ ok: boolean; data?: StrategyParamsRecord | null; message?: string }> {
  return apiLpGet(`/strategies/params?chain=${chain}&owner=${owner}&strategy_id=${strategyId}`, accessToken);
}

export async function apiLpUpsertStrategyParams(
  accessToken: string,
  body: UpsertStrategyParamsBody
): Promise<{ ok: boolean; data?: StrategyParamsRecord; message?: string }> {
  return apiLpPost(`/strategies/params/upsert`, body, accessToken);
}
