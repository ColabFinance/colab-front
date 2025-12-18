import { BrowserProvider } from "ethers";
import type { Wallet } from "@privy-io/react-auth";

// retorna signer EIP-1193 (Privy ou Metamask via Privy)
export async function getEthersSignerFromPrivyWallet(wallet: Wallet) {
  const provider = await wallet.getEthereumProvider();
  const ethersProvider = new BrowserProvider(provider);
  return ethersProvider.getSigner();
}
