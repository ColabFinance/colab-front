import type { ActivePositionRow } from "../types";

type Props = {
  rows: ActivePositionRow[];
  lastUpdatedLabel: string;
};

export function ActivePositionsTable({ rows, lastUpdatedLabel }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
      <div className="p-4 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-bold text-white text-lg">Active Positions</h3>
        <div className="text-xs text-slate-400">
          Last updated: <span className="text-slate-300 font-mono">{lastUpdatedLabel}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Strategy ID</th>
              <th className="px-6 py-4">Execution Account</th>
              <th className="px-6 py-4 text-center">Position Side</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Entry Price</th>
              <th className="px-6 py-4">Opened At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700">
            {rows.map((row) => (
              <tr key={row.id} className="group hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.symbol}</td>
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">#{row.strategyId}</td>
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                  {row.executionAccount ?? "Unassigned"}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${
                      row.positionSide === "long"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {row.positionSide === "long" ? "Long" : "Short"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    Open
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.quantity}</td>
                <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.entryPrice}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{row.openedAt}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button type="button" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                    Details
                  </button>
                  <button type="button" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                    Open Orders
                  </button>
                  <button type="button" className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors">
                    Trade Monitor
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-center text-sm text-slate-500">
                  No active positions for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}