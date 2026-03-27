"use client";

import * as React from "react";
import { CONTRACT_DEFINITIONS, INITIAL_MODE_BY_TAB } from "./config";
import { useContractsData } from "./hooks";
import type { ContractMode, ContractTabKey } from "./types";
import ContractModeSwitch from "./ui/ContractModeSwitch";
import ContractSummaryCard from "./ui/ContractSummaryCard";
import ContractsTabs from "./ui/ContractsTabs";
import DeploymentHistoryTable from "./ui/DeploymentHistoryTable";
import DeployForm from "./ui/DeployForm";
import EmptyContractState from "./ui/EmptyContractState";
import RegisterForm from "./ui/RegisterForm";
import { ChevronDownIcon } from "./ui/icons";

export default function ContractsPage() {
  const [activeTab, setActiveTab] =
    React.useState<ContractTabKey>("strategy-registry");

  const [modeByTab, setModeByTab] =
    React.useState<Record<ContractTabKey, ContractMode>>(
      INITIAL_MODE_BY_TAB as Record<ContractTabKey, ContractMode>
    );

  const {
    chainsLoading,
    contractsLoading,
    errorMessage,
    setErrorMessage,
    chainOptions,
    selectedChain,
    setSelectedChain,
    currentChain,
    submittingKey,
    createContract,
    getActiveRecord,
    getHistory,
  } = useContractsData();

  const current = React.useMemo(
    () => CONTRACT_DEFINITIONS.find((item) => item.key === activeTab),
    [activeTab]
  );

  const configuredCount = React.useMemo(() => {
    return CONTRACT_DEFINITIONS.filter((item) => !!getActiveRecord(item.key)).length;
  }, [getActiveRecord]);

  const missingCount = CONTRACT_DEFINITIONS.length - configuredCount;

  const tabs = React.useMemo(
    () =>
      CONTRACT_DEFINITIONS.map((item) => ({
        key: item.key,
        label: item.name,
        missing: !getActiveRecord(item.key),
      })),
    [getActiveRecord]
  );

  if (!current) return null;

  const activeRecord = getActiveRecord(activeTab);
  const history = getHistory(activeTab);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
            Global Contracts
          </h1>

          <div className="relative">
            <select
              value={selectedChain}
              onChange={(event) => setSelectedChain(event.target.value as "base" | "bnb")}
              disabled={chainsLoading || chainOptions.length === 0}
              className="appearance-none rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 pr-8 text-sm text-slate-200 outline-none transition-colors hover:border-cyan-500/50 focus:border-cyan-500"
            >
              <option value="">
                {chainsLoading ? "Loading chains..." : "Select chain"}
              </option>
              {chainOptions.map((chain) => (
                <option key={chain.value} value={chain.value}>
                  {chain.label}
                </option>
              ))}
            </select>

            <ChevronDownIcon
              size={12}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>

          {contractsLoading ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              Loading
            </span>
          ) : missingCount === 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Configured
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {missingCount} Incomplete
            </span>
          )}
        </div>

        <p className="text-sm text-slate-400 md:text-base">
          Deploy and list core protocol contracts using the real admin API.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-red-300">Operation failed</div>
              <p className="mt-1 text-sm text-red-100/80">{errorMessage}</p>
            </div>

            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="text-sm text-red-300 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-6">
        <ContractsTabs active={activeTab} tabs={tabs} onChange={setActiveTab} />

        <div className="space-y-6">
          {activeRecord ? (
            <ContractSummaryCard contract={current} record={activeRecord} />
          ) : (
            <EmptyContractState contract={current} />
          )}

          <ContractModeSwitch
            contractName={current.name}
            activeMode={modeByTab[activeTab]}
            onChange={(mode) =>
              setModeByTab((prev) => ({
                ...prev,
                [activeTab]: mode,
              }))
            }
          />

          {modeByTab[activeTab] === "deploy" ? (
            <DeployForm
              contract={current}
              chainLabel={currentChain?.label || "No chain selected"}
              submitting={submittingKey === activeTab}
              onSubmit={(values) => createContract(activeTab, values)}
            />
          ) : (
            <RegisterForm
              contract={current}
              chainLabel={currentChain?.label || "No chain selected"}
            />
          )}

          <DeploymentHistoryTable
            contractName={current.name}
            chainLabel={currentChain?.label || "Unknown chain"}
            history={history}
          />
        </div>
      </div>

      <div className="border-t border-slate-800/60 pt-8 pb-4 text-center text-xs text-slate-600">
        <p>&copy; 2024 Protocol Admin Dashboard. All actions are recorded on-chain.</p>
      </div>
    </div>
  );
}