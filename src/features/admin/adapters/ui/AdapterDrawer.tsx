"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Surface } from "@/presentation/components/Surface";
import { Adapter, AdapterDraft, AdapterType } from "../types";

const CAPABILITIES = ["QUOTE", "SWAP", "MINT", "COLLECT", "STAKE", "UNSTAKE", "CLAIM", "FLASH"] as const;

export function AdapterDrawer({
  open,
  mode,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Adapter;
  onClose: () => void;
  onSave: (draft: AdapterDraft) => void;
}) {
  const title = mode === "edit" && initial ? `Edit Adapter: ${initial.dexKey}` : "Add New Adapter";

  const initialDraft: AdapterDraft = useMemo(() => {
    const baseCaps: Record<string, boolean> = {};
    for (const c of CAPABILITIES) baseCaps[c] = false;

    if (initial?.capabilities?.length) {
      for (const c of initial.capabilities) baseCaps[c] = true;
    }

    return {
      dexKey: initial?.dexKey ?? "",
      adapterAddress: initial?.adapterAddress ?? "",
      poolAddress: initial?.poolAddress ?? "",
      adapterType: (initial?.adapterType ?? "standard") as AdapterType,
      version: initial?.version ?? "",
      capabilities: baseCaps,
      enabled: initial?.enabled ?? true,
      notes: initial?.notes ?? "",
    };
  }, [initial]);

  const [draft, setDraft] = useState<AdapterDraft>(initialDraft);

  useEffect(() => {
    if (open) setDraft(initialDraft);
  }, [open, initialDraft]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-[70] w-full max-w-lg border-l border-slate-700 bg-slate-900 shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-950/40">
          <div>
            <h3 className="text-xl font-bold text-slate-100">{title}</h3>
            <p className="text-sm text-slate-400 mt-1">Configure logic adapter for DEX integration.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Identification */}
          <SectionTitle dotClassName="bg-cyan-500" title="Adapter Identification" />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>
                DEX Key <Req />
              </Label>
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={draft.dexKey}
                onChange={(e) => setDraft({ ...draft, dexKey: e.target.value })}
              >
                <option value="" disabled>
                  Select DEX...
                </option>
                <option value="uniswap_v3">Uniswap V3</option>
                <option value="curve_v2">Curve V2</option>
                <option value="balancer_v2">Balancer V2</option>
              </select>
            </div>

            <div className="col-span-2">
              <Label>
                Adapter Contract Address <Req />
              </Label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="0x..."
                  value={draft.adapterAddress}
                  onChange={(e) => setDraft({ ...draft, adapterAddress: e.target.value })}
                />
                <button
                  type="button"
                  className="px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-300 hover:text-slate-100 hover:border-cyan-500/30 hover:bg-slate-700 transition-colors whitespace-nowrap"
                  title="Verify Contract"
                  onClick={() => {}}
                >
                  <CheckIcon className="h-4 w-4 inline-block mr-1" />
                  Verify
                </button>
              </div>
            </div>

            <div className="col-span-2">
              <Label>
                Target Pool Address <Req />
              </Label>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                placeholder="0x..."
                value={draft.poolAddress}
                onChange={(e) => setDraft({ ...draft, poolAddress: e.target.value })}
              />
              <p className="text-[10px] text-slate-500 mt-1.5">
                The specific DEX pool this adapter interacts with.
              </p>
            </div>
          </div>

          {/* Configuration */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <SectionTitle dotClassName="bg-blue-500" title="Configuration" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>
                  Adapter Type <Req />
                </Label>
                <select
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  value={draft.adapterType}
                  onChange={(e) => setDraft({ ...draft, adapterType: e.target.value as AdapterType })}
                >
                  <option value="standard">Standard</option>
                  <option value="flashloan">Flashloan</option>
                  <option value="vault">Vault</option>
                </select>
              </div>

              <div>
                <Label>
                  Version <Req />
                </Label>
                <input
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  placeholder="e.g. 1.0.0"
                  value={draft.version}
                  onChange={(e) => setDraft({ ...draft, version: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <Label>Capabilities</Label>

                <Surface
                  variant="inset"
                  className="p-3"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {CAPABILITIES.map((cap) => (
                      <label key={cap} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20"
                          checked={!!draft.capabilities[cap]}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              capabilities: { ...draft.capabilities, [cap]: e.target.checked },
                            })
                          }
                        />
                        <span className="text-xs text-slate-300">{capLabel(cap)}</span>
                      </label>
                    ))}
                  </div>
                </Surface>
              </div>
            </div>

            <Surface variant="inset" className="p-3 flex items-center justify-between">
              <div>
                <span className="block text-sm font-medium text-slate-100">Adapter Status</span>
                <span className="text-xs text-slate-500">Enable or disable this adapter globally</span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.enabled}
                  className="sr-only peer"
                  onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
                />
                <div className="w-9 h-5 bg-slate-800 rounded-full peer-focus:outline-none peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </Surface>
          </div>

          {/* Notes */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <SectionTitle dotClassName="bg-purple-500" title="Additional Info" />

            <div>
              <Label>Notes (Optional)</Label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                placeholder="Add internal notes about this adapter deployment..."
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-950/40 flex flex-col gap-3">
          <button
            type="button"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-cyan-300 hover:bg-slate-700 hover:border-cyan-500/30 transition-colors flex items-center justify-center gap-2"
            onClick={() => {}}
          >
            <BugIcon className="h-4 w-4" />
            Test Connectivity
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onSave(draft)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-[0_0_20px_-8px_rgba(59,130,246,0.45)] transition-colors flex items-center justify-center gap-2"
            >
              <SaveIcon className="h-4 w-4" />
              Save Adapter
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionTitle({ title, dotClassName }: { title: string; dotClassName: string }) {
  return (
    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
      <span className={cn("w-1.5 h-1.5 rounded-full", dotClassName)} />
      {title}
    </h4>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-300 mb-1.5">{children}</label>;
}

function Req() {
  return <span className="text-red-400">*</span>;
}

function capLabel(cap: string) {
  const map: Record<string, string> = {
    QUOTE: "Quote",
    SWAP: "Swap",
    MINT: "Mint",
    COLLECT: "Collect",
    STAKE: "Stake",
    UNSTAKE: "Unstake",
    CLAIM: "Claim",
    FLASH: "Flash",
  };
  return map[cap] ?? cap;
}

/* ---------- icons ---------- */

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M7 21V13h10v8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 3v4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BugIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M9 9h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M8 7a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0V7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M4 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 19l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 19l-2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}