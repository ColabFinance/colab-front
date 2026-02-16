import { apiMarketDataListIndicatorSets } from "@/infra/api-market-data/indicatorSet";

export async function listIndicatorSetsUseCase(params: {
  accessToken: string;
  query?: { stream_key?: string; status?: string; limit?: number };
}) {
  return apiMarketDataListIndicatorSets(params.accessToken, params.query);
}
