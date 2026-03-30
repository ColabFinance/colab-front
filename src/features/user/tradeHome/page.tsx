"use client";

import { useTradeHomePage } from "./hooks";
import { ActivePositionsTable } from "./ui/ActivePositionsTable";
import { ActiveTradeStrategiesTable } from "./ui/ActiveTradeStrategiesTable";
import { LatestSignalsTable } from "./ui/LatestSignalsTable";
import { OperationalWarningsPanel } from "./ui/OperationalWarningsPanel";
import { RuntimeHighlightsTable } from "./ui/RuntimeHighlightsTable";
import { TradeHomeHeader } from "./ui/TradeHomeHeader";
import { TradeHomeKpiRow } from "./ui/TradeHomeKpiRow";

export default function TradeHomePage() {
  const vm = useTradeHomePage();

  return (
    <div className="space-y-6">
      <TradeHomeHeader
        selectedAccount={vm.selectedAccount}
        selectedStatus={vm.selectedStatus}
        accounts={vm.accounts}
        statusOptions={vm.statusOptions}
        onChangeAccount={vm.setSelectedAccount}
        onChangeStatus={vm.setSelectedStatus}
        onRefresh={vm.refresh}
      />

      {vm.errorMessage ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {vm.errorMessage}
        </div>
      ) : null}

      <TradeHomeKpiRow kpis={vm.kpis} />

      <ActiveTradeStrategiesTable
        rows={vm.strategies}
        lastUpdatedLabel={vm.lastUpdatedLabel}
      />

      <RuntimeHighlightsTable
        rows={vm.runtimeHighlights}
        lastUpdatedLabel={vm.lastUpdatedLabel}
      />

      <ActivePositionsTable
        rows={vm.activePositions}
        lastUpdatedLabel={vm.lastUpdatedLabel}
      />

      <LatestSignalsTable
        rows={vm.signals}
        lastUpdatedLabel={vm.lastUpdatedLabel}
      />

      <OperationalWarningsPanel warnings={vm.warnings} />
    </div>
  );
}