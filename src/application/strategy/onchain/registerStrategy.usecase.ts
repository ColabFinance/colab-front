import type { ConnectedWallet } from "@privy-io/react-auth";
import { Interface, isAddress } from "ethers";

import { getStrategyRegistryWrite, getStrategyRegistryRead } from "@/infra/evm/contracts/strategyRegistry";
import { StrategyRegistryAbi } from "@/infra/evm/abis/strategyRegistry.abi";
import { listStrategiesOnchain } from "@/application/strategy/onchain/listStrategies.usecase";

export type RegisterStrategyPayload = {
  adapter: string;
  dexRouter: string;
  token0: string;
  token1: string;
  name: string;
  description: string;
};

export type RegisterStrategyOnchainResult = {
  tx_hash: string;
  receipt: any;
  strategy_id: number;
};

function extractStrategyIdFromReceipt(params: {
  receipt: any;
  registryAddr: string;
}): number | null {
  const { receipt, registryAddr } = params;
  const logs = receipt?.logs || [];
  const iface = new Interface(StrategyRegistryAbi);

  for (const lg of logs) {
    if (!lg?.address || lg.address.toLowerCase() !== registryAddr.toLowerCase()) continue;

    try {
      const parsed = iface.parseLog({ topics: lg.topics, data: lg.data });

      // tenta nomes comuns
      if (!parsed?.name) continue;
      const n = parsed.name;

      const candidates = ["StrategyRegistered", "StrategyAdded", "StrategyUpserted"];
      if (!candidates.includes(n)) continue;

      const args: any = parsed.args || {};
      const sid = args.strategyId ?? args.strategy_id ?? args.id ?? args.strategyID;
      if (sid === undefined || sid === null) continue;

      const asNum = Number(sid);
      if (Number.isFinite(asNum) && asNum >= 1) return asNum;
    } catch {
      continue;
    }
  }

  return null;
}

function assertAddress(label: string, v: string) {
  const s = (v || "").trim();
  if (!isAddress(s)) throw new Error(`${label} must be a valid 0x address`);
  return s;
}

export async function registerStrategyOnchain(params: {
  wallet: ConnectedWallet;
  owner: string;
  payload: RegisterStrategyPayload;
}): Promise<RegisterStrategyOnchainResult> {
  assertAddress("owner", params.owner);
  assertAddress("adapter", params.payload.adapter);
  assertAddress("dexRouter", params.payload.dexRouter);
  assertAddress("token0", params.payload.token0);
  assertAddress("token1", params.payload.token1);

  const regWrite = await getStrategyRegistryWrite(params.wallet);

  const tx = await regWrite.registerStrategy(
    params.payload.adapter,
    params.payload.dexRouter,
    params.payload.token0,
    params.payload.token1,
    params.payload.name,
    params.payload.description
  );

  const receipt = await tx.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error("registerStrategy transaction reverted");
  }

  // resolve registry address (read contract to get address reliably)
  const regRead = await getStrategyRegistryRead();
  const registryAddr = (regRead as any)?.target || (regRead as any)?.address;
  if (!registryAddr || !isAddress(registryAddr)) {
    throw new Error("Could not resolve StrategyRegistry address for receipt parsing");
  }

  let strategyId = extractStrategyIdFromReceipt({ receipt, registryAddr });

  // fallback: read onchain list and pick latest
  if (!strategyId) {
    const all = await listStrategiesOnchain(params.owner);
    const max = all.reduce((acc, s) => (s?.strategyId && s.strategyId > acc ? s.strategyId : acc), 0);
    if (!max) throw new Error("Could not resolve strategy_id from receipt nor from onchain list");
    strategyId = max;
  }

  return {
    tx_hash: (tx.hash as string) || (receipt?.hash as string),
    receipt,
    strategy_id: strategyId,
  };
}
