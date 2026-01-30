import type { ConnectedWallet } from "@privy-io/react-auth";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { getClientVaultContract } from "@/infra/evm/contracts/clientVault";
import type { WalletTxResult } from "@/application/vault/onchain/setAutomationEnabled.usecase";

export async function exitWithdrawAll(params: {
  wallet: ConnectedWallet;
  vaultAddress: string;
  to: string;
}): Promise<WalletTxResult> {
  const to = (params.to || "").trim();
  if (!to.startsWith("0x") || to.length !== 42) {
    throw new Error("Invalid withdraw address.");
  }

  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const vault = await getClientVaultContract({ vaultAddress: params.vaultAddress, signer });

  const tx = await vault.exitPositionAndWithdrawAll(to);
  const receipt = await tx.wait();

  return { tx_hash: tx.hash as string, receipt };
}
