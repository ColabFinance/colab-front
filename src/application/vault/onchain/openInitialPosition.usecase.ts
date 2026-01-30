import type { ConnectedWallet } from "@privy-io/react-auth";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { getClientVaultContract } from "@/infra/evm/contracts/clientVault";
import type { WalletTxResult } from "@/application/vault/onchain/setAutomationEnabled.usecase";

export async function openInitialPosition(params: {
  wallet: ConnectedWallet;
  vaultAddress: string;
  lower_tick: number;
  upper_tick: number;
}): Promise<WalletTxResult> {
  const lower = Number(params.lower_tick);
  const upper = Number(params.upper_tick);
  if (!Number.isFinite(lower) || !Number.isFinite(upper) || lower >= upper) {
    throw new Error("Invalid tick range. Expected lower_tick < upper_tick.");
  }

  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = await getClientVaultContract({ vaultAddress: params.vaultAddress, signer });

  const tx = await vault.openInitialPosition(lower, upper);
  const receipt = await tx.wait();

  return { tx_hash: tx.hash as string, receipt };
}
