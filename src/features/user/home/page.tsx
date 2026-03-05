"use client";

import React from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { Button } from "@/presentation/components/Button";
import { Surface } from "@/presentation/components/Surface";

import { useUserHome } from "./hooks";
import { KpiGrid } from "./ui/KpiGrid";
import { MySnapshot } from "./ui/MySnapshot";
import { TopVaultsTable } from "./ui/TopVaultsTable";
import { DepositModal } from "./ui/DepositModal";

export default function UserHomePage() {
  const { authenticated, login } = usePrivy();
  const { ownerAddr } = useOwnerAddress();

  const {
    chainScope,
    setChainScope,
    vaultQuery,
    setVaultQuery,
    kpis,
    snapshot,
    filteredVaults,
    depositOpen,
    selectedVault,
    openDeposit,
    closeDeposit,
  } = useUserHome();

  const walletConnected = Boolean(authenticated && ownerAddr);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">Home</h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl">
            Welcome back! Here's an overview of the protocol performance and your positions.
          </p>
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-1">
          <button
            className={[
              "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
              chainScope === "current"
                ? "bg-slate-800 text-white shadow-sm border border-slate-600"
                : "text-slate-400 hover:text-white",
            ].join(" ")}
            onClick={() => setChainScope("current")}
            type="button"
          >
            Current Chain
          </button>
          <button
            className={[
              "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
              chainScope === "all"
                ? "bg-slate-800 text-white shadow-sm border border-slate-600"
                : "text-slate-400 hover:text-white",
            ].join(" ")}
            onClick={() => setChainScope("all")}
            type="button"
          >
            All Chains
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <KpiGrid items={kpis} />

      {/* My Snapshot */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-camera text-blue-400" aria-hidden="true" /> My Snapshot
          </h2>

          <Link
            href="/portfolio"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
          >
            Go to Portfolio <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>

        {walletConnected ? (
          <MySnapshot data={snapshot} />
        ) : (
          <Surface variant="panel" className="p-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-white font-semibold">Connect your wallet</div>
              <div className="text-xs text-slate-400 mt-1">
                To see your snapshot (deposited, value, profit), connect via Privy.
              </div>
            </div>
            <Button variant="primary" onClick={() => login()}>
              Connect Wallet
            </Button>
          </Surface>
        )}
      </div>

      {/* Top vaults */}
      <TopVaultsTable query={vaultQuery} onQuery={setVaultQuery} rows={filteredVaults} onDeposit={openDeposit} />

      {/* Footer */}
      <div className="pt-8 pb-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Protocol Dashboard. All rights reserved.
      </div>

      <DepositModal
        open={depositOpen}
        vault={selectedVault}
        onClose={closeDeposit}
        onConfirm={() => closeDeposit()}
        onLogin={() => login()}
        canConfirm={walletConnected}
      />
    </div>
  );
}