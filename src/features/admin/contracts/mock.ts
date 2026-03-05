import { GlobalContract } from "./types";

export const GLOBAL_CONTRACTS: GlobalContract[] = [
  {
    key: "strategy-registry",
    name: "StrategyRegistry",
    status: "active",
    address: "0x48f5...29a1",
    owner: "0xAdmin...8f2a",
    ownerTag: "Multisig",
    version: "v1.2.4",
    lastSyncedLabel: "15 mins ago",
    counters: [
      { label: "Strategies", value: 24 },
      { label: "Pending", value: 8 },
      { label: "Active Vaults", value: 12 },
    ],
    timeline: [
      { title: "Deployed on Oct 24, 2023", subtitle: "Tx: 0x8a...9c21", kind: "success" },
      { title: "Ownership Transferred", subtitle: "To: 0xAdmin...8f2a", kind: "info" },
    ],
  },
  {
    key: "vault-factory",
    name: "VaultFactory",
    status: "active",
    address: "0x92ab...10c4",
    owner: "0xAdmin...8f2a",
    ownerTag: "Multisig",
    version: "v1.1.9",
    lastSyncedLabel: "2 hours ago",
    counters: [
      { label: "Factories", value: 1 },
      { label: "Vaults", value: 48 },
      { label: "Executors", value: 3 },
    ],
    timeline: [
      { title: "Deployed on Nov 02, 2023", subtitle: "Tx: 0x11...aa90", kind: "success" },
      { title: "Defaults Set", subtitle: "FeeCollector + Treasury updated", kind: "info" },
    ],
  },
  {
    key: "protocol-fee-collector",
    name: "ProtocolFeeCollector",
    status: "missing",
  },
  {
    key: "vault-fee-buffer",
    name: "VaultFeeBuffer",
    status: "active",
    address: "0x0bcd...e921",
    owner: "0xAdmin...8f2a",
    ownerTag: "Multisig",
    version: "v1.0.7",
    lastSyncedLabel: "1 day ago",
    counters: [
      { label: "Buffers", value: 1 },
      { label: "Tokens", value: 6 },
      { label: "Withdrawals", value: 14 },
    ],
    timeline: [
      { title: "Deployed on Dec 12, 2023", subtitle: "Tx: 0xfa...0021", kind: "success" },
      { title: "Allowlist Updated", subtitle: "Depositors + Executors", kind: "info" },
    ],
  },
];

export const CHAIN_LABEL = "Ethereum Mainnet";
export const CHAIN_SHORT = "Ethereum";