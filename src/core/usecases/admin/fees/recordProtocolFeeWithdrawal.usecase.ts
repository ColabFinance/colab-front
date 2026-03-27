import {
  apiLpAdminRecordProtocolFeeWithdrawal,
  RecordProtocolFeeWithdrawalBody,
} from "@/core/infra/api/api-lp/admin";

export async function recordProtocolFeeWithdrawalUseCase(params: {
  accessToken: string;
  body: RecordProtocolFeeWithdrawalBody;
}) {
  return apiLpAdminRecordProtocolFeeWithdrawal(params.accessToken, params.body);
}