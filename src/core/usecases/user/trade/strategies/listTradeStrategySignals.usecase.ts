import { apiSignalsListTradeSignals } from "@/core/infra/api/api-signals/tradeStrategy";

export async function listTradeStrategySignalsUseCase(params: {
  accessToken?: string;
  strategyId: string;
  limit?: number;
  page?: number;
  offset?: number;
}) {
  return apiSignalsListTradeSignals({
    accessToken: params.accessToken,
    query: {
      strategy_id: params.strategyId,
      limit: params.limit ?? 10,
      page: params.page,
      offset: params.offset,
    },
  });
}