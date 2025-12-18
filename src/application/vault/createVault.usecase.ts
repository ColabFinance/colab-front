import { TxRunResponse } from "@/domain/vault/types";
import { apiLpPost } from "@/infra/api-lp/client";

export async function createVault(params: {
  strategyId: number;
  ownerOverride: string;
  gasStrategy?: string;
  accessToken?: string;
}): Promise<TxRunResponse> {
  return apiLpPost<TxRunResponse>(
    "/vaults/factory/create-client-vault",
    {
      strategy_id: params.strategyId,
      owner_override: params.ownerOverride,
      gas_strategy: params.gasStrategy || "auto",
    },
    params.accessToken
  );
}
