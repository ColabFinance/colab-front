import { Contract } from "ethers";
import { getReadProvider } from "@/infra/evm/provider";
import { ProtocolFeeCollectorAbi } from "@/infra/evm/abis/protocolFeeCollector.abi";
import { getCachedContractRegistry, loadContractRegistry } from "@/infra/api-lp/contractRegistry";
import { getActiveChainRuntime } from "@/shared/config/chainRuntime";
import { getEvmSignerFromPrivyWallet } from "@/infra/evm/privySigner";

function assertRegistryHasProtocolFeeCollector(reg: any) {
  if (!reg?.data?.protocol_fee_collector?.address) {
    throw new Error(
      "Assert PFC: Contract not loaded: data.protocol_fee_collector.address"
    );
  }
}

async function resolveProtocolFeeCollectorAddress(): Promise<string> {
  const rt = await getActiveChainRuntime();

  let reg = getCachedContractRegistry(rt.chainKey);
  if (!reg) reg = await loadContractRegistry(rt.chainKey);

  assertRegistryHasProtocolFeeCollector(reg);
  return reg.data.protocol_fee_collector.address;
}

export async function getProtocolFeeCollectorRead() {
  const addr = await resolveProtocolFeeCollectorAddress();
  const provider = await getReadProvider();
  return new Contract(addr, ProtocolFeeCollectorAbi, provider);
}

export async function getProtocolFeeCollectorWrite(activeWallet: any) {
  const addr = await resolveProtocolFeeCollectorAddress();
  if (!activeWallet) throw new Error("Missing active wallet (Privy).");

  const signer = await getEvmSignerFromPrivyWallet(activeWallet);
  return new Contract(addr, ProtocolFeeCollectorAbi, signer);
}
