import { getStrategyRegistryWrite } from "@/infra/evm/contracts/strategyRegistry";

export async function allowStrategyRouterUseCase(params: {
  activeWallet: any;
  router: string;
  allowed: boolean;
}) {
  const reg = await getStrategyRegistryWrite(params.activeWallet);

  const tx = await reg.setRouterAllowed(params.router.trim(), params.allowed);
  const receipt = await tx.wait();

  return { txHash: receipt?.hash || tx.hash };
}
