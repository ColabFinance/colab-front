import { JsonRpcProvider } from "ethers";
import { CONFIG } from "@/shared/config/env";

export function getReadProvider() {
  return new JsonRpcProvider(CONFIG.rpcUrl);
}
