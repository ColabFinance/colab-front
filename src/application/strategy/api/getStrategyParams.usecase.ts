import { apiSignalsGetStrategyParams } from "@/infra/api-signals/strategy";

export async function getStrategyParamsUseCase(params: {
  accessToken: string;
  chain: "base" | "bnb";
  owner: string;
  strategyId: number;
}) {
  return apiSignalsGetStrategyParams(params.accessToken, params.chain, params.owner, params.strategyId);
}
