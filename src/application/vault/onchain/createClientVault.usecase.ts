import type { ConnectedWallet } from "@privy-io/react-auth";
import { Contract, isAddress, Interface } from "ethers";

import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";
import { VaultFactoryAbi } from "@/infra/evm/abis/vaultFactory.abi";
import { getActiveChainRuntime } from "@/shared/config/chainRuntime";
import { getCachedContractRegistry, loadContractRegistry } from "@/infra/api-lp/contractRegistry";

export type CreateClientVaultOnchainResult = {
  tx_hash: string;
  receipt: any;
  vault_address: string;
};

function extractVaultFromReceipt(params: { receipt: any; factoryAddr: string }): string {
  const { receipt, factoryAddr } = params;
  const logs = receipt?.logs || [];
  const iface = new Interface(VaultFactoryAbi);

  for (const lg of logs) {
    if (!lg?.address || lg.address.toLowerCase() !== factoryAddr.toLowerCase()) continue;

    try {
      const parsed = iface.parseLog({ topics: lg.topics, data: lg.data });
      if (parsed?.name !== "ClientVaultDeployed") continue;

      const vault = parsed.args?.vault as string;
      if (vault && isAddress(vault)) return vault;
    } catch {
      continue;
    }
  }

  throw new Error("ClientVaultDeployed event not found in receipt (factory log not parsed)");
}

async function fallbackVaultFromOwnerList(params: { factory: Contract; owner: string }): Promise<string> {
  const vaults = (await params.factory.getVaultsByOwner(params.owner)) as string[];
  if (!Array.isArray(vaults) || vaults.length === 0) {
    throw new Error("Factory.getVaultsByOwner returned empty list (cannot fallback vault address)");
  }
  const last = vaults[vaults.length - 1];
  if (!last || !isAddress(last)) {
    throw new Error("Factory.getVaultsByOwner returned invalid last vault address");
  }
  return last;
}

export async function createClientVaultOnchain(params: {
  wallet: ConnectedWallet;
  strategyId: number;
  owner: string;
}): Promise<CreateClientVaultOnchainResult> {
  if (!isAddress(params.owner)) throw new Error("Invalid owner address");

  const signer = await getEvmSignerFromPrivyWallet(params.wallet);
  const rt = await getActiveChainRuntime();

  let reg = getCachedContractRegistry(rt.chainKey);
  if (!reg) reg = await loadContractRegistry(rt.chainKey);

  const factoryAddr = reg?.data?.vault_factory?.address;
  if (!factoryAddr || !isAddress(factoryAddr)) throw new Error("VaultFactory address not available");

  const factory = new Contract(factoryAddr, VaultFactoryAbi, signer);

  const tx = await factory.createClientVault(params.strategyId, params.owner);
  const receipt = await tx.wait();

  if (!receipt || receipt.status !== 1) {
    throw new Error("CreateClientVault transaction reverted");
  }

  let vaultAddress = "";
  try {
    vaultAddress = extractVaultFromReceipt({ receipt, factoryAddr });
  } catch {
    // IMPORTANT: fallback if event parsing fails (factory changed / log shape changed)
    vaultAddress = await fallbackVaultFromOwnerList({ factory, owner: params.owner });
  }

  return {
    tx_hash: tx.hash as string,
    receipt,
    vault_address: vaultAddress,
  };
}
