import type { ConnectedWallet } from "@privy-io/react-auth";
import { Contract, isAddress } from "ethers";

import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { ClientVaultAbi } from "@/infra/evm/abis/clientVault.abi";

export type OnchainTxResult = { tx_hash: string; receipt: any };

export async function setCompoundConfigOnchain(params: {
  wallet: ConnectedWallet;
  vault: string;
  enabled: boolean;
  cooldownSec: number;
}): Promise<OnchainTxResult> {
  if (!isAddress(params.vault)) throw new Error("Invalid vault address");

  const cd = Number(params.cooldownSec);
  if (!Number.isFinite(cd) || cd < 0 || cd > 0xffffffff || Math.floor(cd) !== cd) {
    throw new Error("Invalid compound cooldownSec (uint32)");
  }

  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = new Contract(params.vault, ClientVaultAbi, signer);

  const tx = await vault.setCompoundConfig(!!params.enabled, cd);
  const receipt = await tx.wait();

  if (!receipt || receipt.status !== 1) throw new Error("setCompoundConfig transaction reverted");

  return { tx_hash: tx.hash as string, receipt };
}
