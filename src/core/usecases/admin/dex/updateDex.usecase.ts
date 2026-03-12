import { apiLpAdminUpdateDex, type UpdateDexBody } from "@/core/infra/api/api-lp/admin";

export async function updateDexUseCase(params: {
  accessToken: string;
  body: UpdateDexBody;
}) {
  return apiLpAdminUpdateDex(params.accessToken, params.body);
}