import type { ContractDefinition } from "./types";

const gasStrategyOptions = [
  { value: "default", label: "Default" },
  { value: "buffered", label: "Buffered" },
  { value: "aggressive", label: "Aggressive" },
];

const booleanOptions = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
];

export const CONTRACT_DEFINITIONS: ContractDefinition[] = [
  {
    key: "strategy-registry",
    name: "StrategyRegistry",
    description: "Registry for all approved strategy logic contracts.",
    deployFields: [
      {
        id: "gas_strategy",
        label: "Gas Strategy",
        type: "select",
        defaultValue: "buffered",
        options: gasStrategyOptions,
      },
      {
        id: "initial_owner",
        label: "Initial Owner/Admin Wallet",
        type: "text",
        required: true,
        placeholder: "0x...",
        helperText: "Owner that will control the deployed contract.",
      },
    ],
    registerTitle: "Register Existing StrategyRegistry",
    registerDescription:
      "Backend register/list endpoints were not sent yet. This tab is ready for wiring when those endpoints are available.",
  },
  {
    key: "vault-factory",
    name: "VaultFactory",
    description: "Factory responsible for creating and wiring new client vaults.",
    deployFields: [
      {
        id: "gas_strategy",
        label: "Gas Strategy",
        type: "select",
        defaultValue: "buffered",
        options: gasStrategyOptions,
      },
      {
        id: "initial_owner",
        label: "Initial Owner/Admin Wallet",
        type: "text",
        required: true,
        placeholder: "0x...",
      },
      {
        id: "strategy_registry",
        label: "Strategy Registry Address",
        type: "text",
        required: true,
        placeholder: "0x...",
      },
      {
        id: "executor",
        label: "Executor Address",
        type: "text",
        required: true,
        placeholder: "0x...",
      },
      {
        id: "fee_collector",
        label: "Fee Collector Address",
        type: "text",
        defaultValue: "0x0000000000000000000000000000000000000000",
        placeholder: "0x...",
      },
      {
        id: "default_cooldown_sec",
        label: "Default Cooldown (sec)",
        type: "number",
        defaultValue: 1,
      },
      {
        id: "default_max_slippage_bps",
        label: "Default Max Slippage (bps)",
        type: "number",
        defaultValue: 50,
      },
      {
        id: "default_allow_swap",
        label: "Default Allow Swap",
        type: "boolean",
        defaultValue: true,
        options: booleanOptions,
      },
    ],
    registerTitle: "Register Existing VaultFactory",
    registerDescription:
      "Backend register/list endpoints were not sent yet. This tab is ready for wiring when those endpoints are available.",
  },
  {
    key: "protocol-fee-collector",
    name: "ProtocolFeeCollector",
    description: "Collects protocol fees and routes them to the configured treasury.",
    deployFields: [
      {
        id: "gas_strategy",
        label: "Gas Strategy",
        type: "select",
        defaultValue: "buffered",
        options: gasStrategyOptions,
      },
      {
        id: "initial_owner",
        label: "Initial Owner/Admin Wallet",
        type: "text",
        required: true,
        placeholder: "0x...",
      },
      {
        id: "treasury",
        label: "Treasury Address",
        type: "text",
        required: true,
        placeholder: "0x...",
      },
      {
        id: "protocol_fee_bps",
        label: "Protocol Fee (bps)",
        type: "number",
        required: true,
        defaultValue: 100,
        helperText: "Allowed range from backend: 0 to 5000.",
      },
    ],
    registerTitle: "Register Existing ProtocolFeeCollector",
    registerDescription:
      "Backend register/list endpoints were not sent yet. This tab is ready for wiring when those endpoints are available.",
  },
  {
    key: "vault-fee-buffer",
    name: "VaultFeeBuffer",
    description: "Intermediate fee buffer used by vaults before treasury distribution.",
    deployFields: [
      {
        id: "gas_strategy",
        label: "Gas Strategy",
        type: "select",
        defaultValue: "buffered",
        options: gasStrategyOptions,
      },
      {
        id: "initial_owner",
        label: "Initial Owner/Admin Wallet",
        type: "text",
        required: true,
        placeholder: "0x...",
      },
    ],
    registerTitle: "Register Existing VaultFeeBuffer",
    registerDescription:
      "Backend register/list endpoints were not sent yet. This tab is ready for wiring when those endpoints are available.",
  },
];

export const INITIAL_MODE_BY_TAB = {
  "strategy-registry": "deploy",
  "vault-factory": "deploy",
  "protocol-fee-collector": "deploy",
  "vault-fee-buffer": "deploy",
} as const;