"use client";

import { useEffect, useMemo, useState } from "react";
import { DexPoolType, DexRegistryItem } from "../types";

type Mode = "create" | "edit";

type Props = {
  open: boolean;
  mode: Mode;
  chainLabel: string;

  dex?: DexRegistryItem | null;

  onClose: () => void;
  onSave: (payload: {
    name: string;
    key: string;
    routerAddress: string;
    quoterAddress?: string;
    positionManagerAddress?: string;
    poolTypes: DexPoolType[];
    enabled: boolean;
  }) => void;
};

const POOL_TYPES: DexPoolType[] = ["STABLE", "VOLATILE", "CONCENTRATED", "WEIGHTED"];

export default function DexDrawer({ open, mode, chainLabel, dex, onClose, onSave }: Props) {
  const title = mode === "edit" ? `Edit ${dex?.name ?? "DEX"}` : "Add New DEX";

  const initial = useMemo(() => {
    if (!dex) {
      return {
        name: "",
        key: "",
        routerAddress: "",
        quoterAddress: "",
        positionManagerAddress: "",
        poolTypes: [] as DexPoolType[],
        enabled: true,
      };
    }
    return {
      name: dex.name ?? "",
      key: dex.key ?? "",
      routerAddress: dex.routerAddress ?? "",
      quoterAddress: dex.quoterAddress ?? "",
      positionManagerAddress: dex.positionManagerAddress ?? "",
      poolTypes: dex.poolTypes ?? [],
      enabled: dex.enabled ?? true,
    };
  }, [dex]);

  const [name, setName] = useState(initial.name);
  const [key, setKey] = useState(initial.key);
  const [routerAddress, setRouterAddress] = useState(initial.routerAddress);
  const [quoterAddress, setQuoterAddress] = useState(initial.quoterAddress);
  const [positionManagerAddress, setPositionManagerAddress] = useState(initial.positionManagerAddress);
  const [poolTypes, setPoolTypes] = useState<DexPoolType[]>(initial.poolTypes);
  const [enabled, setEnabled] = useState(initial.enabled);

  useEffect(() => {
    if (!open) return;
    setName(initial.name);
    setKey(initial.key);
    setRouterAddress(initial.routerAddress);
    setQuoterAddress(initial.quoterAddress);
    setPositionManagerAddress(initial.positionManagerAddress);
    setPoolTypes(initial.poolTypes);
    setEnabled(initial.enabled);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  function togglePoolType(t: DexPoolType) {
    setPoolTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function submit() {
    onSave({
      name: name.trim(),
      key: key.trim(),
      routerAddress: routerAddress.trim(),
      quoterAddress: quoterAddress.trim() || undefined,
      positionManagerAddress: positionManagerAddress.trim() || undefined,
      poolTypes,
      enabled,
    });
  }

  return (
    <>
      <div
        className={[
          "fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
      />

      <div
        className={[
          "fixed inset-y-0 right-0 z-[70] w-full max-w-md border-l border-slate-700 bg-slate-900 shadow-2xl flex flex-col h-full transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-950/50">
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-slate-400 mt-1">Register a DEX router for {chainLabel}</p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Basic Information
            </h4>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                DEX Name <span className="text-red-400">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Uniswap V3"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                DEX Key <span className="text-red-400">*</span>{" "}
                <span className="ml-1 text-[10px] text-slate-500 font-normal uppercase">(Unique per chain)</span>
              </label>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g. uniswap_v3"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none placeholder-slate-600"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Contract Addresses
            </h4>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Router Address <span className="text-red-400">*</span>
              </label>
              <input
                value={routerAddress}
                onChange={(e) => setRouterAddress(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Quoter Address <span className="text-xs text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                value={quoterAddress}
                onChange={(e) => setQuoterAddress(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Position Manager <span className="text-xs text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                value={positionManagerAddress}
                onChange={(e) => setPositionManagerAddress(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none placeholder-slate-600"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Configuration
            </h4>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Supported Pool Types</label>
              <div className="grid grid-cols-2 gap-2">
                {POOL_TYPES.map((t) => {
                  const checked = poolTypes.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => togglePoolType(t)}
                      className={[
                        "flex items-center gap-2 p-2.5 rounded-lg border transition-colors text-left",
                        checked
                          ? "border-cyan-500/50 bg-cyan-900/10"
                          : "border-slate-700 bg-slate-950/60 hover:border-cyan-500/30",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "inline-flex items-center justify-center w-4 h-4 rounded border text-[10px]",
                          checked ? "border-cyan-500 bg-cyan-500 text-slate-950" : "border-slate-600 text-slate-500",
                        ].join(" ")}
                      >
                        {checked ? "✓" : ""}
                      </span>
                      <span className="text-sm text-slate-200">{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-700">
              <div>
                <span className="block text-sm font-medium text-white">Enable DEX</span>
                <span className="text-xs text-slate-500">Allow strategies to use this DEX immediately</span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:bg-cyan-500" />
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 bg-slate-950/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-600 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all"
          >
            ✓ Save DEX
          </button>
        </div>
      </div>
    </>
  );
}