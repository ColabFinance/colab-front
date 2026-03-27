import {
  apiLpAdminSaveProtocolFeeReporterState,
  SaveProtocolFeeReporterStateBody,
} from "@/core/infra/api/api-lp/admin";

export async function saveProtocolFeeReporterStateUseCase(params: {
  accessToken: string;
  body: SaveProtocolFeeReporterStateBody;
}) {
  return apiLpAdminSaveProtocolFeeReporterState(params.accessToken, params.body);
}