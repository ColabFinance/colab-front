import type { TradeHomeKpis } from "../types";

type Props = {
  kpis: TradeHomeKpis;
};

export function TradeHomeKpiRow({ kpis }: Props) {
  const cards = [
    {
      label: "Total Trade Strategies",
      value: kpis.totalTradeStrategies,
      valueClassName: "text-white",
      borderClassName: "hover:border-blue-500/50",
    },
    {
      label: "Active Trade Strategies",
      value: kpis.activeTradeStrategies,
      valueClassName: "text-cyan-400",
      borderClassName: "hover:border-cyan-500/50",
    },
    {
      label: "Active Positions",
      value: kpis.activePositions,
      valueClassName: "text-green-400",
      borderClassName: "hover:border-green-500/50",
    },
    {
      label: "Pending Signals",
      value: kpis.pendingSignals,
      valueClassName: "text-blue-400",
      borderClassName: "hover:border-blue-500/50",
    },
    {
      label: "Failed Signals",
      value: kpis.failedSignals,
      valueClassName: "text-red-400",
      borderClassName: "hover:border-red-500/50",
    },
    {
      label: "Enabled Exec Profiles",
      value: kpis.enabledExecutionProfiles,
      valueClassName: "text-slate-200",
      borderClassName: "hover:border-slate-500/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-slate-900 border border-slate-700 rounded-lg p-4 transition-colors ${card.borderClassName}`}
        >
          <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            {card.label}
          </div>
          <div className={`text-2xl font-mono font-bold ${card.valueClassName}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}