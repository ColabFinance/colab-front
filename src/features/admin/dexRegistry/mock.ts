import { DexRegistryItem } from "./types";

export const CHAINS = [
  { chainId: 1, name: "Ethereum" },
  { chainId: 10, name: "Optimism" },
] as const;

export const MOCK_DEXES: DexRegistryItem[] = [
  {
    id: "dex_uniswap_v3_eth",
    chainId: 1,
    name: "Uniswap V3",
    key: "uniswap_v3",
    routerAddress: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    quoterAddress: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
    positionManagerAddress: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    poolTypes: ["CONCENTRATED", "V3"],
    enabled: true,
    verification: "verified",
    updatedAtLabel: "Updated 2h ago",
  },
  {
    id: "dex_curve_eth",
    chainId: 1,
    name: "Curve Finance",
    key: "curve_v2",
    routerAddress: "0x99a58482BD75cbab83b27EC03CA68fF489b5788f",
    poolTypes: ["STABLE", "VOLATILE_V2"],
    enabled: true,
    verification: "verified",
    updatedAtLabel: "Updated 1d ago",
  },
  {
    id: "dex_balancer_eth",
    chainId: 1,
    name: "Balancer V2",
    key: "balancer_v2",
    routerAddress: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
    poolTypes: ["WEIGHTED", "STABLE"],
    enabled: false,
    verification: "pending",
    updatedAtLabel: "Updated 5d ago",
  },
  {
    id: "dex_example_op",
    chainId: 10,
    name: "Example DEX (OP)",
    key: "example_op",
    routerAddress: "0x1111111111111111111111111111111111111111",
    poolTypes: ["VOLATILE"],
    enabled: true,
    verification: "pending",
    updatedAtLabel: "Updated 3d ago",
  },
];