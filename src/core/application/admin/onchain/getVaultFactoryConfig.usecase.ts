import { getVaultFactoryRead } from "@/core/infra/evm/contracts/vaultFactory";

function getContractAddress(c: any): string {
  return (c?.target as string) || (c?.address as string) || "";
}

export async function getVaultFactoryConfigUseCase() {
  const c = await getVaultFactoryRead();

  const [executor, feeCollector, cooldownSec, maxSlippageBps, allowSwap, owner] =
    await Promise.all([
      c.executor(),
      c.feeCollector(),
      c.defaultCooldownSec(),
      c.defaultMaxSlippageBps(),
      c.defaultAllowSwap(),
      typeof c.owner === "function" ? c.owner() : Promise.resolve(""),
    ]);

  return {
    contractAddress: getContractAddress(c),
    ownerAddress: String(owner || ""),
    executorAddress: String(executor || ""),
    feeCollectorAddress: String(feeCollector || ""),
    cooldownSec: Number(cooldownSec),
    maxSlippageBps: Number(maxSlippageBps),
    allowSwap: Boolean(allowSwap),
  };
}