import { apiLpAdminCreateDex, type CreateDexBody } from "@/core/infra/api/api-lp/admin";

export async function createDexUseCase(params: { accessToken: string; body: CreateDexBody }) {
  return apiLpAdminCreateDex(params.accessToken, params.body);
}
