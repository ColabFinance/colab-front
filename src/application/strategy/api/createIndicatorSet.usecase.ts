import { apiMarketDataCreateIndicatorSet, CreateIndicatorSetBody } from "@/infra/api-market-data/indicatorSet";

export async function createIndicatorSetUseCase(params: { accessToken: string; payload: CreateIndicatorSetBody }) {
  return apiMarketDataCreateIndicatorSet(params.accessToken, params.payload);
}
