import type { TradeStrategiesKpis } from "../types";

type Props = {
  kpis: TradeStrategiesKpis;
};

export function TradeStrategiesKpiRow({ kpis }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Trade Strategies</div>
        <div className="text-2xl font-mono font-bold text-white">{kpis.total}</div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Active</div>
        <div className="text-2xl font-mono font-bold text-cyan-400">{kpis.active}</div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-slate-500/50 transition-colors">
        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Inactive</div>
        <div className="text-2xl font-mono font-bold text-slate-400">{kpis.inactive}</div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-green-500/50 transition-colors">
        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Unique Stream Keys</div>
        <div className="text-2xl font-mono font-bold text-green-400">{kpis.uniqueStreamKeys}</div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 hover:border-orange-500/50 transition-colors">
        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Unique Exec Accounts</div>
        <div className="text-2xl font-mono font-bold text-orange-400">{kpis.uniqueExecutionAccounts}</div>
      </div>
    </div>
  );
}