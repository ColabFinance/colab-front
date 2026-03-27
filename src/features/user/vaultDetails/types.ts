import type { VaultStatus } from "@/core/domain/vault/status";
import type { VaultDetails as OnchainVaultDetails } from "@/core/domain/vault/types";
import type { VaultUserEvent } from "@/core/domain/vault/events";
import type { VaultFeeBufferBalances } from "@/core/domain/vault/feeBuffer";

export type VaultTabKey = "overview" | "performance" | "events";
export type VaultDrawerKey = "deposit" | "withdraw" | "compoundBuffer" | null;

export type ActionFeedback = {
  kind: "idle" | "loading" | "success" | "error";
  message?: string;
  txHash?: string;
};

export type VaultPerformanceEpisode = {
  id?: string | null;
  status: string;
  open_time: number;
  open_time_iso?: string | null;
  close_time?: number | null;
  close_time_iso?: string | null;
  open_price?: number | null;
  close_price?: number | null;
  Pa?: number | null;
  Pb?: number | null;
  pool_type?: string | null;
  mode_on_open?: string | null;
  majority_on_open?: string | null;
  last_event_bar?: number | null;
  metrics?: Record<string, any> | null;
};

export type VaultPerformanceData = {
  vault?: {
    address?: string;
    alias?: string;
    dex?: string;
    chain?: string;
    owner?: string;
    strategy_id?: number;
    config?: Record<string, any>;
  };
  cashflows_totals?: {
    deposited_usd?: number | null;
    withdrawn_usd?: number | null;
    net_contributed_usd?: number | null;
    missing_usd_count?: number;
  };
  current_value?: {
    total_usd?: number | null;
    in_position_usd?: number | null;
    vault_idle_usd?: number | null;
    fees_uncollected_usd?: number | null;
    rewards_pending_usd?: number | null;
    source?: string;
  };
  gas_costs?: {
    total_gas_usd?: number;
    tx_count?: number;
  };
  profit?: {
    profit_usd?: number | null;
    profit_pct?: number | null;
    profit_net_gas_usd?: number | null;
    profit_net_gas_pct?: number | null;
    annualized?: {
      apr?: number | null;
      apy_daily_compound?: number | null;
      days?: number | null;
    };
  };
  episodes?: {
    items?: VaultPerformanceEpisode[];
    total?: number | null;
  };
};

export type VaultHeaderView = {
  title: string;
  pairLabel: string;
  chainLabel: string;
  dexLabel: string;
  vaultAddress: string;
  poolAddress: string;
  statusLabel: string;
  updatedLabel: string;
  token0Symbol: string;
  token1Symbol: string;
};

export type DepositAssetOption = {
  symbol: string;
  address: string;
  decimals: number;
};

export type OwnerConfigFormState = {
  automationEnabled: boolean;
  cooldownSec: number;
  maxSlippageBps: number;
  allowSwap: boolean;

  dailyHarvestEnabled: boolean;
  dailyHarvestCooldownSec: number;

  compoundEnabled: boolean;
  compoundCooldownSec: number;

  rewardSwapEnabled: boolean;
  rewardSwapTokenIn: string;
  rewardSwapTokenOut: string;
  rewardSwapFee: number;
  rewardSwapSqrtPriceLimitX96: string;
};

export type VaultResolvedData = {
  status: VaultStatus | null;
  details: OnchainVaultDetails | null;
  performance: VaultPerformanceData | null;
  feeBuffer: VaultFeeBufferBalances | null;
  events: VaultUserEvent[];
};