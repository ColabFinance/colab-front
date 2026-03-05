"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { Button } from "@/presentation/components/Button";
import { Surface } from "@/presentation/components/Surface";
import { AddressPill } from "@/presentation/components/AddressPill";

import { useMyStrategies } from "./hooks";
import { StrategiesTable } from "./ui/StrategiesTable";
import { CreateStrategyModal } from "./ui/CreateStrategyModal";
import { EditParamsDrawer } from "./ui/EditParamsDrawer";

export default function MyStrategiesFeaturePage() {
  const { authenticated, login } = usePrivy();
  const { ownerAddr } = useOwnerAddress();

  const walletConnected = Boolean(authenticated && ownerAddr);

  const {
    dexOptions,
    poolOptions,
    rows,
    hasRows,

    createOpen,
    openCreate,
    closeCreate,
    createDraft,
    setCreateDraft,
    confirmCreate,

    editOpen,
    selected,
    openEdit,
    closeEdit,
    editDraft,
    setEditDraft,
    saveParams,

    refresh,
  } = useMyStrategies();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">My Strategies</h1>
          <p className="text-slate-400 text-sm">Manage your on-chain strategies and parameters</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={refresh}
            leftIcon={<i className="fa-solid fa-rotate" aria-hidden="true" />}
          >
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => (walletConnected ? openCreate() : login())}
            leftIcon={<i className="fa-solid fa-plus" aria-hidden="true" />}
          >
            Create Strategy
          </Button>
        </div>
      </div>

      {/* Wallet & Chain Info (padronizado: bg-slate-900 + border-slate-700) */}
      <Surface variant="panel" className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Connected Wallet:</span>
            {walletConnected ? (
              <AddressPill address={ownerAddr!} />
            ) : (
              <button
                type="button"
                onClick={() => login()}
                className="text-xs text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                Connect wallet
              </button>
            )}
          </div>

          <div className="w-px h-4 bg-slate-700" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Chain:</span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-slate-700 bg-slate-950">
              <img
                className="w-3 h-3 rounded-full"
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7d185396ad-984de75c3894856decf1.png"
                alt="ethereum icon"
              />
              <span className="text-xs text-slate-300">Ethereum</span>
            </div>
          </div>
        </div>
      </Surface>

      {/* Table or Empty */}
      {hasRows ? (
        <StrategiesTable rows={rows} onEditParams={openEdit} />
      ) : (
        <Surface variant="panel" className="p-16 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <i className="fa-solid fa-robot text-slate-500 text-3xl" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">No Strategies Yet</h3>
          <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
            You haven&apos;t created any strategies yet. Get started by creating your first automated strategy.
          </p>
          <Button
            variant="primary"
            onClick={() => (walletConnected ? openCreate() : login())}
            leftIcon={<i className="fa-solid fa-plus" aria-hidden="true" />}
          >
            Create Strategy
          </Button>
        </Surface>
      )}

      <CreateStrategyModal
        open={createOpen}
        onClose={closeCreate}
        onConfirm={confirmCreate}
        dexOptions={dexOptions}
        poolOptions={poolOptions}
        draft={createDraft}
        onDraft={setCreateDraft}
      />

      <EditParamsDrawer
        open={editOpen}
        onClose={closeEdit}
        selected={selected}
        draft={editDraft}
        onDraft={setEditDraft}
        onSave={saveParams}
      />
    </div>
  );
}