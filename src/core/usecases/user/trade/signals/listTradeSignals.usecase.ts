import {
  apiSignalsListTradeSignals,
  type TradeSignalApiRecord,
} from "@/core/infra/api/api-signals/tradeStrategy";

export type TradeSignalListItem = TradeSignalApiRecord;

export async function listTradeSignalsUseCase(params?: {
  accessToken?: string;
  query?: {
    strategy_id?: string;
    limit?: number;
  };
}): Promise<{ ok: boolean; data?: TradeSignalListItem[]; message?: string }> {
  return apiSignalsListTradeSignals(params);
}