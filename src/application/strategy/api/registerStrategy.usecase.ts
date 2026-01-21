import { apiSignalsRegisterStrategy } from "@/infra/api-signals/strategy";

export async function registerStrategyDbUseCase(params: {
  accessToken: string;
  payload: {
    chain: "base" | "bnb";
    owner: string;
    strategy_id: number;
    name: string;

    symbol: string;
    indicator_set_id: string;

    adapter?: string;
    dex_router?: string;
    token0?: string;
    token1?: string;

    tx_hash?: string;
    status?: "ACTIVE" | "INACTIVE";
  };
}) {
  return apiSignalsRegisterStrategy(params.accessToken, params.payload);
}
