import { updateDailyHarvestConfigApi } from "@/infra/api-lp/vault";
import type { UpdateDailyHarvestConfigRequest, UpdateDailyHarvestConfigResponse } from "@/domain/vault/types";

export async function updateDailyHarvestConfigUseCase(params: {
  payload: UpdateDailyHarvestConfigRequest;
  accessToken: string;
  vault: string;
}): Promise<UpdateDailyHarvestConfigResponse> {
  return updateDailyHarvestConfigApi(params);
}
