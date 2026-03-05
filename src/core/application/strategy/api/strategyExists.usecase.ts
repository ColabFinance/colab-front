import { apiSignalsStrategyExists } from "@/core/infra/api/api-signals/strategy";

export async function strategyExistsUseCase(params: {
  accessToken: string;
  query: {
    chain: "base" | "bnb";
    owner: string;
    name: string;
    symbol: string;
  };
}) {
  return apiSignalsStrategyExists(params.accessToken, params.query);
}
