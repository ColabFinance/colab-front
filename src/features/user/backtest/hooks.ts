"use client";

import { useMemo, useState } from "react";
import { DEFAULT_CONFIG, INITIAL_HISTORY, STRATEGIES, TIMEFRAME_OPTIONS, mockResultsForStrategy } from "./mock";
import { BacktestConfig, BacktestResults, BacktestRun, BacktestTab } from "./types";
import { sleep } from "@/shared/utils/sleep";

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatRangeLabel(start: string, end: string) {
  // start/end are yyyy-mm-dd
  // simple label (mock): "Jan 1 - Dec 31, 2023"
  const startDt = new Date(`${start}T00:00:00`);
  const endDt = new Date(`${end}T00:00:00`);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const s = `${months[startDt.getMonth()]} ${startDt.getDate()}`;
  const e = `${months[endDt.getMonth()]} ${endDt.getDate()}, ${endDt.getFullYear()}`;
  return `${s} - ${e}`;
}

function timeframeLabel(tf: BacktestConfig["timeframe"]) {
  const m = TIMEFRAME_OPTIONS.find((x) => x.value === tf);
  return m?.label.replace("Minutes", "m").replace("Minute", "m").replace("Hour", "h").replace("Hours", "h").replace("Day", "d") ?? tf;
}

export function useBacktest() {
  const [activeTab, setActiveTab] = useState<BacktestTab>("setup");
  const [strategyId, setStrategyId] = useState<string>(STRATEGIES[0]?.id ?? "");
  const [config, setConfig] = useState<BacktestConfig>(DEFAULT_CONFIG);

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResults | null>(null);
  const [history, setHistory] = useState<BacktestRun[]>(INITIAL_HISTORY);

  const strategy = useMemo(() => STRATEGIES.find((s) => s.id === strategyId) ?? STRATEGIES[0], [strategyId]);

  const canRun = useMemo(() => {
    if (!strategyId) return false;
    if (!config.startDate || !config.endDate) return false;
    if (config.initialCapitalUsd <= 0) return false;
    return true;
  }, [strategyId, config]);

  const estimatedRuntimeLabel = useMemo(() => {
    // purely mock: timeframe affects runtime a bit
    const base =
      config.timeframe === "1m" ? 75 :
      config.timeframe === "5m" ? 45 :
      config.timeframe === "15m" ? 28 :
      config.timeframe === "1h" ? 16 :
      config.timeframe === "4h" ? 10 : 8;

    return `~${base}s`;
  }, [config.timeframe]);

  const missingMarketData = useMemo(() => {
    // mock rule: if range is too large with 1m -> show warning
    if (config.timeframe !== "1m") return false;
    const start = new Date(`${config.startDate}T00:00:00`);
    const end = new Date(`${config.endDate}T00:00:00`);
    const days = Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return days > 120;
  }, [config.startDate, config.endDate, config.timeframe]);

  function resetToDefaults() {
    setConfig(DEFAULT_CONFIG);
  }

  async function runBacktest() {
    if (!canRun) return;

    setIsRunning(true);

    // simulate processing
    await sleep(650);

    const computed = mockResultsForStrategy(strategyId);
    setResults(computed);

    // add history entry (mock incremental id)
    const now = new Date();
    const runId = `run_${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}_${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`;
    const run: BacktestRun = {
      id: runId,
      strategyId,
      dateRangeLabel: formatRangeLabel(config.startDate, config.endDate),
      timeframeLabel: timeframeLabel(config.timeframe),
      status: missingMarketData ? "failed" : "completed",
      createdAtLabel: "just now",
    };
    setHistory((prev) => [run, ...prev]);

    setActiveTab(missingMarketData ? "history" : "results");
    setIsRunning(false);
  }

  function deleteRun(runId: string) {
    setHistory((prev) => prev.filter((r) => r.id !== runId));
  }

  function viewResultsFromRun(run: BacktestRun) {
    // mock: re-render results for the strategy in that run
    const computed = mockResultsForStrategy(run.strategyId);
    setResults(computed);
    setActiveTab("results");
  }

  return {
    activeTab,
    setActiveTab,

    strategyId,
    setStrategyId,
    strategy,

    config,
    setConfig,
    resetToDefaults,

    canRun,
    isRunning,
    runBacktest,

    missingMarketData,
    estimatedRuntimeLabel,

    results,
    history,
    deleteRun,
    viewResultsFromRun,
  };
}