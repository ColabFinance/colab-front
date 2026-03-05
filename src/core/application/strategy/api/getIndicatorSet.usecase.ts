import { apiMarketDataGetIndicatorSet } from "@/core/infra/api/api-market-data/indicatorSet";

export async function getIndicatorSetUseCase(params: { accessToken: string; cfgHash: string }) {
  return apiMarketDataGetIndicatorSet(params.accessToken, params.cfgHash);
}
