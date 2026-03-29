import {
  apiTradeExecutionListActivePositions,
  type TradePositionApiRecord,
} from "@/core/infra/api/api-trade-execution/tradeExecution";

export type ActiveTradePositionItem = TradePositionApiRecord;

export async function listActiveTradePositionsUseCase(params?: {
  accessToken?: string;
  query?: {
    execution_account_id?: string;
  };
}): Promise<{ ok: boolean; data?: ActiveTradePositionItem[]; message?: string }> {
  return apiTradeExecutionListActivePositions(params);
}