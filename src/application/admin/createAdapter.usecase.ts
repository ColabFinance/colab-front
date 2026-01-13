import { apiLpAdminCreateAdapter, type CreateAdapterBody } from "@/infra/api-lp/admin";

export async function createAdapterUseCase(params: { accessToken: string; payload: CreateAdapterBody }) {
  return apiLpAdminCreateAdapter(params.accessToken, params.payload);
}
