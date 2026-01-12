import { JsonRpcProvider } from "ethers";
import { CONFIG } from "@/shared/config/env";

let _provider: JsonRpcProvider | null = null;

export function getReadProvider() {
  if (_provider) return _provider;
  _provider = new JsonRpcProvider(CONFIG.rpcUrl);
  return _provider;
}
