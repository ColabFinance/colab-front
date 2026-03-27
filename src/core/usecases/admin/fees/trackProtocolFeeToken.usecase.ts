import {
  apiLpAdminTrackProtocolFeeToken,
  TrackProtocolFeeTokenBody,
} from "@/core/infra/api/api-lp/admin";

export async function trackProtocolFeeTokenUseCase(params: {
  accessToken: string;
  body: TrackProtocolFeeTokenBody;
}) {
  return apiLpAdminTrackProtocolFeeToken(params.accessToken, params.body);
}