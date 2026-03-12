"use client";

import React from "react";
import { Surface, SurfaceBody } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { AdaptersFilters, AdapterStatusFilter } from "../types";

type ChainOption = {
  key: string;
  name: string;
};

type DexOption = {
  dex: string;
};

export function AdaptersFiltersPanel({
  value,
  chains,
  dexes,
  onChange,
  onReset,
  className,
}: {
  value: AdaptersFilters;
  chains: ChainOption[];
  dexes: DexOption[];
  onChange: (next: AdaptersFilters) => void;
  onReset: () => void;
  className?: string;
}) {
  return (
    <Surface variant="panel" className={cn(className)}>
      <SurfaceBody className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
            <Field label="Chain">
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={value.chain}
                onChange={(e) =>
                  onChange({
                    ...value,
                    chain: e.target.value,
                    dex: "all",
                  })
                }
              >
                {chains.map((chain) => (
                  <option key={chain.key} value={chain.key}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="DEX">
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={value.dex}
                onChange={(e) => onChange({ ...value, dex: e.target.value })}
              >
                <option value="all">All DEXes</option>
                {dexes.map((dex) => (
                  <option key={dex.dex} value={dex.dex}>
                    {dex.dex}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={value.status}
                onChange={(e) =>
                  onChange({
                    ...value,
                    status: e.target.value as AdapterStatusFilter,
                  })
                }
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED_CAN_CREATE_NEW">Archived</option>
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