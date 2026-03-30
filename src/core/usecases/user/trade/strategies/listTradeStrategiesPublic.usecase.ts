import {
  apiSignalsListTradeStrategiesPublic,
  type TradeStrategyApiRecord,
  type TradeStrategyPublicFilterOptions,
  type TradeStrategyPublicPagination,
  type TradeStrategyPublicSummary,
} from "@/core/infra/api/api-signals/tradeStrategy";

export type TradeStrategyPublicListItem = TradeStrategyApiRecord;

export async function listTradeStrategiesPublicUseCase(params?: {
  accessToken?: string;
  query?: {
    status?: string;
    stream_key?: string;
    symbol?: string;
    execution_account_id?: string;
    search?: string;
    limit?: number;
    page?: number;
    offset?: number;
  };
}): Promise<{
  ok: boolean;
  data?: TradeStrategyPublicListItem[];
  pagination?: TradeStrategyPublicPagination;
  summary?: TradeStrategyPublicSummary;
  filter_options?: TradeStrategyPublicFilterOptions;
  message?: string;
}> {
  return apiSignalsListTradeStrategiesPublic(params);
}