import {
  apiLpAdminSaveVaultFeeBufferDepositorState,
  SaveVaultFeeBufferDepositorStateBody,
} from "@/core/infra/api/api-lp/admin";

export async function saveVaultFeeBufferDepositorStateUseCase(params: {
  accessToken: string;
  body: SaveVaultFeeBufferDepositorStateBody;
}) {
  return apiLpAdminSaveVaultFeeBufferDepositorState(params.accessToken, params.body);
}