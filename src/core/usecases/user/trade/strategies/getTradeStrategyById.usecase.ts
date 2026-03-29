import { apiSignalsGetTradeStrategyById } from "@/core/infra/api/api-signals/tradeStrategy";

export async function getTradeStrategyByIdUseCase(params: {
  accessToken?: string;
  strategyId: string;
}) {
  return apiSignalsGetTradeStrategyById(params);
}