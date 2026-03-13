import type { VaultStatus } from "@/core/domain/vault/status";
import { apiLpGet } from "@/core/infra/api/api-lp/client";

export async function getVaultStatus(
  params: string | { vaultAddress: string; freshOnchain?: boolean },
): Promise<VaultStatus> {
  const vaultAddress =
    typeof params === "string" ? params : params.vaultAddress;

  const freshOnchain =
    typeof params === "string" ? false : Boolean(params.freshOnchain);

  const qs = freshOnchain ? "?fresh_onchain=true" : "";

  return apiLpGet<VaultStatus>(
    `/vaults/${encodeURIComponent(vaultAddress)}/status${qs}`,
  );
}