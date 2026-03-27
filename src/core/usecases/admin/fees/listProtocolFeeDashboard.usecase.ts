import { apiLpAdminGetProtocolFeeDashboard } from "@/core/infra/api/api-lp/admin";

export async function listProtocolFeeDashboardUseCase(params: {
  accessToken: string;
  chain: string;
}) {
  return apiLpAdminGetProtocolFeeDashboard(params.accessToken, params.chain);
}