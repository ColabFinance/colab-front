import { getStrategyRegistryWrite } from "@/infra/evm/contracts/strategyRegistry";

export async function allowStrategyAdapterUseCase(params: {
  activeWallet: any;
  adapter: string;
  allowed: boolean;
}) {
  const reg = await getStrategyRegistryWrite(params.activeWallet);

  const tx = await reg.setAdapterAllowed(params.adapter.trim(), params.allowed);
  const receipt = await tx.wait();

  return { txHash: receipt?.hash || tx.hash };
}
