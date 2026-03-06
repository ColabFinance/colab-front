"use client";

import React from "react";
import { useBacktest } from "./hooks";
import { BacktestTabs } from "./ui/BacktestTabs";
import { StrategySelectorCard } from "./ui/StrategySelectorCard";
import { ConfigurationCard } from "./ui/ConfigurationCard";
import { RunSimulationCard } from "./ui/RunSimulationCard";
import { SummaryCards } from "./ui/SummaryCards";
import { ChartPlaceholder } from "./ui/ChartPlaceholder";
import { CoreMetricsTable } from "./ui/CoreMetricsTable";
import { BreakdownTree } from "./ui/BreakdownTree";
import { HistoryTable } from "./ui/HistoryTable";
import { Button } from "@/presentation/components/Button";

export default function BacktestFeaturePage() {
  const bt = useBacktest();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Backtest</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Test a strategy on historical data.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            disabled={!bt.canRun || bt.isRunning}
            onClick={bt.runBacktest}
          >
            {bt.isRunning ? "Running..." : "Run Backtest"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <BacktestTabs value={bt.activeTab} onChange={bt.setActiveTab} />

      {/* TAB: Setup */}
      {bt.activeTab === "setup" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StrategySelectorCard strategyId={bt.strategyId} onChange={bt.setStrategyId} />
            <ConfigurationCard
              config={bt.config}
              onChange={(patch) => bt.setConfig((prev) => ({ ...prev, ...patch }))}
            />
          </div>

          <div className="lg:col-span-1">
            <RunSimulationCard
              canRun={bt.canRun}
              isRunning={bt.isRunning}
              estimatedRuntimeLabel={bt.estimatedRuntimeLabel}
              missingMarketData={bt.missingMarketData}
              onRun={bt.runBacktest}
              onReset={bt.resetToDefaults}
            />
          </div>
        </div>
      )}

      {/* TAB: Results */}
      {bt.activeTab === "results" && (
        <div className="space-y-6">
          {bt.results ? (
            <>
              <SummaryCards summary={bt.results.summary} />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <ChartPlaceholder title="Equity Curve" subtitle="Mock preview (wire real series later)" height={320} />
                  <ChartPlaceholder title="Drawdown Curve" height={220} />
                </div>

                <div className="xl:col-span-1 space-y-6">
                  <CoreMetricsTable metrics={bt.results.coreMetrics} />
                  <BreakdownTree root={bt.results.breakdown} />
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-300">
              No results yet. Run a backtest to view metrics and charts.
            </div>
          )}
        </div>
      )}

      {/* TAB: History */}
      {bt.activeTab === "history" && (
        <HistoryTable
          runs={bt.history}
          onViewResults={bt.viewResultsFromRun}
          onDelete={bt.deleteRun}
        />
      )}
    </div>
  );
}