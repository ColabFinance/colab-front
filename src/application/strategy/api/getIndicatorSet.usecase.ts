import { apiMarketDataGetIndicatorSet } from "@/infra/api-market-data/indicatorSet";

export async function getIndicatorSetUseCase(params: { accessToken: string; cfgHash: string }) {
  return apiMarketDataGetIndicatorSet(params.accessToken, params.cfgHash);
}
