import { updateCompoundConfigApi } from "@/core/infra/api/api-lp/vault";
import type { UpdateCompoundConfigRequest, UpdateCompoundConfigResponse } from "@/core/domain/vault/types";

export async function updateCompoundConfigUseCase(params: {
  payload: UpdateCompoundConfigRequest;
  accessToken: string;
  vault: string;
}): Promise<UpdateCompoundConfigResponse> {
  return updateCompoundConfigApi(params);
}
