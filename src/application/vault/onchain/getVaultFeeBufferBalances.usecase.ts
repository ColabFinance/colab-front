import { Contract, formatUnits } from "ethers";
import { getVaultFeeBufferAddress, getVaultFeeBufferRead } from "@/infra/evm/contracts/vaultFeeBuffer";
import type { VaultFeeBufferBalances } from "@/domain/vault/feeBuffer";
import { getReadProvider } from "@/infra/evm/provider";

const ERC20_META_ABI = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

function is0xAddress(a?: string) {
  if (!a) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(a);
}

async function readErc20Meta(token: string): Promise<{ symbol: string; decimals: number }> {
  const provider = await getReadProvider();
  const c = new Contract(token, ERC20_META_ABI, provider);

  // alguns tokens “bugados” podem falhar em symbol() -> fallback
  let symbol = "TOKEN";
  let decimals = 18;

  try {
    symbol = await c.symbol();
    if (!symbol) symbol = "TOKEN";
  } catch {
    symbol = "TOKEN";
  }

  try {
    decimals = Number(await c.decimals());
    if (!Number.isFinite(decimals) || decimals < 0) decimals = 18;
  } catch {
    decimals = 18;
  }

  return { symbol, decimals };
}

export async function getVaultFeeBufferBalances(params: {
  vaultAddress: string;
  token0: string;
  token1: string;
  rewardToken?: string;
}): Promise<VaultFeeBufferBalances> {
  const { vaultAddress, token0, token1, rewardToken } = params;

  if (!is0xAddress(vaultAddress)) throw new Error("Invalid vaultAddress.");
  if (!is0xAddress(token0)) throw new Error("Invalid token0.");
  if (!is0xAddress(token1)) throw new Error("Invalid token1.");

  const rewardIsValid =
    is0xAddress(rewardToken) &&
    rewardToken!.toLowerCase() !== "0x0000000000000000000000000000000000000000";

  const feeBufferAddress = await getVaultFeeBufferAddress();
  const vfb = await getVaultFeeBufferRead();

  
  
  const [meta0, meta1, bal0, bal1, metaR, balR] = await Promise.all([
    readErc20Meta(token0),
    readErc20Meta(token1),
    vfb.balanceOf(vaultAddress, token0),
    vfb.balanceOf(vaultAddress, token1),
    
    rewardIsValid ? readErc20Meta(rewardToken!) : Promise.resolve(null),
    rewardIsValid ? vfb.balanceOf(vaultAddress, rewardToken!) : Promise.resolve(null),
  ]);
  
  const raw0 = bal0?.toString?.() ?? String(bal0);
  const raw1 = bal1?.toString?.() ?? String(bal1);
  
  const formatted0 = formatUnits(bal0, meta0.decimals);
  const formatted1 = formatUnits(bal1, meta1.decimals);
  
  console.log("rewardToken",rewardToken, rewardIsValid,metaR, balR);
  
  const reward =
    rewardIsValid && metaR && balR
      ? {
          address: rewardToken!,
          symbol: metaR.symbol,
          decimals: metaR.decimals,
          raw: balR?.toString?.() ?? String(balR),
          formatted: formatUnits(balR as any, metaR.decimals),
        }
      : undefined;

  return {
    vault: vaultAddress,
    feeBufferAddress,
    token0: {
      address: token0,
      symbol: meta0.symbol,
      decimals: meta0.decimals,
      raw: raw0,
      formatted: formatted0,
    },
    token1: {
      address: token1,
      symbol: meta1.symbol,
      decimals: meta1.decimals,
      raw: raw1,
      formatted: formatted1,
    },
    reward,
    fetchedAtMs: Date.now(),
  };
}
