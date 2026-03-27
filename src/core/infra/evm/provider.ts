import { JsonRpcProvider } from "ethers";
import { getRpcUrl } from "@/shared/config/env";
import { getActiveChainRuntime } from "@/shared/config/chainRuntime";

const providerCache: Record<string, JsonRpcProvider> = {};

export async function getReadProvider() {
  const rt = await getActiveChainRuntime();
  const rpcUrl = getRpcUrl(rt.chainKey);

  const key = `${rt.chainKey}:${rpcUrl}`;
  if (!providerCache[key]) {
    providerCache[key] = new JsonRpcProvider(rpcUrl);
  }
  return providerCache[key];
}
