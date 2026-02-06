import type { ConnectedWallet } from "@privy-io/react-auth";
import { isAddress, parseUnits } from "ethers";

import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { getClientVaultContract } from "@/infra/evm/contracts/clientVault";
import type { WalletTxResult } from "@/application/vault/onchain/setAutomationEnabled.usecase";

function _assertAddr(a: string, label: string) {
  const v = (a || "").trim();
  if (!isAddress(v)) throw new Error(`Invalid ${label}.`);
  return v;
}

function _toBigIntSafe(v: unknown, label: string): bigint {
  const s = String(v ?? "").trim();
  if (!s) return 0n;
  try {
    return BigInt(s);
  } catch {
    throw new Error(`Invalid ${label} (must be uint as string).`);
  }
}

export async function swapExactInPancake(params: {
  wallet: ConnectedWallet;
  vaultAddress: string;

  token_in: string;
  token_out: string;
  fee: number | string; // uint24

  amount_in_human: string; // "1.23"
  decimals_in: number; // 18, 6, etc

  amount_out_min: string; // raw uint256 string (ex: "0")
  sqrt_price_limit_x96: string; // raw uint160 string (ex: "0")
}): Promise<WalletTxResult> {
  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = await getClientVaultContract({ vaultAddress: params.vaultAddress, signer });

  const tokenIn = _assertAddr(params.token_in, "token_in");
  const tokenOut = _assertAddr(params.token_out, "token_out");

  const fee = Number(String(params.fee ?? "0").trim());
  if (!Number.isFinite(fee) || fee < 0 || fee > 0xffffff || Math.floor(fee) !== fee) {
    throw new Error("Invalid fee (uint24).");
  }

  const dec = Number(params.decimals_in ?? 18);
  if (!Number.isFinite(dec) || dec < 0 || dec > 255 || Math.floor(dec) !== dec) {
    throw new Error("Invalid decimals_in.");
  }

  const amountInRaw = parseUnits(String(params.amount_in_human ?? "0").trim(), dec);

  const amountOutMin = _toBigIntSafe(params.amount_out_min, "amount_out_min");
  const sqrtLimit = _toBigIntSafe(params.sqrt_price_limit_x96, "sqrt_price_limit_x96");

  const tx = await vault.swapExactInPancake(
    tokenIn,
    tokenOut,
    fee,
    amountInRaw,
    amountOutMin,
    sqrtLimit
  );

  const receipt = await tx.wait();
  return { tx_hash: tx.hash as string, receipt };
}
