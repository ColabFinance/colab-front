import { apiLpUpsertStrategyParams, type UpsertStrategyParamsBody } from "@/infra/api-lp/strategy";

export async function upsertStrategyParamsUseCase(params: {
  accessToken: string;
  payload: UpsertStrategyParamsBody;
}) {
  return apiLpUpsertStrategyParams(params.accessToken, params.payload);
}
