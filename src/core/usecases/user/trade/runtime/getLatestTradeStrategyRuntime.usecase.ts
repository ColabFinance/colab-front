import {
  apiSignalsGetLatestTradeRuntime,
  type TradeRuntimeLatestApiRecord,
} from "@/core/infra/api/api-signals/tradeStrategy";

export type TradeRuntimeLatestItem = TradeRuntimeLatestApiRecord | null;

export async function getLatestTradeStrategyRuntimeUseCase(params: {
  accessToken?: string;
  strategyId: string;
}): Promise<{ ok: boolean; data?: TradeRuntimeLatestItem; message?: string }> {
  return apiSignalsGetLatestTradeRuntime(params);
}