"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChainOption, DexFormValues, DexRegistryItem } from "../types";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  chainOptions: ChainOption[];
  defaultChainKey: string;
  dex: DexRegistryItem | null;
  submitting?: boolean;
  onClose: () => void;
  onSave: (values: DexFormValues) => Promise<void>;
};

function prettifyDexKey(key: string) {
  return key
    .split("_")
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (lower === "v2" || lower === "v3") return lower.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export default function DexDrawer({
  open,
  mode,
  chainOptions,
  defaultChainKey,
  dex,
  submitting = false,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<DexFormValues>({
    chain: defaultChainKey,
    key: "",
    routerAddress: "",
    enabled: true,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setError("");

    if (dex) {
      setForm({
        chain: dex.chainKey,
        key: dex.key,
        routerAddress: dex.routerAddress,
        enabled: dex.enabled,
      });
      return;
    }

    setForm({
      chain: defaultChainKey || chainOptions[0]?.key || "",
      key: "",
      routerAddress: "",
      enabled: true,
    });
  }, [open, dex, defaultChainKey, chainOptions]);

  const title = mode === "create" ? "Add DEX" : "Edit DEX";
  const submitLabel = mode === "create" ? "Create DEX" : "Save changes";
  const previewName = useMemo(() => prettifyDexKey(form.key), [form.key]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      await onSave({
        chain: form.chain.trim(),
        key: form.key.trim().toLowerCase(),
        routerAddress: form.routerAddress.trim(),
        enabled: form.enabled,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save DEX.");
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/70" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-slate-800 bg-slate-900 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="text-sm text-slate-400">
                {mode === "create"
                  ? "Register a new DEX router for the selected chain."
                  : "Update the router or status for this DEX."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:text-white hover:border-slate-500"
            >
              Close
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {error ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Chain
              </label>
              <select
                value={form.chain}
                onChange={(e) => setForm((prev) => ({ ...prev, chain: e.target.value }))}
                disabled={mode === "edit" || submitting}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500 disabled:opacity-60"
              >
                {chainOptions.map((chain) => (
                  <option key={chain.key} value={chain.key}>
                    {chain.name} ({chain.key})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                DEX key
              </label>
              <input
                value={form.key}
                onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))}
                disabled={mode === "edit" || submitting}
                placeholder="pancake_v3"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 disabled:opacity-60"
              />
              <div className="text-xs text-slate-500">
                Display name preview: <span className="text-slate-300">{previewName || "-"}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Router address
              </label>
              <input
                value={form.routerAddress}
                onChange={(e) => setForm((prev) => ({ ...prev, routerAddress: e.target.value }))}
                disabled={submitting}
                placeholder="0x..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 disabled:opacity-60"
              />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-white">Enabled</div>
                  <div className="text-xs text-slate-500">
                    Active records can be consumed by the admin and user flows.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
                  disabled={submitting}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-60 ${
                    form.enabled ? "bg-cyan-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      form.enabled ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:border-slate-500"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                !form.chain.trim() ||
                !form.key.trim() ||
                !form.routerAddress.trim()
              }
              className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-60"
            >
              {submitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}