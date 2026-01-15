import { getStrategyRegistryWrite } from "@/infra/evm/contracts/strategyRegistry";

export type RegisterStrategyPayload = {
  adapter: string;
  dexRouter: string;
  token0: string;
  token1: string;
  name: string;
  description: string;
};

export async function registerStrategyOnchain(params: {
  activeWallet: any;
  payload: RegisterStrategyPayload;
}) {
  const reg = await getStrategyRegistryWrite(params.activeWallet);

  const tx = await reg.registerStrategy(
    params.payload.adapter,
    params.payload.dexRouter,
    params.payload.token0,
    params.payload.token1,
    params.payload.name,
    params.payload.description
  );

  const receipt = await tx.wait();
  return { txHash: receipt?.hash || tx.hash };
}
