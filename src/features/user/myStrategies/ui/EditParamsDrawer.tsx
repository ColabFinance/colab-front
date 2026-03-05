"use client";

import React, { useMemo, useState } from "react";
import { Surface } from "@/presentation/components/Surface";
import { Button } from "@/presentation/components/Button";
import type { EditParamsDraft, MyStrategyRow } from "../types";

function isValidJson(s: string) {
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
}

export function EditParamsDrawer({
  open,
  onClose,
  selected,
  draft,
  onDraft,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  selected: MyStrategyRow | null;
  draft: EditParamsDraft | null;
  onDraft: (v: EditParamsDraft | null) => void;
  onSave: () => void;
}) {
  const [jsonMsg, setJsonMsg] = useState<null | { ok: boolean; label: string }>(null);

  const jsonOk = useMemo(() => (draft ? isValidJson(draft.tiersJson) : false), [draft]);

  if (!open || !selected || !draft) return null;

  function formatJson() {
    try {
      const parsed = JSON.parse(draft.tiersJson);
      const pretty = JSON.stringify(parsed, null, 2);
      onDraft({ ...draft, tiersJson: pretty });
      setJsonMsg({ ok: true, label: "Valid JSON" });
    } catch {
      setJsonMsg({ ok: false, label: "Invalid JSON" });
    }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto">
        <Surface variant="panel" className="h-full rounded-none border-l border-slate-700">
          <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-white">Strategy Params (DB)</h2>
              <p className="text-sm text-slate-400 mt-1">
                Strategy #{selected.id} — {selected.name}
              </p>
            </div>

            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" aria-label="Close">
              <i className="fa-solid fa-xmark text-xl" aria-hidden="true" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Identity */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <i className="fa-solid fa-id-badge text-cyan-400" aria-hidden="true" /> Identity
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Status</label>
                  <select
                    value={draft.status}
                    onChange={(e) => onDraft({ ...draft, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Indicator Set ID (cfg_hash)</label>
                  <input
                    value={draft.indicatorSetId}
                    readOnly
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 font-mono text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Symbol</label>
                  <input
                    value={draft.symbol}
                    onChange={(e) => onDraft({ ...draft, symbol: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono uppercase focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Indicator Set */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <i className="fa-solid fa-chart-line text-cyan-400" aria-hidden="true" /> Indicator Set
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Source</label>
                  <input
                    value={draft.indicatorSource}
                    onChange={(e) => onDraft({ ...draft, indicatorSource: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">EMA Fast</label>
                  <input
                    type="number"
                    value={draft.emaFast}
                    onChange={(e) => onDraft({ ...draft, emaFast: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">EMA Slow</label>
                  <input
                    type="number"
                    value={draft.emaSlow}
                    onChange={(e) => onDraft({ ...draft, emaSlow: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">ATR Window</label>
                  <input
                    type="number"
                    value={draft.atrWindow}
                    onChange={(e) => onDraft({ ...draft, atrWindow: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Core Params */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <i className="fa-solid fa-gears text-cyan-400" aria-hidden="true" /> Core Parameters
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Skew Low %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={draft.skewLowPct}
                    onChange={(e) => onDraft({ ...draft, skewLowPct: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Skew High %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={draft.skewHighPct}
                    onChange={(e) => onDraft({ ...draft, skewHighPct: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">EPS</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={draft.eps}
                    onChange={(e) => onDraft({ ...draft, eps: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Cooloff Bars</label>
                  <input
                    type="number"
                    value={draft.cooloffBars}
                    onChange={(e) => onDraft({ ...draft, cooloffBars: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Breakout Confirm Bars</label>
                  <input
                    type="number"
                    value={draft.breakoutConfirmBars}
                    onChange={(e) => onDraft({ ...draft, breakoutConfirmBars: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Inrange Resize Mode</label>
                  <select
                    value={draft.inrangeResizeMode}
                    onChange={(e) => onDraft({ ...draft, inrangeResizeMode: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="skew_swap">skew_swap</option>
                    <option value="preserve">preserve</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.gaugeEnabled}
                    onChange={(e) => onDraft({ ...draft, gaugeEnabled: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-300">Gauge Flow Enabled</span>
                </label>
              </div>
            </div>

            {/* Tiers JSON */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <i className="fa-solid fa-code text-cyan-400" aria-hidden="true" /> Tiers Configuration
              </h3>

              <div className="relative">
                <textarea
                  value={draft.tiersJson}
                  onChange={(e) => {
                    onDraft({ ...draft, tiersJson: e.target.value });
                    setJsonMsg(null);
                  }}
                  className="w-full min-h-[200px] bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed resize-none"
                  spellCheck={false}
                />

                <button
                  type="button"
                  onClick={formatJson}
                  className="absolute top-3 right-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded transition-colors border border-slate-700"
                >
                  <i className="fa-solid fa-wand-magic-sparkles mr-1" aria-hidden="true" /> Format JSON
                </button>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs">
                {jsonMsg ? (
                  jsonMsg.ok ? (
                    <>
                      <i className="fa-solid fa-check-circle text-green-400" aria-hidden="true" />
                      <span className="text-green-400">{jsonMsg.label}</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-triangle-exclamation text-red-400" aria-hidden="true" />
                      <span className="text-red-400">{jsonMsg.label}</span>
                    </>
                  )
                ) : jsonOk ? (
                  <>
                    <i className="fa-solid fa-check-circle text-green-400" aria-hidden="true" />
                    <span className="text-green-400">Valid JSON</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-triangle-exclamation text-red-400" aria-hidden="true" />
                    <span className="text-red-400">Invalid JSON</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 px-6 py-4 flex items-center justify-between gap-3">
            <button onClick={onClose} className="px-5 py-2 text-slate-400 hover:text-white transition-colors">
              Close
            </button>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                leftIcon={<i className="fa-solid fa-vial" aria-hidden="true" />}
                onClick={() => {}}
              >
                Run Backtest
              </Button>

              <Button
                variant="primary"
                onClick={onSave}
                leftIcon={<i className="fa-solid fa-save" aria-hidden="true" />}
              >
                Save Params
              </Button>
            </div>
          </div>
        </Surface>
      </div>
    </div>
  );
}