"use client";

import React, { useEffect, useState } from "react";
import { Surface } from "@/presentation/components/Surface";
import { PerformanceSummaryCard, VaultEpisode, VaultTone } from "../types";
import { DrawerShell } from "./DrawerShell";

function toneClasses(tone?: VaultTone) {
  if (tone === "green") return "text-green-300";
  if (tone === "cyan") return "text-cyan-300";
  if (tone === "blue") return "text-blue-300";
  if (tone === "amber") return "text-amber-300";
  if (tone === "red") return "text-red-300";
  return "text-white";
}

type Props = {
  summary: PerformanceSummaryCard[];
  episodes: VaultEpisode[];
  selectedEpisode: VaultEpisode | null;
  onOpenEpisode: (id: string) => void;
  onCloseEpisode: () => void;
};

export function PerformanceTab({
  summary,
  episodes,
  selectedEpisode,
  onOpenEpisode,
  onCloseEpisode,
}: Props) {
  const [showExecutionLog, setShowExecutionLog] = useState(false);

  useEffect(() => {
    setShowExecutionLog(false);
  }, [selectedEpisode?.id]);

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
            <div className={`mt-2 text-2xl font-semibold ${toneClasses(item.tone)}`}>
              {item.value}
            </div>
            {item.meta ? <div className="mt-1 text-xs text-slate-500">{item.meta}</div> : null}
          </Surface>
        ))}
      </div>

      <Surface variant="panel" className="border border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Episodes
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Position lifecycle windows with fees, APR and close reasons.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Episode ID</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Open Time</th>
                <th className="px-5 py-3">Close Time</th>
                <th className="px-5 py-3">Open Price</th>
                <th className="px-5 py-3">Close Price</th>
                <th className="px-5 py-3">Range</th>
                <th className="px-5 py-3">Pool Type</th>
                <th className="px-5 py-3">Fees</th>
                <th className="px-5 py-3">APR</th>
                <th className="px-5 py-3">Total Value</th>
                <th className="px-5 py-3">Close Reason</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {episodes.map((episode) => (
                <tr
                  key={episode.id}
                  className="border-t border-slate-800 text-slate-300 transition hover:bg-slate-950/40"
                >
                  <td className="px-5 py-4 font-mono text-xs text-slate-300">
                    {episode.id}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full border px-2 py-1 text-[11px] font-medium ${
                        episode.status === "OPEN"
                          ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                          : "border-slate-700 bg-slate-800 text-slate-200"
                      }`}
                    >
                      {episode.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">{episode.openTimeLabel}</td>
                  <td className="px-5 py-4">{episode.closeTimeLabel ?? "—"}</td>
                  <td className="px-5 py-4 font-mono">{episode.openPrice}</td>
                  <td className="px-5 py-4 font-mono">{episode.closePrice ?? "—"}</td>
                  <td className="px-5 py-4 text-xs">{episode.rangeLabel}</td>
                  <td className="px-5 py-4">{episode.poolType}</td>
                  <td className="px-5 py-4">{episode.feesUsd}</td>
                  <td className="px-5 py-4">{episode.aprAnnualized}</td>
                  <td className="px-5 py-4">{episode.totalValueUsd}</td>
                  <td className="px-5 py-4">{episode.closeReason ?? "—"}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onOpenEpisode(episode.id)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      <DrawerShell
        open={Boolean(selectedEpisode)}
        onClose={onCloseEpisode}
        title="Episode details"
        subtitle={selectedEpisode ? selectedEpisode.id : undefined}
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCloseEpisode}
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
              <Metric label="Pool Type" value={selectedEpisode.poolType} />
              <Metric label="Mode on Open" value={selectedEpisode.modeOnOpen} />
              <Metric label="Majority on Open" value={selectedEpisode.majorityOnOpen} />
              <Metric label="Open Time" value={selectedEpisode.openTimeLabel} />
              <Metric label="Close Time" value={selectedEpisode.closeTimeLabel ?? "—"} />
              <Metric label="Open Price" value={selectedEpisode.openPrice} mono />
              <Metric label="Close Price" value={selectedEpisode.closePrice ?? "—"} mono />
              <Metric label="Range" value={selectedEpisode.rangeLabel} />
              <Metric label="Close Reason" value={selectedEpisode.closeReason ?? "—"} />
              <Metric label="Fees" value={selectedEpisode.feesUsd} />
              <Metric label="APR Annualized" value={selectedEpisode.aprAnnualized} />
              <Metric label="Total Value" value={selectedEpisode.totalValueUsd} />
              <Metric label="Candles" value={String(selectedEpisode.candleCount)} mono />
              <Metric
                label="Out of Range Candles"
                value={String(selectedEpisode.outOfRangeCandles)}
                mono
              />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60">
              <button
                type="button"
                onClick={() => setShowExecutionLog((current) => !current)}
                className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-semibold text-white"
              >
                <span>Technical execution timeline</span>
                <span className="text-xs text-slate-500">
                  {showExecutionLog ? "Hide" : "Show"}
                </span>
              </button>

              {showExecutionLog ? (
                <div className="space-y-3 border-t border-slate-800 px-4 py-4">
                  {selectedEpisode.executionSteps.map((step) => (
                    <div
                      key={step.id}
                      className="rounded-xl border border-slate-800 bg-slate-900/70 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-white">
                            {step.phase} · {step.step}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {step.tsLabel} · attempt {step.attempt}
                          </div>
                        </div>

                        {step.gasLabel ? (
                          <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300">
                            {step.gasLabel}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-3 text-sm text-slate-300">{step.summary}</p>

                      {step.txHash ? (
                        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs font-mono text-slate-300">
                          {step.txHash}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </DrawerShell>
    </div>
  );
}

function Metric({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-2 text-sm text-slate-200 ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </div>
    </div>
  );
}