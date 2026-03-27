"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Surface } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Adapter } from "../types";
import { AdaptersPagination } from "./AdaptersPagination";

export function AdaptersTable({
  rows,
  onCreateClick,
  getAddressExplorerHref,
  getTxExplorerHref,
}: {
  rows: Adapter[];
  onCreateClick: () => void;
  getAddressExplorerHref: (chain: string, address: string) => string | null;
  getTxExplorerHref: (chain: string, txHash?: string | null) => string | null;
}) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [rows.length]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pageCount);

  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage]);

  return (
    <Surface variant="table" className="shadow-sm flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1180px]">
          <thead className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur">
            <tr className="border-b border-slate-700 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">DEX</th>
              <th className="px-6 py-4">Adapter Address</th>
              <th className="px-6 py-4">Pool</th>
              <th className="px-6 py-4">Pool Name / Fee</th>
              <th className="px-6 py-4">Fee Buffer</th>
              <th className="px-6 py-4">Tokens</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700 bg-slate-900">
            {paged.map((row) => {
              const adapterHref = getAddressExplorerHref(row.chain, row.address);
              const poolHref = getAddressExplorerHref(row.chain, row.pool);
              const txHref = getTxExplorerHref(row.chain, row.txHash);

              return (
                <tr key={`${row.chain}-${row.address}`} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <DexAvatar dexKey={row.dex} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-100">{row.dex}</span>
                        <span className="text-[10px] text-slate-500 uppercase">{row.chain}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <AddressPill address={row.address} />
                      <IconAnchor
                        title="Open adapter in explorer"
                        href={adapterHref}
                      >
                        <ExternalLinkIcon className="h-4 w-4" />
                      </IconAnchor>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <AddressPill address={row.pool} />
                      <IconAnchor
                        title="Open pool in explorer"
                        href={poolHref}
                      >
                        <ExternalLinkIcon className="h-4 w-4" />
                      </IconAnchor>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-100">{row.poolName}</span>
                      <span className="text-[10px] text-slate-500">{row.feeBps} bps</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <AddressPill address={row.feeBuffer} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-200">{shortAddress(row.token0)}</span>
                      <span className="text-xs text-slate-500">{shortAddress(row.token1)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={row.status} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="text-xs text-slate-500">{row.createdAtLabel}</span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <IconAnchor title="Open deployment tx" href={txHref}>
                        <ReceiptIcon className="h-4 w-4" />
                      </IconAnchor>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paged.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-sm text-slate-400">
                      No adapters found for the current filters.
                    </div>
                    <button
                      type="button"
                      onClick={onCreateClick}
                      className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20"
                    >
                      Create first adapter
                    </button>
                  </div>
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

function DexAvatar({ dexKey }: { dexKey: string }) {
  const cls =
    dexKey === "pancake_v3"
      ? "bg-blue-500/20 text-blue-300"
      : dexKey === "uniswap_v3"
      ? "bg-pink-500/20 text-pink-400"
      : dexKey === "aerodrome"
      ? "bg-emerald-500/20 text-emerald-300"
      : "bg-slate-700/70 text-slate-100";

  const letter = dexKey?.[0]?.toUpperCase?.() ?? "D";

  return (
    <div className={cn("h-6 w-6 rounded grid place-items-center text-[10px] font-bold", cls)}>
      {letter}
    </div>
  );
}

function StatusBadge({ status }: { status: "ACTIVE" | "ARCHIVED_CAN_CREATE_NEW" }) {
  const cls =
    status === "ACTIVE"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      : "border-amber-500/20 bg-amber-500/10 text-amber-300";

  const label = status === "ACTIVE" ? "Active" : "Archived";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
        cls
      )}
    >
      {label}
    </span>
  );
}

function IconAnchor({
  title,
  href,
  children,
}: {
  title: string;
  href: string | null;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <span
        title={title}
        className="p-1.5 rounded border border-transparent text-slate-700"
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={title}
      className="p-1.5 rounded border border-transparent text-slate-500 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
    >
      {children}
    </a>
  );
}

function shortAddress(value: string) {
  if (!value) return "-";
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
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

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 8h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}