import { apiLpAdminCreateDex, type CreateDexBody } from "@/infra/api-lp/admin";

export async function createDexUseCase(params: { accessToken: string; body: CreateDexBody }) {
  return apiLpAdminCreateDex(params.accessToken, params.body);
}
