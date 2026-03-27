import {
  apiLpAdminSaveProtocolFeeCollectorState,
  SaveProtocolFeeCollectorStateBody,
} from "@/core/infra/api/api-lp/admin";

export async function saveProtocolFeeCollectorStateUseCase(params: {
  accessToken: string;
  body: SaveProtocolFeeCollectorStateBody;
}) {
  return apiLpAdminSaveProtocolFeeCollectorState(params.accessToken, params.body);
}