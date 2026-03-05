"use client";

import React, { useMemo, useState } from "react";
import { Surface, SurfaceBody, SurfaceFooter, SurfaceHeader } from "@/presentation/components/Surface";
import { Button } from "@/presentation/components/Button";
import { VaultRow } from "../types";

export function AutomationPanel({ vaults }: { vaults: VaultRow[] }) {
  const [selectedId, setSelectedId] = useState(vaults[0]?.id ?? "");
  const [enabled, setEnabled] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(3600);
  const [maxSlippageBps, setMaxSlippageBps] = useState(50);

  const selected = useMemo(() => vaults.find((v) => v.id === selectedId), [vaults, selectedId]);

  return (
    <div className="max-w-2xl mx-auto">
      <Surface variant="panel" className="overflow-hidden">
        <SurfaceHeader className="flex items-center justify-between gap-3">
          <div>
            <div className="text-white font-semibold">Automation Settings</div>
            <div className="text-xs text-slate-500">Allow keepers to execute strategy rebalances.</div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Target Vault:</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {vaults.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.alias}
                </option>
              ))}
            </select>
          </div>
        </SurfaceHeader>

        <SurfaceBody className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <div className="font-medium text-white">Enable Automation</div>
              <div className="text-xs text-slate-500 mt-1">
                {selected ? `Vault: ${selected.alias}` : "Select a vault to continue."}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEnabled((v) => !v)}
              className={[
                "relative inline-flex h-7 w-12 items-center rounded-full border transition-colors",
                enabled ? "bg-cyan-500/20 border-cyan-500/40" : "bg-slate-800 border-slate-700",
              ].join(" ")}
              aria-pressed={enabled}
            >
              <span
                className={[
                  "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
                  enabled ? "translate-x-6" : "translate-x-1",
                ].join(" ")}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Cooldown (Seconds)</label>
              <div className="relative">
                <input
                  type="number"
                  value={cooldownSeconds}
                  onChange={(e) => setCooldownSeconds(Number(e.target.value || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs">sec</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">Minimum time between automated actions.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Max Slippage (BPS)</label>
              <div className="relative">
                <input
                  type="number"
                  value={maxSlippageBps}
                  onChange={(e) => setMaxSlippageBps(Number(e.target.value || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs">bps</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">1 BPS = 0.01%. 50 BPS = 0.5%.</p>
            </div>
          </div>

          {!enabled && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="text-sm font-medium text-yellow-300">Automation is currently disabled</div>
              <div className="text-xs text-yellow-200/70 mt-1">
                Enable it to allow keepers to rebalance this vault automatically.
              </div>
            </div>
          )}
        </SurfaceBody>

        <SurfaceFooter className="flex items-center justify-between">
          <span className="text-xs text-slate-500">Last saved: 2 days ago</span>
          <Button
            variant="primary"
            onClick={() => {
              // mock placeholder (wire backend later)
            }}
          >
            Save Changes
          </Button>
        </SurfaceFooter>
      </Surface>
    </div>
  );
}