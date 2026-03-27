import { getClientVaultContract } from "@/core/infra/evm/contracts/clientVault";
import { VaultDetails } from "@/core/domain/vault/types";

async function safeRead<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getVaultDetails(vaultAddress: string): Promise<VaultDetails> {
  const v = await getClientVaultContract({ vaultAddress });
  const vaultAny = v as any;

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
    rewardSwapCfg,
    dailyHarvestEnabled,
    dailyHarvestCooldownSecBn,
    lastDailyHarvestTsBn,
    compoundEnabled,
    compoundCooldownSecBn,
    lastCompoundTsBn,
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
    v.rewardSwap(),
    safeRead(() => vaultAny.dailyHarvestEnabled(), false),
    safeRead(() => vaultAny.dailyHarvestCooldownSec(), 0),
    safeRead(() => vaultAny.lastDailyHarvestTs(), 0),
    safeRead(() => vaultAny.compoundEnabled(), false),
    safeRead(() => vaultAny.compoundCooldownSec(), 0),
    safeRead(() => vaultAny.lastCompoundTs(), 0),
  ]);

  const token0 = tokenPair?.[0] ?? tokenPair?.token0 ?? "";
  const token1 = tokenPair?.[1] ?? tokenPair?.token1 ?? "";

  const enabled = automationConfig?.[0] ?? automationConfig?.enabled ?? false;
  const cooldown = Number(automationConfig?.[1] ?? automationConfig?.cooldown ?? 0);
  const slippage = Number(automationConfig?.[2] ?? automationConfig?.slippageBps ?? 0);
  const swapAllowed = automationConfig?.[3] ?? automationConfig?.swapAllowed ?? false;

  const rsEnabled = Boolean(rewardSwapCfg?.[0] ?? rewardSwapCfg?.enabled ?? false);
  const rsTokenIn = String(rewardSwapCfg?.[1] ?? rewardSwapCfg?.tokenIn ?? "");
  const rsTokenOut = String(rewardSwapCfg?.[2] ?? rewardSwapCfg?.tokenOut ?? "");
  const rsFee = Number(rewardSwapCfg?.[3] ?? rewardSwapCfg?.fee ?? 0);
  const rsSqrtPriceLimitX96 =
    rewardSwapCfg?.[4]?.toString?.() ??
    String(rewardSwapCfg?.sqrtPriceLimitX96 ?? "0");

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

    dailyHarvestEnabled: Boolean(dailyHarvestEnabled),
    dailyHarvestCooldownSec: Number(dailyHarvestCooldownSecBn ?? 0),
    lastDailyHarvestTs: Number(lastDailyHarvestTsBn ?? 0),

    compoundEnabled: Boolean(compoundEnabled),
    compoundCooldownSec: Number(compoundCooldownSecBn ?? 0),
    lastCompoundTs: Number(lastCompoundTsBn ?? 0),

    positionTokenId: positionTokenIdBn?.toString?.() ?? String(positionTokenIdBn),
    lastRebalanceTs: Number(lastRebalanceTsBn),

    rewardSwap: {
      enabled: rsEnabled,
      tokenIn: rsTokenIn,
      tokenOut: rsTokenOut,
      fee: rsFee,
      sqrtPriceLimitX96: rsSqrtPriceLimitX96,
    },
  };
}