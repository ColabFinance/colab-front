"use client";

import React from "react";
import type { ChainStatus } from "./types";

export default function ChainsFilters(props: {
  query: string;
  onQueryChange: (v: string) => void;
  status: ChainStatus | "all";
  onStatusChange: (v: ChainStatus | "all") => void;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}
      <div className="w-full lg:w-auto">
        <div className="relative w-full lg:w-72">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            ⌕
          </span>
          <input
            value={props.query}
            onChange={(e) => props.onQueryChange(e.target.value)}
            placeholder="Filter by name or ID..."
            className="w-full rounded-lg border border-white/10 bg-black/20 py-2 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-sky-400/50"
          />
        </div>
      </div>

      {/* Status + refresh */}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <span className="whitespace-nowrap text-xs font-semibold uppercase text-slate-500">
            Status:
          </span>
          <select
            value={props.status}
            onChange={(e) => props.onStatusChange(e.target.value as any)}
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-sky-400/50 sm:w-auto"
          >
            <option value="all">All Chains</option>
            <option value="enabled">Enabled</option>
            <option value="maintenance">Maintenance</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        <button
          onClick={props.onRefresh}
          className="hidden rounded-lg border border-white/10 bg-black/20 p-2 text-slate-300 transition hover:border-white/15 hover:text-white sm:inline-flex"
          title="Refresh"
        >
          ↻
        </button>
      </div>
    </div>
  );
}