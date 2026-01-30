import type { ConnectedWallet } from "@privy-io/react-auth";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { getClientVaultContract } from "@/infra/evm/contracts/clientVault";
import type { WalletTxResult } from "@/application/vault/onchain/setAutomationEnabled.usecase";

function _assertAddr(a: string, label: string) {
  const v = (a || "").trim();
  if (!v.startsWith("0x") || v.length !== 42) throw new Error(`Invalid ${label}.`);
  return v;
}

export async function swapExactInPancake(params: {
  wallet: ConnectedWallet;
  vaultAddress: string;

  token_in: string;
  token_out: string;
  fee: number; // uint24
  amount_in: string | number; // uint256
  amount_out_min: string | number; // uint256
  sqrt_price_limit_x96: string | number; // uint160
}): Promise<WalletTxResult> {
  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = await getClientVaultContract({ vaultAddress: params.vaultAddress, signer });

  const tokenIn = _assertAddr(params.token_in, "token_in");
  const tokenOut = _assertAddr(params.token_out, "token_out");

  const fee = Number(params.fee || 0);
  if (!Number.isFinite(fee) || fee < 0) throw new Error("Invalid fee.");

  const tx = await vault.swapExactInPancake(
    tokenIn,
    tokenOut,
    fee,
    params.amount_in ?? 0,
    params.amount_out_min ?? 0,
    params.sqrt_price_limit_x96 ?? 0,
  );

  const receipt = await tx.wait();
  return { tx_hash: tx.hash as string, receipt };
}
