export const CONFIG = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || "8453"),
  contracts: {
    strategyRegistry: process.env.NEXT_PUBLIC_STRATEGY_REGISTRY_ADDRESS!,
    vaultFactory: process.env.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS!,
    adapter: process.env.NEXT_PUBLIC_ADAPTER_ADDRESS!,
    feeCollector: process.env.NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS!,
  },
  apiLpBaseUrl: process.env.NEXT_PUBLIC_API_LP_BASE_URL || "http://127.0.0.1:8000/api"
};
