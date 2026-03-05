import { apiSignalsSetStrategyStatus } from "@/core/infra/api/api-signals/strategy";

export async function setStrategyStatusUseCase(params: {
  accessToken: string;
  payload: { chain: "base" | "bnb"; owner: string; strategy_id: number; status: "ACTIVE" | "INACTIVE" };
}) {
  return apiSignalsSetStrategyStatus(params.accessToken, params.payload);
}
