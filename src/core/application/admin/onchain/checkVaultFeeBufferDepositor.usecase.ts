import { getVaultFeeBufferRead } from "@/core/infra/evm/contracts/vaultFeeBuffer";

export async function checkVaultFeeBufferDepositorUseCase(params: {
  depositor: string;
}) {
  const c = await getVaultFeeBufferRead();
  const allowed = await c.authorizedDepositor((params.depositor || "").trim());
  return { allowed: Boolean(allowed) };
}