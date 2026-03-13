import { apiLpAdminSaveVaultFactoryState, SaveVaultFactoryStateBody } from "@/core/infra/api/api-lp/admin";

export async function saveVaultFactoryStateUseCase(params: {
  accessToken: string;
  body: SaveVaultFactoryStateBody;
}) {
  return apiLpAdminSaveVaultFactoryState(params.accessToken, params.body);
}