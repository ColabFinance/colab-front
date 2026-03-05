import {
  apiLpAdminCreateProtocolFeeCollector,
  type CreateProtocolFeeCollectorBody,
} from "@/core/infra/api/api-lp/admin";

export async function createProtocolFeeCollectorUseCase(params: {
  accessToken: string;
  body: CreateProtocolFeeCollectorBody;
}) {
  return apiLpAdminCreateProtocolFeeCollector(params.accessToken, params.body);
}
