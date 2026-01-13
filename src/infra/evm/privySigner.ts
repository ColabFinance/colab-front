import type { ConnectedWallet } from "@privy-io/react-auth";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { CONFIG } from "@/shared/config/env";

function isBrowser() {
  return typeof window !== "undefined";
}

function getWindowEthereum(): any {
  if (!isBrowser()) return null;
  return (window as any).ethereum ?? null;
}

function toHexChainId(chainId: number) {
  return "0x" + chainId.toString(16);
}

async function ensureChain(provider: BrowserProvider) {
  const net = await provider.getNetwork();
  const current = Number(net.chainId);
  const target = Number(CONFIG.chain.id);

  if (current === target) return;

  const eth = getWindowEthereum();
  if (!eth) {
    throw new Error(`Wrong network (current=${current}). Please switch to ${CONFIG.chain.name}.`);
  }

  const targetHex = toHexChainId(target);

  try {
    // ask wallet to switch
    await provider.send("wallet_switchEthereumChain", [{ chainId: targetHex }]);
  } catch (e: any) {
    // chain not added in metamask
    if (e?.code === 4902) {
      await provider.send("wallet_addEthereumChain", [
        {
          chainId: targetHex,
          chainName: CONFIG.chain.name,
          nativeCurrency: CONFIG.chain.nativeCurrency,
          rpcUrls: [CONFIG.rpcUrl],
          blockExplorerUrls: CONFIG.chain.blockExplorers?.length ? CONFIG.chain.blockExplorers : undefined,
        },
      ]);
      // after add, switch again
      await provider.send("wallet_switchEthereumChain", [{ chainId: targetHex }]);
      return;
    }
    throw e;
  }
}

async function getSignerFromWindowEthereum(expectedAddress?: string): Promise<JsonRpcSigner> {
  const eth = getWindowEthereum();
  if (!eth) {
    throw new Error("No injected wallet found (window.ethereum). Install/enable MetaMask.");
  }

  const provider = new BrowserProvider(eth);

  // ensure correct chain BEFORE requesting signature/tx
  await ensureChain(provider);

  const accounts = await provider.send("eth_requestAccounts", []);
  const acc0 = (accounts?.[0] || "").toLowerCase();

  if (expectedAddress && acc0 && acc0 !== expectedAddress.toLowerCase()) {
    throw new Error(
      `MetaMask active account (${acc0}) differs from selected wallet (${expectedAddress.toLowerCase()}). Switch account in MetaMask.`
    );
  }

  return await provider.getSigner();
}

export async function getEvmSignerFromPrivyWallet(wallet: ConnectedWallet): Promise<JsonRpcSigner> {
  if (!wallet?.address) throw new Error("Missing wallet address.");

  // 1) Privy embedded wallets usually expose getEthereumProvider()
  const maybeGetProvider = (wallet as any)?.getEthereumProvider;
  if (typeof maybeGetProvider === "function") {
    const eip1193 = await (wallet as any).getEthereumProvider();
    const provider = new BrowserProvider(eip1193);

    await ensureChain(provider);

    return await provider.getSigner();
  }

  // 2) External wallets (MetaMask) fallback to injected provider
  return await getSignerFromWindowEthereum(wallet.address);
}
