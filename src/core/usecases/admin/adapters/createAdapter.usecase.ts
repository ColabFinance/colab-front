import {
  apiLpAdminCreateAdapter,
  CreateAdapterBody,
} from "@/core/infra/api/api-lp/admin";

export async function createAdapterUseCase(params: {
  accessToken: string;
  body: CreateAdapterBody;
}) {
  return apiLpAdminCreateAdapter(params.accessToken, params.body);
}