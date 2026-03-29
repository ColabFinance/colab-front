import { apiSignalsSetTradeStrategyStatus } from "@/core/infra/api/api-signals/tradeStrategy";

export async function setTradeStrategyStatusUseCase(params: {
  accessToken?: string;
  body: {
    strategy_id: string;
    status: string;
  };
}) {
  return apiSignalsSetTradeStrategyStatus(params);
}