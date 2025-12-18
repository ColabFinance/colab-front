import type { ConnectedWallet } from "@privy-io/react-auth";
import { BrowserProvider, type Eip1193Provider } from "ethers";

export function assertWalletReady(wallet?: ConnectedWallet | null) {
  if (!wallet) throw new Error("Wallet not connected.");
  if (!wallet.address) throw new Error("Wallet address not available.");
}

/**
 * Returns an ethers v6 Signer for a Privy-connected wallet.
 *
 * Privy wallets expose an EIP-1193 provider via `getEthereumProvider()`.
 * We wrap it with `ethers.BrowserProvider` and then fetch a signer.
 */
export async function getEvmSignerFromPrivyWallet(wallet: ConnectedWallet) {
  assertWalletReady(wallet);

  const ethProvider = (await (wallet as any).getEthereumProvider?.()) as Eip1193Provider | undefined;
  if (!ethProvider) {
    throw new Error("This wallet does not expose getEthereumProvider(). Check Privy wallet type.");
  }

  const provider = new BrowserProvider(ethProvider);
  return await provider.getSigner();
}
