import { apiSignalsUpsertStrategyParams, UpsertStrategyParamsBody } from "@/core/infra/api/api-signals/strategy";

export async function upsertStrategyParamsUseCase(params: {
  accessToken: string;
  payload: UpsertStrategyParamsBody;
}) {
  return apiSignalsUpsertStrategyParams(params.accessToken, params.payload);
}
