import { updateDailyHarvestConfigApi } from "@/core/infra/api/api-lp/vault";
import type { UpdateDailyHarvestConfigRequest, UpdateDailyHarvestConfigResponse } from "@/core/domain/vault/types";

export async function updateDailyHarvestConfigUseCase(params: {
  payload: UpdateDailyHarvestConfigRequest;
  accessToken: string;
  vault: string;
}): Promise<UpdateDailyHarvestConfigResponse> {
  return updateDailyHarvestConfigApi(params);
}
