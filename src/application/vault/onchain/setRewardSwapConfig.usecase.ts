import type { ConnectedWallet } from "@privy-io/react-auth";
import { Contract, isAddress } from "ethers";

import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { ClientVaultAbi } from "@/infra/evm/abis/clientVault.abi";

export type OnchainTxResult = { tx_hash: string; receipt: any };

function parseUint24(v: string): number {
  const n = Number((v || "").trim());
  if (!Number.isFinite(n) || n < 0 || n > 0xffffff || Math.floor(n) !== n) {
    throw new Error("Invalid fee (uint24)");
  }
  return n;
}

function parseUint160(v: string): bigint {
  const t = (v || "").trim();
  if (!t) return 0n;
  // aceita "0" / decimal / hex "0x.."
  try {
    const bi = t.startsWith("0x") ? BigInt(t) : BigInt(String(Math.trunc(Number(t))));
    if (bi < 0n) throw new Error("sqrtPriceLimitX96 must be >= 0");
    // uint160 max:
    const max = (1n << 160n) - 1n;
    if (bi > max) throw new Error("sqrtPriceLimitX96 exceeds uint160");
    return bi;
  } catch {
    throw new Error("Invalid sqrtPriceLimitX96 (uint160)");
  }
}

export async function setRewardSwapConfigOnchain(params: {
  wallet: ConnectedWallet;
  vault: string;
  enabled: boolean;
  tokenIn: string;
  tokenOut: string;
  fee: string; // ex: "2500"
  sqrtPriceLimitX96?: string; // ex: "0"
}): Promise<OnchainTxResult> {
  if (!isAddress(params.vault)) throw new Error("Invalid vault address");

  const enabled = !!params.enabled;
  const tokenIn = (params.tokenIn || "").trim();
  const tokenOut = (params.tokenOut || "").trim();

  if (enabled) {
    if (!isAddress(tokenIn)) throw new Error("rewardSwap tokenIn invalid");
    if (!isAddress(tokenOut)) throw new Error("rewardSwap tokenOut invalid");
  }

  const fee = parseUint24(params.fee);
  const sqrt = parseUint160(params.sqrtPriceLimitX96 || "0");

  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = new Contract(params.vault, ClientVaultAbi, signer);

  const tx = await vault.setRewardSwapConfig(enabled, tokenIn || "0x0000000000000000000000000000000000000000", tokenOut || "0x0000000000000000000000000000000000000000", fee, sqrt);
  const receipt = await tx.wait();

  if (!receipt || receipt.status !== 1) throw new Error("setRewardSwapConfig transaction reverted");

  return { tx_hash: tx.hash as string, receipt };
}
