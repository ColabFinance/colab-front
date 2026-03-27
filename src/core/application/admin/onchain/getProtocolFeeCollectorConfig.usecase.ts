import { getProtocolFeeCollectorRead } from "@/core/infra/evm/contracts/protocolFeeCollector";

function getContractAddress(c: any): string {
  return (c?.target as string) || (c?.address as string) || "";
}

export async function getProtocolFeeCollectorConfigUseCase() {
  const c = await getProtocolFeeCollectorRead();

  const [treasury, protocolFeeBps, owner] = await Promise.all([
    c.treasury(),
    c.protocolFeeBps(),
    typeof c.owner === "function" ? c.owner() : Promise.resolve(""),
  ]);

  return {
    contractAddress: getContractAddress(c),
    ownerAddress: String(owner || ""),
    treasuryAddress: String(treasury || ""),
    feeBps: Number(protocolFeeBps),
  };
}