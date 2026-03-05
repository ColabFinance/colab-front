"use client";

import * as React from "react";
import Tabs from "./ui/Tabs";
import MissingContractsAlert from "./ui/MissingContractsAlert";
import ContractSummaryCard from "./ui/ContractSummaryCard";
import RightColumn from "./ui/RightColumn";
import ProtocolFeeCollectorEmpty from "./ui/ProtocolFeeCollectorEmpty";
import DeployModal from "./ui/DeployModal";
import RegisterModal from "./ui/RegisterModal";
import { PlusIcon } from "./ui/icons";
import { CHAIN_LABEL, CHAIN_SHORT, GLOBAL_CONTRACTS } from "./mock";
import { ContractTabKey, GlobalContract } from "./types";

export default function ContractsPage() {
  const [activeTab, setActiveTab] = React.useState<ContractTabKey>("strategy-registry");

  const [deployOpen, setDeployOpen] = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [modalContractName, setModalContractName] = React.useState("ProtocolFeeCollector");

  const byKey = React.useMemo(() => {
    const map = new Map<ContractTabKey, GlobalContract>();
    for (const c of GLOBAL_CONTRACTS) map.set(c.key, c);
    return map;
  }, []);

  const tabs = React.useMemo(
    () => [
      { key: "strategy-registry" as const, label: "StrategyRegistry", missing: byKey.get("strategy-registry")?.status === "missing" },
      { key: "vault-factory" as const, label: "VaultFactory", missing: byKey.get("vault-factory")?.status === "missing" },
      { key: "protocol-fee-collector" as const, label: "ProtocolFeeCollector", missing: byKey.get("protocol-fee-collector")?.status === "missing" },
      { key: "vault-fee-buffer" as const, label: "VaultFeeBuffer", missing: byKey.get("vault-fee-buffer")?.status === "missing" },
    ],
    [byKey]
  );

  const missing = React.useMemo(() => GLOBAL_CONTRACTS.filter((c) => c.status === "missing"), []);
  const missingNames = React.useMemo(() => missing.map((m) => m.name), [missing]);

  const current = byKey.get(activeTab);

  const openDeploy = (contractName: string) => {
    setModalContractName(contractName);
    setDeployOpen(true);
  };

  const openRegister = (contractName: string) => {
    setModalContractName(contractName);
    setRegisterOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
              Global Contracts
            </h1>

            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-medium text-slate-200">{CHAIN_SHORT}</span>
              <span className="text-[10px] text-slate-500">▼</span>
            </div>

            {missing.length ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                {missing.length} Incomplete
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                All Set
              </span>
            )}
          </div>

          <p className="text-sm text-slate-400 md:text-base">
            Deploy and register core protocol contracts for this network{" "}
            <span className="text-slate-200 font-medium">({CHAIN_LABEL})</span>.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => openRegister(current?.name ?? "ProtocolFeeCollector")}
            className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-cyan-500 sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <PlusIcon size={18} />
            New Contract
          </button>
        </div>
      </div>

      {/* Alert */}
      <MissingContractsAlert
        missingNames={missingNames}
        onResolve={() => setActiveTab(missing[0]?.key ?? "protocol-fee-collector")}
      />

      {/* Tabs */}
      <div className="space-y-6">
        <Tabs active={activeTab} tabs={tabs} onChange={setActiveTab} />

        {/* Content */}
        {current?.status === "missing" ? (
          <ProtocolFeeCollectorEmpty
            onDeploy={() => openDeploy(current.name)}
            onRegister={() => openRegister(current.name)}
          />
        ) : current ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ContractSummaryCard contract={current} onOpenRegister={openRegister} />
            <RightColumn contract={current} />
          </div>
        ) : null}
      </div>

      <div className="border-t border-slate-800/60 pt-8 pb-4 text-center text-xs text-slate-600">
        <p>&copy; 2024 Protocol Admin Dashboard. All actions are recorded on-chain.</p>
      </div>

      {/* Modals */}
      <DeployModal
        open={deployOpen}
        contractName={modalContractName}
        onClose={() => setDeployOpen(false)}
      />

      <RegisterModal
        open={registerOpen}
        contractName={modalContractName}
        onClose={() => setRegisterOpen(false)}
      />
    </div>
  );
}