import {
  apiSignalsListStrategies,
  type StrategyListApiRecord,
} from "@/core/infra/api/api-signals/strategy";

export type StrategyListItem = StrategyListApiRecord;

export async function listStrategiesUseCase(params: {
  accessToken: string;
  query: {
    chain: string;
    owner: string;
    status?: "ACTIVE" | "INACTIVE";
  };
}): Promise<{ ok: boolean; data?: StrategyListItem[]; message?: string }> {
  return apiSignalsListStrategies(params);
}