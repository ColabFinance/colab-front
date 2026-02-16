import type { ConnectedWallet } from "@privy-io/react-auth";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { getClientVaultContract } from "@/infra/evm/contracts/clientVault";
import { WalletTxResult } from "@/shared/types/tx";

export async function setAutomationEnabled(params: {
  wallet: ConnectedWallet;
  vaultAddress: string;
  enabled: boolean;
}): Promise<WalletTxResult> {
  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = await getClientVaultContract({ vaultAddress: params.vaultAddress, signer });

  const tx = await vault.setAutomationEnabled(Boolean(params.enabled));
  const receipt = await tx.wait();

  return { tx_hash: tx.hash as string, receipt };
}
