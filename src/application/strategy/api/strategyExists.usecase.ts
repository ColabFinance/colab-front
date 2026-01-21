import { apiSignalsStrategyExists } from "@/infra/api-signals/strategy";

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
