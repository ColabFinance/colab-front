import { apiSignalsGetLatestTradeStrategyRuntimeSnapshot } from "@/core/infra/api/api-signals/tradeStrategy";

export async function getLatestTradeStrategyRuntimeUseCase(params: {
  accessToken?: string;
  strategyId: string;
}) {
  return apiSignalsGetLatestTradeStrategyRuntimeSnapshot(params);
}