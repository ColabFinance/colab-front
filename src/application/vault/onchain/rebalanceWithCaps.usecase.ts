import type { ConnectedWallet } from "@privy-io/react-auth";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { getClientVaultContract } from "@/infra/evm/contracts/clientVault";
import type { WalletTxResult } from "@/application/vault/onchain/setAutomationEnabled.usecase";

export async function rebalanceWithCaps(params: {
  wallet: ConnectedWallet;
  vaultAddress: string;
  lower_tick: number;
  upper_tick: number;
  cap0: string | number; // raw token0 units (uint256)
  cap1: string | number; // raw token1 units (uint256)
}): Promise<WalletTxResult> {
  const lower = Number(params.lower_tick);
  const upper = Number(params.upper_tick);
  if (!Number.isFinite(lower) || !Number.isFinite(upper) || lower >= upper) {
    throw new Error("Invalid tick range. Expected lower_tick < upper_tick.");
  }

  const cap0 = params.cap0 ?? 0;
  const cap1 = params.cap1 ?? 0;

  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = getClientVaultContract({ vaultAddress: params.vaultAddress, signer });

  const tx = await vault.rebalanceWithCaps(lower, upper, cap0, cap1);
  const receipt = await tx.wait();

  return { tx_hash: tx.hash as string, receipt };
}
