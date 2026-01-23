import { getVaultFactoryWrite } from "@/infra/evm/contracts/vaultFactory";

export async function setVaultFactoryDefaultsUseCase(params: {
  activeWallet: any;
  cooldownSec: number;
  maxSlippageBps: number;
  allowSwap: boolean;
}) {
  const cooldownSec = Number(params.cooldownSec);
  const maxSlippageBps = Number(params.maxSlippageBps);
  const allowSwap = Boolean(params.allowSwap);

  if (!Number.isFinite(cooldownSec) || cooldownSec < 0) throw new Error("Invalid cooldownSec.");
  if (!Number.isFinite(maxSlippageBps) || maxSlippageBps < 0) throw new Error("Invalid maxSlippageBps.");

  const c = await getVaultFactoryWrite(params.activeWallet);
  const tx = await c.setDefaults(cooldownSec, maxSlippageBps, allowSwap);
  return { txHash: tx.hash };
}
