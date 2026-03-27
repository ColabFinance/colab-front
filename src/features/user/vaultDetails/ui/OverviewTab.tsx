"use client";

import React from "react";
import { Surface } from "@/presentation/components/Surface";
import type { VaultStatus } from "@/core/domain/vault/status";
import type { VaultDetails } from "@/core/domain/vault/types";
import type { VaultFeeBufferBalances } from "@/core/domain/vault/feeBuffer";
import type { VaultPerformanceData } from "../types";

type Props = {
  status: VaultStatus | null;
  details: VaultDetails | null;
  performance: VaultPerformanceData | null;
  feeBuffer: VaultFeeBufferBalances | null;
  registry: Record<string, any>;
  canManage: boolean;
  onOpenConfig: () => void;
};

function usd(value?: number | null, fractionDigits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

function num(value?: number | null, fractionDigits = 6) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

function percent(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(2)}%`;
}

function ts(seconds?: number | null) {
  if (!seconds) return "—";
  return new Date(seconds * 1000).toLocaleString();
}

function msLabel(value?: number | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function shortAddress(value?: string | null) {
  if (!value) return "—";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function OverviewTab({
  status,
  details,
  performance,
  feeBuffer,
  registry,
  canManage,
  onOpenConfig,
}: Props) {
  if (!status || !details) {
    return (
      <Surface variant="panel" className="p-6">
        <div className="text-lg font-semibold text-white">Vault data unavailable</div>
        <div className="mt-2 text-sm text-slate-400">
          Status and details are required to render the live overview.
        </div>
      </Surface>
    );
  }

  const performanceCurrent = performance?.current_value || {};
  const performanceProfit = performance?.profit || {};
  const performanceAnnual = performanceProfit.annualized || {};

  const kpis = [
    {
      label: "Total Value",
      value: usd(performanceCurrent.total_usd ?? status.holdings.totals.total_usd),
      meta: "Current live value",
      tone: "text-blue-300",
    },
    {
      label: "In Position",
      value: usd(
        performanceCurrent.in_position_usd ?? status.holdings.in_position.total_usd,
      ),
      meta: "Active liquidity",
      tone: "text-cyan-300",
    },
    {
      label: "Vault Idle",
      value: usd(
        performanceCurrent.vault_idle_usd ?? status.holdings.vault_idle.total_usd,
      ),
      meta: "Idle inside vault",
      tone: "text-white",
    },
    {
      label: "Uncollected Fees",
      value: usd(
        performanceCurrent.fees_uncollected_usd ?? status.fees_uncollected.usd,
        4,
      ),
      meta: "Pool fee estimate",
      tone: "text-green-300",
    },
    {
      label: "Pending Rewards",
      value: usd(
        performanceCurrent.rewards_pending_usd ??
          status.gauge_rewards.pending_usd_est,
        4,
      ),
      meta: status.has_gauge ? "Gauge reward estimate" : "No gauge",
      tone: "text-amber-300",
    },
    {
      label: "APR Annualized",
      value: percent(performanceAnnual.apr),
      meta: "Modified Dietz",
      tone: "text-green-300",
    },
    {
      label: "Range Status",
      value: status.out_of_range ? "Out of Range" : "Inside Range",
      meta: `Side: ${status.range_side}`,
      tone: status.out_of_range ? "text-red-300" : "text-green-300",
    },
    {
      label: "Last Rebalance",
      value: ts(status.last_rebalance_ts),
      meta: `Position #${status.position_token_id || 0}`,
      tone: "text-white",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <Surface
            key={item.label}
            variant="panel"
            className="border border-slate-800 bg-slate-900 p-4"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {item.label}
            </div>
            <div className={`mt-2 text-2xl font-semibold ${item.tone}`}>
              {item.value}
            </div>
            <div className="mt-1 text-xs text-slate-500">{item.meta}</div>
          </Surface>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Surface variant="panel" className="border border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Pool Overview
            </h3>

            {canManage ? (
              <button
                type="button"
                onClick={onOpenConfig}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
              >
                Manage
              </button>
            ) : null}
          </div>

          <div className="space-y-6 px-5 py-5">
            <section className="space-y-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Current range and position
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="relative h-16 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                  <div className="absolute inset-x-6 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-800" />
                  <div className="absolute left-[12%] right-[12%] top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="h-4 w-4 rounded-full border-4 border-slate-900 bg-white" />
                      <div className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium text-white">
                        {usd(status.prices.current.p_t1_t0, 6)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <ValueCard
                  label="Lower Price"
                  value={usd(status.prices.lower.p_t1_t0, 8)}
                />
                <ValueCard
                  label="Current Price"
                  value={usd(status.prices.current.p_t1_t0, 6)}
                  highlight
                />
                <ValueCard
                  label="Upper Price"
                  value={usd(status.prices.upper.p_t1_t0, 6)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InfoList
                  items={[
                    ["Current Tick", String(status.tick)],
                    ["Lower Tick", String(status.lower_tick)],
                    ["Upper Tick", String(status.upper_tick)],
                    ["Tick Spacing", String(status.tick_spacing)],
                    ["Pool", shortAddress(status.pool)],
                    ["NFPM", shortAddress(status.nfpm)],
                  ]}
                />

                <InfoList
                  items={[
                    ["Out of Range", status.out_of_range ? "Yes" : "No"],
                    ["Range Side", status.range_side],
                    ["Staked", status.staked ? "Yes" : "No"],
                    ["Position Location", status.position_location],
                    ["Gauge", shortAddress(status.gauge)],
                    ["Last Rebalance", ts(status.last_rebalance_ts)],
                  ]}
                />
              </div>
            </section>

            <div className="h-px bg-slate-800" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Holdings snapshot
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <HoldingSnapshotCard
                  title="Vault Idle"
                  totalUsd={status.holdings.vault_idle.total_usd}
                  token0Label={status.token0.symbol}
                  token0Value={status.holdings.vault_idle.token0}
                  token1Label={status.token1.symbol}
                  token1Value={status.holdings.vault_idle.token1}
                />

                <HoldingSnapshotCard
                  title="In Position"
                  totalUsd={status.holdings.in_position.total_usd}
                  token0Label={status.token0.symbol}
                  token0Value={status.holdings.in_position.token0}
                  token1Label={status.token1.symbol}
                  token1Value={status.holdings.in_position.token1}
                  tone="cyan"
                />

                <HoldingSnapshotCard
                  title="Total Holdings"
                  totalUsd={status.holdings.totals.total_usd}
                  token0Label={status.token0.symbol}
                  token0Value={status.holdings.totals.token0}
                  token1Label={status.token1.symbol}
                  token1Value={status.holdings.totals.token1}
                />
              </div>
            </section>

            <div className="h-px bg-slate-800" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fees and rewards
              </div>

              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <TokenAmountCard
                  symbol={status.token0.symbol}
                  label={`${status.token0.symbol} Uncollected`}
                  value={num(status.fees_uncollected.token0)}
                  meta="Pending pool fees"
                />
                <TokenAmountCard
                  symbol={status.token1.symbol}
                  label={`${status.token1.symbol} Uncollected`}
                  value={num(status.fees_uncollected.token1)}
                  meta="Pending pool fees"
                />
                <TokenAmountCard
                  symbol={status.gauge_rewards.reward_symbol}
                  label="Pending Reward"
                  value={num(status.gauge_rewards.pending_amount)}
                  meta={usd(status.gauge_rewards.pending_usd_est, 4)}
                  tone="cyan"
                />
                <TokenAmountCard
                  symbol={status.gauge_reward_balances.symbol}
                  label="Reward In Vault"
                  value={num(status.gauge_reward_balances.in_vault)}
                  meta="Current reward token balance"
                />
              </div>
            </section>

            <div className="h-px bg-slate-800" />

            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contract and configuration
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InfoList
                  items={[
                    ["Owner", shortAddress(details.owner)],
                    ["Executor", shortAddress(details.executor)],
                    ["Adapter", shortAddress(details.adapter)],
                    ["DEX Router", shortAddress(details.dexRouter)],
                    ["Fee Collector", shortAddress(details.feeCollector)],
                    ["Strategy ID", String(details.strategyId)],
                    ["Registry Version", String(registry.config?.version || "—")],
                  ]}
                />

                <InfoList
                  items={[
                    ["Automation Enabled", details.automationEnabled ? "Yes" : "No"],
                    ["Cooldown (sec)", String(details.cooldownSec)],
                    ["Max Slippage (bps)", String(details.maxSlippageBps)],
                    ["Allow Swap", details.allowSwap ? "Yes" : "No"],
                    ["Daily Harvest", details.dailyHarvestEnabled ? "Enabled" : "Disabled"],
                    ["Daily Harvest Cooldown", String(details.dailyHarvestCooldownSec || 0)],
                    ["Compound", details.compoundEnabled ? "Enabled" : "Disabled"],
                    ["Compound Cooldown", String(details.compoundCooldownSec || 0)],
                    ["Reward Swap", details.rewardSwap.enabled ? "Enabled" : "Disabled"],
                    ["Reward tokenIn", shortAddress(details.rewardSwap.tokenIn)],
                    ["Reward tokenOut", shortAddress(details.rewardSwap.tokenOut)],
                    ["Reward fee", String(details.rewardSwap.fee)],
                  ]}
                />
              </div>
            </section>
          </div>
        </Surface>

        <Surface variant="panel" className="border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-5 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Fee Buffer
            </h3>
          </div>

          {feeBuffer ? (
            <div className="space-y-3 px-5 py-5">
              <Row label="Fee Buffer Address" value={shortAddress(feeBuffer.feeBufferAddress)} />
              <Row label="Fetched At" value={msLabel(feeBuffer.fetchedAtMs)} />
              <div className="my-3 h-px bg-slate-800" />

              <FeeBufferTokenCard
                symbol={feeBuffer.token0.symbol}
                address={feeBuffer.token0.address}
                formatted={feeBuffer.token0.formatted}
              />

              <FeeBufferTokenCard
                symbol={feeBuffer.token1.symbol}
                address={feeBuffer.token1.address}
                formatted={feeBuffer.token1.formatted}
              />

              {feeBuffer.reward ? (
                <FeeBufferTokenCard
                  symbol={feeBuffer.reward.symbol}
                  address={feeBuffer.reward.address}
                  formatted={feeBuffer.reward.formatted}
                  tone="cyan"
                />
              ) : null}
            </div>
          ) : (
            <div className="px-5 py-5 text-sm text-slate-400">
              Fee buffer data unavailable for this vault.
            </div>
          )}
        </Surface>
      </div>
    </div>
  );
}

function ValueCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-cyan-500/20 bg-cyan-500/5"
          : "border-slate-800 bg-slate-950/60"
      }`}
    >
      <div className={`text-xs ${highlight ? "text-cyan-300" : "text-slate-500"}`}>
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-200">{value}</span>
    </div>
  );
}

function InfoList({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      {items.map(([label, value]) => (
        <Row key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function HoldingSnapshotCard({
  title,
  totalUsd,
  token0Label,
  token0Value,
  token1Label,
  token1Value,
  tone = "slate",
}: {
  title: string;
  totalUsd?: number | null;
  token0Label: string;
  token0Value?: number | null;
  token1Label: string;
  token1Value?: number | null;
  tone?: "slate" | "cyan";
}) {
  const palette =
    tone === "cyan"
      ? "border-cyan-500/20 bg-cyan-500/5"
      : "border-slate-800 bg-slate-950/60";

  return (
    <div className={`rounded-xl border p-4 ${palette}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-right">
          <div className="text-lg font-semibold text-white">{usd(totalUsd)}</div>
          <div className="text-[11px] text-slate-500">USD value</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Row label={token0Label} value={num(token0Value)} />
        <Row label={token1Label} value={num(token1Value)} />
      </div>
    </div>
  );
}

function TokenAmountCard({
  symbol,
  label,
  value,
  meta,
  tone = "slate",
}: {
  symbol: string;
  label: string;
  value: string;
  meta?: string;
  tone?: "slate" | "cyan";
}) {
  const palette =
    tone === "cyan"
      ? "border-cyan-500/20 bg-cyan-500/5 text-cyan-300"
      : "border-slate-800 bg-slate-950/60 text-slate-200";

  return (
    <div className={`flex items-center justify-between rounded-xl border p-3 ${palette}`}>
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full border border-slate-700 bg-slate-950 text-[11px] font-semibold text-white">
          {symbol.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="text-xs text-slate-500">{label}</div>
          {meta ? <div className="text-[11px] text-slate-500">{meta}</div> : null}
        </div>
      </div>

      <div className="text-right text-sm font-mono text-white">{value}</div>
    </div>
  );
}

function FeeBufferTokenCard({
  symbol,
  address,
  formatted,
  tone = "slate",
}: {
  symbol: string;
  address: string;
  formatted: string;
  tone?: "slate" | "cyan";
}) {
  const palette =
    tone === "cyan"
      ? "border-cyan-500/20 bg-cyan-500/5"
      : "border-slate-800 bg-slate-950/60";

  return (
    <div className={`rounded-xl border p-4 ${palette}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-white">{symbol}</div>
          <div className="mt-1 text-xs text-slate-500">{shortAddress(address)}</div>
        </div>

        <div className="text-right">
          <div className="text-sm font-mono text-white">{formatted}</div>
          <div className="mt-1 text-[11px] text-slate-500">Available in buffer</div>
        </div>
      </div>
    </div>
  );
}