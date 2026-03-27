import { apiLpAdminUpdateChain, type UpdateChainBody } from "@/core/infra/api/api-lp/admin";

export async function updateChainUseCase(params: {
  accessToken: string;
  body: UpdateChainBody;
}) {
  return apiLpAdminUpdateChain(params.accessToken, params.body);
}