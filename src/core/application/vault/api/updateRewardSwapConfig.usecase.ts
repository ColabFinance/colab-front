import { updateRewardSwapConfigApi } from "@/core/infra/api/api-lp/vault";
import type { UpdateRewardSwapConfigRequest, UpdateRewardSwapConfigResponse } from "@/core/domain/vault/types";

export async function updateRewardSwapConfigUseCase(params: {
  payload: UpdateRewardSwapConfigRequest;
  accessToken: string;
  vault: string;
}): Promise<UpdateRewardSwapConfigResponse> {
  return updateRewardSwapConfigApi(params);
}
