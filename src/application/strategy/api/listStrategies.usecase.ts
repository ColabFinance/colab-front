import { apiSignalsListStrategies } from "@/infra/api-signals/strategy";
import { Strategy } from "@/domain/strategy/types";

export async function listStrategiesUseCase(params: {
  accessToken: string;
  query: {
    chain: "base" | "bnb";
    owner: string;
    status?: "ACTIVE" | "INACTIVE";
  };
}): Promise<Strategy[]> {
  const res = await apiSignalsListStrategies(params.accessToken, params.query);
  const rows = res?.data || [];

  return (rows || [])
    .map((r: any) => {
      const strategyId = Number(r?.strategy_id || 0);
      const status = String(r?.status || "").toUpperCase();
      return {
        strategyId,
        name: String(r?.name || ""),
        description: String(r?.description || ""),
        active: status === "ACTIVE",
        adapter: String(r?.adapter || ""),
        dexRouter: String(r?.dex_router || ""),
        token0: String(r?.token0 || ""),
        token1: String(r?.token1 || ""),
      } as Strategy;
    })
    .filter((s) => Number.isFinite(s.strategyId) && s.strategyId > 0)
    .sort((a, b) => a.strategyId - b.strategyId);
}
