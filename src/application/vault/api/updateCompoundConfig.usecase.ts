import { updateCompoundConfigApi } from "@/infra/api-lp/vault";
import type { UpdateCompoundConfigRequest, UpdateCompoundConfigResponse } from "@/domain/vault/types";

export async function updateCompoundConfigUseCase(params: {
  payload: UpdateCompoundConfigRequest;
  accessToken: string;
  vault: string;
}): Promise<UpdateCompoundConfigResponse> {
  return updateCompoundConfigApi(params);
}
