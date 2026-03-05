"use client";

import { PoolsFilters } from "../types";
import { Surface, SurfaceBody } from "@/presentation/components/Surface";

type Props = {
  filters: PoolsFilters;
  onChange: (patch: Partial<PoolsFilters>) => void;
  onReset: () => void;
  onApply: () => void;
};

export function PoolsFiltersPanel({ filters, onChange, onReset, onApply }: Props) {
  return (
    <Surface variant="panel">
      <SurfaceBody className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Chain
              </label>
              <select
                value={filters.chain}
                onChange={(e) => onChange({ chain: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Optimism">Optimism</option>
                <option value="Arbitrum">Arbitrum</option>
                <option value="Base">Base</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                DEX Key
              </label>
              <select
                value={filters.dexKey}
                onChange={(e) => onChange({ dexKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All DEXs</option>
                <option value="uniswap_v3">uniswap_v3</option>
                <option value="curve_v2">curve_v2</option>
                <option value="balancer_v2">balancer_v2</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Token Symbol
              </label>
              <input
                value={filters.tokenSymbol}
                onChange={(e) => onChange({ tokenSymbol: e.target.value })}
                placeholder="e.g. USDC"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Fee Tier
              </label>
              <select
                value={filters.feeTier}
                onChange={(e) => onChange({ feeTier: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">All Tiers</option>
                <option value="100">0.01% (100)</option>
                <option value="500">0.05% (500)</option>
                <option value="3000">0.3% (3000)</option>
                <option value="10000">1% (10000)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => onChange({ status: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 min-w-fit">
            <button
              onClick={onReset}
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:text-white hover:bg-slate-700 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onApply}
              className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-600/30 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </SurfaceBody>
    </Surface>
  );
}