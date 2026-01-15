import type { ConnectedWallet } from "@privy-io/react-auth";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { getActiveChainRuntime } from "@/shared/config/chainRuntime";

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

async function ensureChain(provider: BrowserProvider, targetChainId: number) {
  const net = await provider.getNetwork();
  const current = Number(net.chainId);

  if (current === targetChainId) return;

  const eth = getWindowEthereum();
  if (!eth) {
    throw new Error(`Wrong network (current=${current}). Please switch to chainId=${targetChainId}.`);
  }

  const targetHex = toHexChainId(targetChainId);

  // tenta só switch (não tenta add — pq você não tem os detalhes aqui)
  await provider.send("wallet_switchEthereumChain", [{ chainId: targetHex }]);
}

async function getSignerFromWindowEthereum(expectedAddress?: string): Promise<JsonRpcSigner> {
  const eth = getWindowEthereum();
  if (!eth) {
    throw new Error("No injected wallet found (window.ethereum). Install/enable MetaMask.");
  }

  const provider = new BrowserProvider(eth);

  // usa a chain ativa detectada (MetaMask) como target
  const rt = await getActiveChainRuntime();
  await ensureChain(provider, rt.chainId);

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

    // const rt = await getActiveChainRuntime();
    // await ensureChain(provider, rt.chainId);
    // embedded: não usa getActiveChainRuntime()
    return await provider.getSigner();
  }

  // 2) External wallets (MetaMask) fallback to injected provider
  return await getSignerFromWindowEthereum(wallet.address);
}
