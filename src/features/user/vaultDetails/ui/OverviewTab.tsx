"use client";

import React from "react";
import { Surface } from "@/presentation/components/Surface";
import { VaultDetails, VaultRange, VaultTone } from "../types";

function usd(value: number, maxFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

function num(value: number, maxFractionDigits = 8) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

function shortAddress(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function toneClasses(tone?: VaultTone) {
  if (tone === "green") return "text-green-300";
  if (tone === "cyan") return "text-cyan-300";
  if (tone === "blue") return "text-blue-300";
  if (tone === "amber") return "text-amber-300";
  if (tone === "red") return "text-red-300";
  return "text-white";
}

function PositionBar({ range }: { range: VaultRange }) {
  const currentPct = Math.min(Math.max((range.bandStartPct + range.bandEndPct) / 2, 0), 100);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="relative h-16 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
        <div className="absolute inset-x-6 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-800" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
          style={{
            left: `${range.bandStartPct}%`,
            width: `${range.bandEndPct - range.bandStartPct}%`,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${currentPct}%` }}
        >
          <div className="relative -translate-x-1/2">
            <div className="h-4 w-4 rounded-full border-4 border-slate-900 bg-white" />
            <div className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium text-white">
              {usd(range.currentPrice, 4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OverviewTab({ data }: { data: VaultDetails }) {
  const rangeStatus = data.range.outOfRange ? "Out of Range" : "Inside Range";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.overviewKpis.map((item) => (
          <Surface
            key={item.label}
            variant="panel"
            className="border border-slate-800 bg-slate-900 p-4"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {item.label}
            </div>
            <div className={`mt-2 text-2xl font-semibold ${toneClasses(item.tone)}`}>
              {item.value}
            </div>
            {item.meta ? <div className="mt-1 text-xs text-slate-500">{item.meta}</div> : null}
          </Surface>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Surface variant="panel" className="border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                Current Range / Position
              </h3>
            </div>

            <div className="space-y-5 px-5 py-5">
              <PositionBar range={data.range} />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="text-xs text-slate-500">Lower Price</div>
                  <div className="mt-1 text-sm font-medium text-slate-200">
                    {usd(data.range.lowerPrice, 8)}
                  </div>
                </div>

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <div className="text-xs text-cyan-300">Current Price</div>
                  <div className="mt-1 text-base font-semibold text-white">
                    {usd(data.range.currentPrice, 4)}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="text-xs text-slate-500">Upper Price</div>
                  <div className="mt-1 text-sm font-medium text-slate-200">
                    {usd(data.range.upperPrice, 4)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <Row label="Current Tick" value={num(data.range.currentTick, 0)} />
                  <Row label="Lower Tick" value={num(data.range.lowerTick, 0)} />
                  <Row label="Upper Tick" value={num(data.range.upperTick, 0)} />
                  <Row label="Last Rebalance" value={data.range.lastRebalanceLabel} />
                </div>

                <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <Row label="Range Status" value={rangeStatus} highlight={!data.range.outOfRange} />
                  <Row label="Range Side" value={data.range.rangeSide} />
                  <Row label="Position Location" value={data.range.positionLocation} />
                  <Row label="Staked" value={data.range.staked ? "Yes" : "No"} />
                </div>
              </div>
            </div>
          </Surface>

          <Surface variant="panel" className="border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                Holdings Composition
              </h3>
            </div>

            <div className="space-y-5 px-5 py-5">
              <HoldingBlock
                title="Vault Idle"
                totalUsd={data.holdings.vaultIdle.totalUsd}
                token0Label={data.token0.symbol}
                token0Value={data.holdings.vaultIdle.token0Amount}
                token1Label={data.token1.symbol}
                token1Value={data.holdings.vaultIdle.token1Amount}
              />

              <HoldingBlock
                title="In Position"
                totalUsd={data.holdings.inPosition.totalUsd}
                token0Label={data.token0.symbol}
                token0Value={data.holdings.inPosition.token0Amount}
                token1Label={data.token1.symbol}
                token1Value={data.holdings.inPosition.token1Amount}
              />

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-end justify-between">
                  <div className="text-sm font-semibold text-white">Total Holdings</div>
                  <div className="text-lg font-semibold text-white">
                    {usd(data.holdings.totals.totalUsd)}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                  <Row
                    label={`Total ${data.token0.symbol}`}
                    value={num(data.holdings.totals.token0Amount, 8)}
                  />
                  <Row
                    label={`Total ${data.token1.symbol}`}
                    value={num(data.holdings.totals.token1Amount, 6)}
                  />
                </div>
              </div>
            </div>
          </Surface>
        </div>

        <div className="space-y-6">
          <Surface variant="panel" className="border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                Fees & Rewards
              </h3>
            </div>

            <div className="space-y-3 px-5 py-5">
              <TokenAmountCard
                symbol={data.token0.symbol}
                label={`${data.token0.symbol} Uncollected`}
                value={num(data.feesRewards.uncollectedToken0, 8)}
                meta="Pending fees"
              />
              <TokenAmountCard
                symbol={data.token1.symbol}
                label={`${data.token1.symbol} Uncollected`}
                value={num(data.feesRewards.uncollectedToken1, 6)}
                meta="Pending fees"
              />
              <TokenAmountCard
                symbol={data.feesRewards.rewardSymbol}
                label="Pending Reward"
                value={`${num(data.feesRewards.pendingRewardAmount, 8)} ${data.feesRewards.rewardSymbol}`}
                meta={usd(data.feesRewards.pendingRewardUsd, 4)}
                tone="cyan"
              />

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <Row
                  label="Uncollected Fees (USD)"
                  value={usd(data.feesRewards.uncollectedUsd, 4)}
                />
                <div className="mt-2" />
                <Row
                  label="Reward Balance In Vault"
                  value={`${num(data.feesRewards.inVaultRewardAmount, 8)} ${data.feesRewards.rewardSymbol}`}
                />
              </div>
            </div>
          </Surface>

          <Surface variant="panel" className="border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-5 py-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                Configuration
              </h3>
            </div>

            <div className="space-y-2 px-5 py-5">
              <Row label="Owner" value={shortAddress(data.configuration.ownerAddress)} mono />
              <Row label="Executor" value={shortAddress(data.configuration.executorAddress)} mono />
              <Row label="Adapter" value={shortAddress(data.configuration.adapterAddress)} mono />
              <Row label="DEX Router" value={shortAddress(data.configuration.dexRouterAddress)} mono />
              <Row label="Fee Collector" value={shortAddress(data.configuration.feeCollectorAddress)} mono />
              <Row label="Pool" value={shortAddress(data.configuration.poolAddress)} mono />
              <Row label="NFPM" value={shortAddress(data.configuration.nfpmAddress)} mono />
              <Row
                label="Gauge"
                value={data.configuration.gaugeAddress ? shortAddress(data.configuration.gaugeAddress) : "—"}
                mono
              />
              <div className="my-3 h-px bg-slate-800" />
              <Row label="Strategy ID" value={String(data.configuration.strategyId)} mono />
              <Row label="Version" value={data.configuration.version} mono />
              <Row
                label="Status"
                value={data.configuration.isActive ? "Active" : "Inactive"}
                highlight={data.configuration.isActive}
              />
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-slate-500">{label}</span>
      <span
        className={[
          "text-sm",
          mono ? "font-mono" : "font-medium",
          highlight ? "text-green-300" : "text-slate-200",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

function HoldingBlock({
  title,
  totalUsd,
  token0Label,
  token0Value,
  token1Label,
  token1Value,
}: {
  title: string;
  totalUsd: number;
  token0Label: string;
  token0Value: number;
  token1Label: string;
  token1Value: number;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <div className="text-sm font-medium text-slate-300">{title}</div>
        <div className="text-sm font-mono text-white">{usd(totalUsd)}</div>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 md:grid-cols-2">
        <TokenAmountCard
          symbol={token0Label}
          label={`${token0Label} Amount`}
          value={num(token0Value, 8)}
        />
        <TokenAmountCard
          symbol={token1Label}
          label={`${token1Label} Amount`}
          value={num(token1Value, 6)}
        />
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
  tone?: VaultTone;
}) {
  const palette =
    tone === "cyan"
      ? "border-cyan-500/20 bg-cyan-500/5 text-cyan-300"
      : "border-slate-800 bg-slate-900 text-slate-200";

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