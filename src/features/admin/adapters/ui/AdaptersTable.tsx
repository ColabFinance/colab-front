"use client";

import React, { useMemo, useState } from "react";
import { Surface } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Adapter } from "../types";
import { AdaptersPagination } from "./AdaptersPagination";

export function AdaptersTable({
  rows,
  onEdit,
  onRunHealthCheck,
  onToggleEnabled,
}: {
  rows: Adapter[];
  onEdit: (row: Adapter) => void;
  onRunHealthCheck: (row: Adapter) => void;
  onToggleEnabled: (row: Adapter, enabled: boolean) => void;
}) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);

  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage]);

  const allOnPageSelected = paged.length > 0 && paged.every((r) => selected[r.id]);
  const someOnPageSelected = paged.some((r) => selected[r.id]) && !allOnPageSelected;

  function toggleAllOnPage(next: boolean) {
    const copy = { ...selected };
    for (const r of paged) copy[r.id] = next;
    setSelected(copy);
  }

  return (
    <Surface variant="table" className="shadow-sm flex flex-col min-h-[500px]">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
            <tr className="border-b border-slate-700 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 w-12">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20"
                  checked={allOnPageSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someOnPageSelected;
                  }}
                  onChange={(e) => toggleAllOnPage(e.target.checked)}
                />
              </th>
              <th className="px-6 py-4">DEX Key</th>
              <th className="px-6 py-4">Adapter Address</th>
              <th className="px-6 py-4">Pool Address</th>
              <th className="px-6 py-4">Type / Version</th>
              <th className="px-6 py-4">Capabilities</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Health</th>
              <th className="px-6 py-4 text-right">Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700 bg-slate-900">
            {paged.map((row) => (
              <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500/20"
                    checked={!!selected[row.id]}
                    onChange={(e) => setSelected({ ...selected, [row.id]: e.target.checked })}
                  />
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <DexAvatar dexKey={row.dexKey} />
                    <span className="text-sm font-medium text-slate-100">{row.dexKey}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <AddressPill address={row.adapterAddress} />
                    <IconLinkButton title="Open in explorer" onClick={() => {}}>
                      <ExternalLinkIcon className="h-4 w-4" />
                    </IconLinkButton>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <AddressPill address={row.poolAddress} />
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-100">
                      {labelAdapterType(row.adapterType)}
                    </span>
                    <span className="text-[10px] text-slate-500">v{row.version}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                    {row.capabilities.map((c) => (
                      <CapabilityBadge key={c} label={c} />
                    ))}
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <ToggleSwitch
                    checked={row.enabled}
                    onChange={(next) => onToggleEnabled(row, next)}
                  />
                </td>

                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <HealthDot health={row.health} />
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="text-xs text-slate-500">{row.updatedLabel}</span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <IconButton title="Run Health Check" onClick={() => onRunHealthCheck(row)}>
                      <StethoscopeIcon className="h-4 w-4" />
                    </IconButton>
                    <IconButton title="Edit" onClick={() => onEdit(row)}>
                      <PencilIcon className="h-4 w-4" />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}

            {paged.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-14 text-center text-sm text-slate-500">
                  No adapters found for the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-slate-700 bg-slate-950/40">
        <AdaptersPagination
          page={safePage}
          pageCount={pageCount}
          total={rows.length}
          from={rows.length === 0 ? 0 : (safePage - 1) * pageSize + 1}
          to={Math.min(rows.length, safePage * pageSize)}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </Surface>
  );
}

/* ---------- Small UI pieces ---------- */

function DexAvatar({ dexKey }: { dexKey: string }) {
  const cls =
    dexKey === "uniswap_v3"
      ? "bg-pink-500/20 text-pink-400"
      : dexKey === "curve_v2"
      ? "bg-orange-500/20 text-orange-400"
      : dexKey === "balancer_v2"
      ? "bg-slate-700 text-slate-100"
      : "bg-slate-700/70 text-slate-100";

  const letter = dexKey?.[0]?.toUpperCase?.() ?? "D";

  return (
    <div className={cn("h-6 w-6 rounded grid place-items-center text-[10px] font-bold", cls)}>
      {letter}
    </div>
  );
}

function labelAdapterType(t: string) {
  if (t === "standard") return "Standard";
  if (t === "flashloan") return "Flashloan";
  if (t === "vault") return "Vault";
  return t;
}

function CapabilityBadge({ label }: { label: string }) {
  const cls =
    label === "SWAP"
      ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
      : label === "MINT"
      ? "bg-green-500/10 text-green-300 border-green-500/20"
      : label === "QUOTE"
      ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
      : label === "STAKE"
      ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
      : label === "CLAIM"
      ? "bg-red-500/10 text-red-300 border-red-500/20"
      : "bg-slate-800 text-slate-200 border-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium border uppercase tracking-wider",
        cls
      )}
    >
      {label}
    </span>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        className="sr-only peer"
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-9 h-5 bg-slate-800 rounded-full peer-focus:outline-none peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
    </label>
  );
}

function HealthDot({ health }: { health: "healthy" | "warning" | "offline" }) {
  const cls =
    health === "healthy"
      ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.55)]"
      : health === "warning"
      ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.55)]"
      : "bg-slate-600";

  const title = health === "healthy" ? "Healthy" : health === "warning" ? "Warning" : "Offline";

  return <div title={title} className={cn("h-2.5 w-2.5 rounded-full", cls)} />;
}

function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="p-1.5 rounded border border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
    >
      {children}
    </button>
  );
}

function IconLinkButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="p-1.5 rounded border border-transparent text-slate-500 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
    >
      {children}
    </button>
  );
}

/* ---------- Inline icons ---------- */

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StethoscopeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 3v6a4 4 0 0 0 8 0V3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 15a6 6 0 0 0 12 0v-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M14 3h7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14L21 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 14v7H3V3h7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}