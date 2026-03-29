"use client";

import { TradeStrategyDetailsHeader } from "./ui/TradeStrategyDetailsHeader";
import { TradeStrategyExecutionContextCard } from "./ui/TradeStrategyExecutionContextCard";
import { TradeStrategyExecutionResponseDrawer } from "./ui/TradeStrategyExecutionResponseDrawer";
import { TradeStrategyLatestRuntimeCard } from "./ui/TradeStrategyLatestRuntimeCard";
import { TradeStrategyOverviewCard } from "./ui/TradeStrategyOverviewCard";
import { TradeStrategyParamsCard } from "./ui/TradeStrategyParamsCard";
import { TradeStrategyRecentSignalsCard } from "./ui/TradeStrategyRecentSignalsCard";
import { TradeStrategySignalDetailsDrawer } from "./ui/TradeStrategySignalDetailsDrawer";
import { useTradeStrategyDetailsPage } from "./hooks";

export default function TradeStrategyDetailsPage({
  strategyId,
}: {
  strategyId: string;
}) {
  const vm = useTradeStrategyDetailsPage(strategyId);

  if (vm.isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 text-sm text-slate-400">
          Loading trade strategy details...
        </div>
      </div>
    );
  }

  if (!vm.strategy) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
          {vm.errorMessage || "Trade strategy not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {vm.errorMessage ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
          {vm.errorMessage}
        </div>
      ) : null}

      <TradeStrategyDetailsHeader strategy={vm.strategy} onToggleStatus={vm.toggleStatus} />

      <TradeStrategyOverviewCard strategy={vm.strategy} onCopy={vm.copyText} />

      <TradeStrategyParamsCard strategy={vm.strategy} />

      <TradeStrategyLatestRuntimeCard strategyId={vm.strategy.id} runtime={vm.runtime} />

      <TradeStrategyRecentSignalsCard
        strategyId={vm.strategy.id}
        signals={vm.signals}
        onOpenDetails={vm.openSignalDetails}
        onOpenExecutionResponse={vm.openExecutionResponse}
      />

      <TradeStrategyExecutionContextCard strategy={vm.strategy} onCopy={vm.copyText} />

      <TradeStrategySignalDetailsDrawer signal={vm.selectedSignal} onClose={vm.closeSignalDetails} />

      <TradeStrategyExecutionResponseDrawer
        open={Boolean(vm.selectedExecutionResponse)}
        prettyJson={vm.executionResponsePretty}
        onClose={vm.closeExecutionResponse}
      />
    </div>
  );
}