import { Contract, isAddress } from "ethers";

import { getPoolByPoolUseCase } from "@/core/application/vault/api/getDexPoolByPool.usecase";
import { getReadProvider } from "@/core/infra/evm/provider";

const ADAPTER_MIN_ABI = [
  "function pool() view returns (address)",
  "function nfpm() view returns (address)",
  "function gauge() view returns (address)",
] as const;

const ERC20_MIN_ABI = [
  "function symbol() view returns (string)",
] as const;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function normalizeText(value?: string | null): string {
  return String(value ?? "").trim();
}

function formatChainLabel(chainKey?: string | null): string {
  const key = normalizeText(chainKey).toLowerCase();

  if (key === "base") return "Base";
  if (key === "bnb") return "BNB Chain";
  if (key === "ethereum") return "Ethereum";
  if (key === "polygon") return "Polygon";
  if (key === "arbitrum") return "Arbitrum";

  if (!key) return "Unknown";

  return key
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDexLabel(dexKey?: string | null): string {
  const key = normalizeText(dexKey).toLowerCase();

  if (key === "uniswap_v3") return "Uniswap V3";
  if (key === "pancake_v3") return "Pancake V3";
  if (key === "aerodrome") return "Aerodrome";
  if (key === "quickswap") return "QuickSwap";

  if (!key) return "Unknown";

  return key
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

async function readTokenSymbol(tokenAddress: string): Promise<string> {
  if (!isAddress(tokenAddress)) return "TOKEN";

  try {
    const provider = await getReadProvider();
    const contract = new Contract(tokenAddress, ERC20_MIN_ABI, provider);
    const symbol = await contract.symbol();
    return normalizeText(symbol) || "TOKEN";
  } catch {
    return `${tokenAddress.slice(0, 6)}...${tokenAddress.slice(-4)}`;
  }
}

async function readAdapterInfra(adapterAddress: string): Promise<{
  poolAddress: string;
  nfpmAddress: string;
  gaugeAddress: string | null;
}> {
  if (!isAddress(adapterAddress)) {
    throw new Error("Invalid strategy adapter address.");
  }

  const provider = await getReadProvider();
  const adapter = new Contract(adapterAddress, ADAPTER_MIN_ABI, provider);

  const [poolAddress, nfpmAddress, gaugeAddress] = await Promise.all([
    adapter.pool(),
    adapter.nfpm(),
    adapter.gauge().catch(() => ZERO_ADDRESS),
  ]);

  if (!isAddress(poolAddress)) {
    throw new Error("Adapter did not provide a valid pool address.");
  }

  if (!isAddress(nfpmAddress)) {
    throw new Error("Adapter did not provide a valid NFPM address.");
  }

  return {
    poolAddress,
    nfpmAddress,
    gaugeAddress:
      isAddress(gaugeAddress) && gaugeAddress.toLowerCase() !== ZERO_ADDRESS.toLowerCase()
        ? gaugeAddress
        : null,
  };
}

export type ResolveVaultCreationPreviewResult = {
  poolAddress: string;
  nfpmAddress: string;
  gaugeAddress: string | null;

  token0Symbol: string;
  token1Symbol: string;
  marketPair: string;
  parToken: string;

  chainKey: string;
  chainName: string;

  dexKey: string;
  dexName: string;

  rewardTokenAddress: string | null;
  rpcUrl: string;
  version: string;
};

export async function resolveVaultCreationPreview(params: {
  adapterAddress: string;
  token0: string;
  token1: string;
  fallbackChainKey: string;
  fallbackDexKey: string;
  fallbackRpcUrl: string;
}): Promise<ResolveVaultCreationPreviewResult> {
  const { poolAddress, nfpmAddress, gaugeAddress } = await readAdapterInfra(params.adapterAddress);

  const [token0Symbol, token1Symbol, poolMeta] = await Promise.all([
    readTokenSymbol(params.token0),
    readTokenSymbol(params.token1),
    getPoolByPoolUseCase(poolAddress).catch(() => ({ ok: false, data: null })),
  ]);

  const chainKey =
    normalizeText(poolMeta?.data?.chain).toLowerCase() ||
    normalizeText(params.fallbackChainKey).toLowerCase();

  const dexKey =
    normalizeText(poolMeta?.data?.dex).toLowerCase() ||
    normalizeText(params.fallbackDexKey).toLowerCase();

  return {
    poolAddress,
    nfpmAddress,
    gaugeAddress,

    token0Symbol,
    token1Symbol,
    marketPair: `${token0Symbol}/${token1Symbol}`,
    parToken: token1Symbol,

    chainKey,
    chainName: formatChainLabel(chainKey),

    dexKey,
    dexName: formatDexLabel(dexKey),

    rewardTokenAddress: isAddress(String(poolMeta?.data?.reward_token || ""))
      ? String(poolMeta?.data?.reward_token)
      : null,

    rpcUrl: normalizeText(params.fallbackRpcUrl),
    version: "onchain",
  };
}