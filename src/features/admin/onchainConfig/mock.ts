import {
  AdapterAllowlistItem,
  ChainOption,
  DepositorItem,
  ProtocolFeeCollectorConfig,
  ReporterItem,
  RouterAllowlistItem,
  VaultFactoryConfig,
} from "./types";

export const CHAINS: ChainOption[] = [
  { chainId: 1, name: "Ethereum" },
  { chainId: 8453, name: "Base" },
  { chainId: 10, name: "Optimism" },
];

export const MOCK_ROUTERS: RouterAllowlistItem[] = [
  {
    id: "router_uniswap_v3",
    name: "Uniswap V3 Router",
    address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    status: "active",
  },
  {
    id: "router_curve",
    name: "Curve Router",
    address: "0x99a58482BD75cbab83b27EC03CA68fF489b5788f",
    status: "active",
  },
];

export const MOCK_ADAPTERS: AdapterAllowlistItem[] = [
  {
    id: "adapter_uniswap_v3_swap",
    label: "Uniswap V3 Swap",
    adapterType: "Swap/Mint",
    address: "0x7a25d5630B4cF539739dF2C5dAcb4c659F2488D",
    status: "active",
  },
  {
    id: "adapter_aave_v3_supply",
    label: "Aave V3 Supply",
    adapterType: "Lending",
    address: "0x4b12F0cA9dA4dD31aAaaBbbbCcccDdDdEeE9e21",
    status: "active",
  },
];

export const MOCK_VAULT_FACTORY: VaultFactoryConfig = {
  contractAddress: "0x1234567890abcdef1234567890abcdef1234abcd",
  timelockAddress: "0x82a00000000000000000000000000000000091b2",

  executorAddress: "0x1234000000000000000000000000000000005678",
  feeCollectorAddress: "0x8765000000000000000000000000000000004321",

  cooldownSec: 86400,
  slippageBps: 50,
  feeBps: 100,
  compoundEnabled: true,
};

export const MOCK_PROTOCOL_FEE: ProtocolFeeCollectorConfig = {
  contractAddress: "0xabcDEFabcdefABCdefABCDEFabcdefABCdefABCD",
  treasuryAddress: "0xTreasury00000000000000000000000000000Addr",
  feeBps: 500,
};

export const MOCK_REPORTERS: ReporterItem[] = [
  { id: "rep_1", address: "0xAbCd000000000000000000000000000000Ef01", addedAtLabel: "Added 2 days ago" },
  { id: "rep_2", address: "0x1234000000000000000000000000000000005678", addedAtLabel: "Added 1 week ago" },
];

export const MOCK_DEPOSITORS: DepositorItem[] = [
  { id: "dep_1", address: "0xFeEb000000000000000000000000000000uFfE", label: "Main Buffer Distributor" },
  { id: "dep_2", address: "0xAuTo0000000000000000000000000000CoMp", label: "Auto Compounder Bot" },
];