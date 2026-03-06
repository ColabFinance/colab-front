"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { Button } from "@/presentation/components/Button";

export function RunSimulationCard({
  canRun,
  isRunning,
  estimatedRuntimeLabel,
  missingMarketData,
  onRun,
  onReset,
}: {
  canRun: boolean;
  isRunning: boolean;
  estimatedRuntimeLabel: string;
  missingMarketData: boolean;
  onRun: () => void;
  onReset: () => void;
}) {
  return (
    <Surface variant="panel" className="h-full">
      <SurfaceHeader>
        <div className="text-sm font-semibold text-white">Run Simulation</div>
      </SurfaceHeader>

      <SurfaceBody className="flex flex-col h-full">
        <div className="text-sm text-slate-400">
          Ready to process. Estimated runtime:{" "}
          <span className="text-slate-200 font-mono">{estimatedRuntimeLabel}</span>
        </div>

        {missingMarketData && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <div className="text-xs font-semibold text-red-300">Missing Market Data</div>
            <div className="text-[11px] text-red-200/80 mt-1">
              Data for the selected range is incomplete. Try adjusting the date range or timeframe.
            </div>
          </div>
        )}

        <div className="mt-auto space-y-3 pt-6">
          <Button
            variant="primary"
            className="w-full justify-center py-3"
            disabled={!canRun || isRunning}
            onClick={onRun}
          >
            {isRunning ? "Running..." : "Run Backtest"}
          </Button>

          <button
            type="button"
            onClick={onReset}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Reset to defaults
          </button>
        </div>
      </SurfaceBody>
    </Surface>
  );
}