import {
  apiSignalsGetLatestTradeStrategyRuntimeSnapshot,
  type TradeStrategyRuntimeSnapshotApiRecord,
} from "@/core/infra/api/api-signals/tradeStrategy";

export type TradeRuntimeLatestItem = TradeStrategyRuntimeSnapshotApiRecord | null;

export async function getLatestTradeStrategyRuntimeUseCase(params: {
  accessToken?: string;
  strategyId: string;
}): Promise<{ ok: boolean; data?: TradeRuntimeLatestItem; message?: string }> {
  return apiSignalsGetLatestTradeStrategyRuntimeSnapshot(params);
}