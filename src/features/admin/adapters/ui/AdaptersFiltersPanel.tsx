"use client";

import React from "react";
import { Surface, SurfaceBody } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { AdaptersFilters, AdapterType, AdapterStatusFilter } from "../types";

export function AdaptersFiltersPanel({
  value,
  onChange,
  onReset,
  onApply,
  className,
}: {
  value: AdaptersFilters;
  onChange: (next: AdaptersFilters) => void;
  onReset: () => void;
  onApply: () => void;
  className?: string;
}) {
  return (
    <Surface variant="panel" className={cn(className)}>
      <SurfaceBody className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            <Field label="Chain">
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={String(value.chainId)}
                onChange={(e) => {
                  const raw = e.target.value;
                  onChange({ ...value, chainId: raw === "all" ? "all" : Number(raw) });
                }}
              >
                <option value="all">All Chains</option>
                <option value="1">Ethereum</option>
                <option value="10">Optimism</option>
                <option value="42161">Arbitrum</option>
              </select>
            </Field>

            <Field label="DEX Key">
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={value.dexKey}
                onChange={(e) => onChange({ ...value, dexKey: e.target.value as any })}
              >
                <option value="all">All DEXs</option>
                <option value="uniswap_v3">Uniswap V3</option>
                <option value="curve_v2">Curve V2</option>
                <option value="balancer_v2">Balancer V2</option>
              </select>
            </Field>

            <Field label="Adapter Type">
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={value.adapterType}
                onChange={(e) => onChange({ ...value, adapterType: e.target.value as AdapterType | "all" })}
              >
                <option value="all">All Types</option>
                <option value="standard">Standard</option>
                <option value="flashloan">Flashloan</option>
                <option value="vault">Vault</option>
              </select>
            </Field>

            <Field label="Status">
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={value.status}
                onChange={(e) => onChange({ ...value, status: e.target.value as AdapterStatusFilter })}
              >
                <option value="all">All Status</option>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </Field>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 min-w-fit w-full lg:w-auto">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onApply}
              className="w-full sm:w-auto rounded-lg border border-blue-500/30 bg-blue-600/20 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-600/30"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </SurfaceBody>
    </Surface>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}