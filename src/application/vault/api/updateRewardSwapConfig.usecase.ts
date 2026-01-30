import { updateRewardSwapConfigApi } from "@/infra/api-lp/vault";
import type { UpdateRewardSwapConfigRequest, UpdateRewardSwapConfigResponse } from "@/domain/vault/types";

export async function updateRewardSwapConfigUseCase(params: {
  payload: UpdateRewardSwapConfigRequest;
  accessToken: string;
  vault: string;
}): Promise<UpdateRewardSwapConfigResponse> {
  return updateRewardSwapConfigApi(params);
}
