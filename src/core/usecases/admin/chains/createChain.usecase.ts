import { apiLpAdminCreateChain, type CreateChainBody } from "@/core/infra/api/api-lp/admin";

export async function createChainUseCase(params: {
  accessToken: string;
  body: CreateChainBody;
}) {
  return apiLpAdminCreateChain(params.accessToken, params.body);
}