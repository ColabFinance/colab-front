import { apiMarketDataCreateIndicatorSet, CreateIndicatorSetBody } from "@/core/infra/api/api-market-data/indicatorSet";

export async function createIndicatorSetUseCase(params: { accessToken: string; payload: CreateIndicatorSetBody }) {
  return apiMarketDataCreateIndicatorSet(params.accessToken, params.payload);
}
