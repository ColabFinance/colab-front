import { getClientVaultContract } from "@/infra/evm/contracts/clientVault";
import { VaultDetails } from "@/domain/vault/types";

export async function getVaultDetails(vaultAddress: string): Promise<VaultDetails> {
  const v = await getClientVaultContract({ vaultAddress });

  // parallel reads
  const [
    owner,
    executor,
    adapter,
    dexRouter,
    feeCollector,
    strategyIdBn,
    tokenPair,
    automationConfig,
    positionTokenIdBn,
    lastRebalanceTsBn,
  ] = await Promise.all([
    v.owner(),
    v.executor(),
    v.adapter(),
    v.dexRouter(),
    v.feeCollector(),
    v.strategyId(),
    v.tokens(),
    v.getAutomationConfig(),
    v.positionTokenId(),
    v.lastRebalanceTs(),
  ]);

  const token0 = tokenPair?.[0] ?? tokenPair?.token0 ?? "";
  const token1 = tokenPair?.[1] ?? tokenPair?.token1 ?? "";

  const enabled = automationConfig?.[0] ?? automationConfig?.enabled ?? false;
  const cooldown = Number(automationConfig?.[1] ?? automationConfig?.cooldown ?? 0);
  const slippage = Number(automationConfig?.[2] ?? automationConfig?.slippageBps ?? 0);
  const swapAllowed = automationConfig?.[3] ?? automationConfig?.swapAllowed ?? false;

  return {
    address: vaultAddress,

    owner,
    executor,
    adapter,
    dexRouter,
    feeCollector,
    strategyId: Number(strategyIdBn),

    token0,
    token1,

    automationEnabled: Boolean(enabled),
    cooldownSec: cooldown,
    maxSlippageBps: slippage,
    allowSwap: Boolean(swapAllowed),

    positionTokenId: positionTokenIdBn?.toString?.() ?? String(positionTokenIdBn),
    lastRebalanceTs: Number(lastRebalanceTsBn),
  };
}
