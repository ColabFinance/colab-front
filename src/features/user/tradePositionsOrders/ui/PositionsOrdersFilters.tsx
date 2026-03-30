"use client";

import type {
  ExecutionAccountOption,
  PositionsOrdersFiltersState,
  StrategyOption,
} from "../types";

type Props = {
  filters: PositionsOrdersFiltersState;
  executionAccountOptions: ExecutionAccountOption[];
  strategyOptions: StrategyOption[];
  onChangeFilter: (name: keyof PositionsOrdersFiltersState, value: string) => void;
  onApplyFilters: () => void;
};

export function PositionsOrdersFilters({
  filters,
  executionAccountOptions,
  strategyOptions,
  onChangeFilter,
  onApplyFilters,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            Execution Account
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <i className="fa-solid fa-wallet text-xs" />
            </div>
            <select
              value={filters.executionAccountId}
              onChange={(e) => onChangeFilter("executionAccountId", e.target.value)}
              className="block w-full pl-9 pr-10 py-2.5 text-sm border border-slate-700 bg-slate-950 text-white rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">All Accounts</option>
              {executionAccountOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <i className="fa-solid fa-chevron-down text-xs" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            Strategy
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <i className="fa-solid fa-chess-knight text-xs" />
            </div>
            <select
              value={filters.strategyId}
              onChange={(e) => onChangeFilter("strategyId", e.target.value)}
              className="block w-full pl-9 pr-10 py-2.5 text-sm border border-slate-700 bg-slate-950 text-white rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">Select Strategy</option>
              {strategyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <i className="fa-solid fa-chevron-down text-xs" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
            Lifecycle Filter
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <i className="fa-solid fa-filter text-xs" />
            </div>
            <select
              value={filters.statusScope}
              onChange={(e) => onChangeFilter("statusScope", e.target.value)}
              className="block w-full pl-9 pr-10 py-2.5 text-sm border border-slate-700 bg-slate-950 text-white rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="ALL">All</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <i className="fa-solid fa-chevron-down text-xs" />
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onApplyFilters}
            className="w-full px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_-8px_rgba(34,211,238,0.45)]"
          >
            <i className="fa-solid fa-filter" /> Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}