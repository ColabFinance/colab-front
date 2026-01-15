import { apiLpGetStrategyParams } from "@/infra/api-lp/strategy";

export async function getStrategyParamsUseCase(params: {
  accessToken: string;
  chain: "base" | "bnb";
  owner: string;
  strategyId: number;
}) {
  return apiLpGetStrategyParams(params.accessToken, params.chain, params.owner, params.strategyId);
}
