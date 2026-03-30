import type { TradeStrategiesFilterOptions, TradeStrategiesFiltersState } from "../types";

type Props = {
  filters: TradeStrategiesFiltersState;
  filterOptions: TradeStrategiesFilterOptions;
  onChange: (name: keyof TradeStrategiesFiltersState, value: string | number) => void;
};

export function TradeStrategiesFilters({ filters, filterOptions, onChange }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="relative">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onChange("status", e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-slate-700 bg-slate-950 text-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer"
          >
            <option value="">All Status</option>
            {filterOptions.statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute bottom-2 right-0 flex items-center px-2 text-slate-400">
            <i className="fa-solid fa-chevron-down text-xs" />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Stream Key</label>
          <select
            value={filters.streamKey}
            onChange={(e) => onChange("streamKey", e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-slate-700 bg-slate-950 text-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer"
          >
            <option value="">All Streams</option>
            {filterOptions.streamKeys.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute bottom-2 right-0 flex items-center px-2 text-slate-400">
            <i className="fa-solid fa-chevron-down text-xs" />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Symbol</label>
          <select
            value={filters.symbol}
            onChange={(e) => onChange("symbol", e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-slate-700 bg-slate-950 text-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer"
          >
            <option value="">All Symbols</option>
            {filterOptions.symbols.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute bottom-2 right-0 flex items-center px-2 text-slate-400">
            <i className="fa-solid fa-chevron-down text-xs" />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Execution Account</label>
          <select
            value={filters.executionAccountId}
            onChange={(e) => onChange("executionAccountId", e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-slate-700 bg-slate-950 text-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer"
          >
            <option value="">All Accounts</option>
            {filterOptions.executionAccountIds.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute bottom-2 right-0 flex items-center px-2 text-slate-400">
            <i className="fa-solid fa-chevron-down text-xs" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-search text-slate-500 text-xs" />
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange("search", e.target.value)}
              placeholder="ID / Name / Symbol..."
              className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-700 bg-slate-950 text-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}