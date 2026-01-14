// src/shared/config/chainRuntime.ts
import type { ChainKey } from "@/shared/config/env";

export type ChainRuntime = {
  chainKey: ChainKey;
  chainId: number;
};

function parseChainId(chainIdHexOrDec: string | number): number {
  if (typeof chainIdHexOrDec === "number") return chainIdHexOrDec;
  const s = String(chainIdHexOrDec);
  if (s.startsWith("0x")) return parseInt(s, 16);
  return parseInt(s, 10);
}

export function chainKeyFromChainId(chainId: number): ChainKey {
  // Base mainnet
  if (chainId === 8453) return "base";
  // BNB Smart Chain mainnet
  if (chainId === 56) return "bnb";

  // if (chainId === 84532) return "base"; // Base Sepolia
  // if (chainId === 97) return "bnb";     // BSC testnet

  throw new Error(`Unsupported network (chainId=${chainId}). Switch to Base or BNB.`);
}

export async function getActiveChainRuntime(): Promise<ChainRuntime> {
  const eth = (globalThis as any)?.ethereum;
  if (!eth?.request) throw new Error("No EVM provider found (window.ethereum).");

  const chainIdRaw = await eth.request({ method: "eth_chainId" });
  const chainId = parseChainId(chainIdRaw);
  const chainKey = chainKeyFromChainId(chainId);
  return { chainKey, chainId };
}

export function onChainChanged(cb: (rt: ChainRuntime) => void): () => void {
  const eth = (globalThis as any)?.ethereum;
  if (!eth?.on) return () => {};

  const handler = async (chainIdRaw: string) => {
    const chainId = parseChainId(chainIdRaw);
    const chainKey = chainKeyFromChainId(chainId);
    cb({ chainKey, chainId });
  };

  eth.on("chainChanged", handler);
  return () => {
    try {
      eth.removeListener("chainChanged", handler);
    } catch {}
  };
}

export function onAccountsChanged(cb: () => void): () => void {
  const eth = (globalThis as any)?.ethereum;
  if (!eth?.on) return () => {};

  const handler = () => cb();

  eth.on("accountsChanged", handler);
  return () => {
    try {
      eth.removeListener("accountsChanged", handler);
    } catch {}
  };
}
