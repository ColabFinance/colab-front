import {
  apiSignalsListTradeStrategies,
  type TradeStrategyApiRecord,
} from "@/core/infra/api/api-signals/tradeStrategy";

export type TradeStrategyListItem = TradeStrategyApiRecord;

export async function listTradeStrategiesUseCase(params?: {
  accessToken?: string;
  query?: {
    stream_key?: string;
    status?: string;
    limit?: number;
  };
}): Promise<{ ok: boolean; data?: TradeStrategyListItem[]; message?: string }> {
  return apiSignalsListTradeStrategies(params);
}