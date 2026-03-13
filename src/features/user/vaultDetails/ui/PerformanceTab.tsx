"use client";

import React, { useMemo, useState } from "react";
import { Surface } from "@/presentation/components/Surface";
import type { VaultPerformanceData, VaultPerformanceEpisode } from "../types";
import { DrawerShell } from "./DrawerShell";

type Props = {
  performance: VaultPerformanceData | null;
};

function usd(value?: number | null, fractionDigits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

function percent(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(2)}%`;
}

function dateLabel(value?: string | null, ms?: number | null) {
  if (value) return value;
  if (!ms) return "—";
  return new Date(ms).toLocaleString();
}

function metricValue(metrics: Record<string, any> | null | undefined, key: string) {
  if (!metrics || metrics[key] === undefined || metrics[key] === null) return "—";
  const value = metrics[key];
  if (typeof value === "number") return String(value);
  return JSON.stringify(value);
}

export function PerformanceTab({ performance }: Props) {
  const [selectedEpisode, setSelectedEpisode] = useState<VaultPerformanceEpisode | null>(null);

  const summary = useMemo(() => {
    const cashflows = performance?.cashflows_totals || {};
    const current = performance?.current_value || {};
    const profit = performance?.profit || {};
    const annual = profit.annualized || {};
    const gas = performance?.gas_costs || {};

    return [
      {
        label: "Deposited",
        value: usd(cashflows.deposited_usd),
        meta: "User deposits",
      },
      {
        label: "Withdrawn",
        value: usd(cashflows.withdrawn_usd),
        meta: "User withdrawals",
      },
      {
        label: "Net Contributed",
        value: usd(cashflows.net_contributed_usd),
        meta: "withdrawn - deposited",
      },
      {
        label: "Current Value",
        value: usd(current.total_usd),
        meta: current.source || "unknown",
      },
      {
        label: "Profit",
        value: usd(profit.profit_usd),
        meta: percent(profit.profit_pct),
      },
      {
        label: "Profit Net Gas",
        value: usd(profit.profit_net_gas_usd),
        meta: percent(profit.profit_net_gas_pct),
      },
      {
        label: "APR",
        value: percent(annual.apr),
        meta: annual.days ? `${annual.days.toFixed(2)} days` : "—",
      },
      {
        label: "APY",
        value: percent(annual.apy_daily_compound),
        meta: `${gas.tx_count || 0} gas-tracked txs`,
      },
    ];
  }, [performance]);

  if (!performance) {
    return (
      <Surface variant="panel" className="p-6">
        <div className="text-lg font-semibold text-white">Performance unavailable</div>
        <div className="mt-2 text-sm text-slate-400">
          No performance payload was returned for this vault.
        </div>
      </Surface>
    );
  }

  const episodes = performance.episodes?.items || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Surface
            key={item.label}
            variant="panel"
            className="border border-slate-800 bg-slate-900 p-4"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {item.label}
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
            <div className="mt-1 text-xs text-slate-500">{item.meta}</div>
          </Surface>
        ))}
      </div>

      <Surface variant="panel" className="border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="border-b border-slate-800 px-5 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Episodes
          </h3>
        </div>

        <div className="h-[calc(100vh-23rem)] min-h-[360px] max-h-[72vh] overflow-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="sticky top-0 z-10 bg-slate-950 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Open Time</th>
                <th className="px-5 py-3">Close Time</th>
                <th className="px-5 py-3">Open Price</th>
                <th className="px-5 py-3">Close Price</th>
                <th className="px-5 py-3">Pa</th>
                <th className="px-5 py-3">Pb</th>
                <th className="px-5 py-3">Pool Type</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Totals USD</th>
                <th className="px-5 py-3">Fees This Episode</th>
                <th className="px-5 py-3">Close Reason</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {episodes.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-5 py-12 text-center text-slate-500">
                    No episodes returned.
                  </td>
                </tr>
              ) : (
                episodes.map((episode, index) => (
                  <tr
                    key={episode.id || `${episode.open_time}-${index}`}
                    className="border-t border-slate-800 text-slate-300 transition hover:bg-slate-950/40"
                  >
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-200">
                        {episode.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">{dateLabel(episode.open_time_iso, episode.open_time)}</td>
                    <td className="px-5 py-4">{dateLabel(episode.close_time_iso, episode.close_time)}</td>
                    <td className="px-5 py-4">{episode.open_price ?? "—"}</td>
                    <td className="px-5 py-4">{episode.close_price ?? "—"}</td>
                    <td className="px-5 py-4">{episode.Pa ?? "—"}</td>
                    <td className="px-5 py-4">{episode.Pb ?? "—"}</td>
                    <td className="px-5 py-4">{episode.pool_type || "—"}</td>
                    <td className="px-5 py-4">{episode.mode_on_open || "—"}</td>
                    <td className="px-5 py-4">{metricValue(episode.metrics, "totals_usd")}</td>
                    <td className="px-5 py-4">
                      {metricValue(episode.metrics, "fees_this_episode_usd")}
                    </td>
                    <td className="px-5 py-4">
                      {metricValue(episode.metrics, "close_reason")}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedEpisode(episode)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Surface>

      <DrawerShell
        open={Boolean(selectedEpisode)}
        onClose={() => setSelectedEpisode(null)}
        title="Episode details"
        subtitle={selectedEpisode?.id || "Episode"}
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedEpisode(null)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        }
      >
        {selectedEpisode ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Metric label="Status" value={selectedEpisode.status} />
              <Metric label="Open Time" value={dateLabel(selectedEpisode.open_time_iso, selectedEpisode.open_time)} />
              <Metric label="Close Time" value={dateLabel(selectedEpisode.close_time_iso, selectedEpisode.close_time)} />
              <Metric label="Open Price" value={String(selectedEpisode.open_price ?? "—")} />
              <Metric label="Close Price" value={String(selectedEpisode.close_price ?? "—")} />
              <Metric label="Pa" value={String(selectedEpisode.Pa ?? "—")} />
              <Metric label="Pb" value={String(selectedEpisode.Pb ?? "—")} />
              <Metric label="Pool Type" value={selectedEpisode.pool_type || "—"} />
              <Metric label="Mode On Open" value={selectedEpisode.mode_on_open || "—"} />
              <Metric label="Majority On Open" value={selectedEpisode.majority_on_open || "—"} />
              <Metric label="Last Event Bar" value={String(selectedEpisode.last_event_bar ?? "—")} />
              <Metric label="Close Reason" value={metricValue(selectedEpisode.metrics, "close_reason")} />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-sm font-semibold text-white">Metrics</div>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs text-slate-300">
                {JSON.stringify(selectedEpisode.metrics || {}, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}
      </DrawerShell>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-medium text-slate-200">{value}</div>
    </div>
  );
}