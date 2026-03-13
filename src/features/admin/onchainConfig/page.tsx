"use client";

import React, { useMemo, useState } from "react";
import { Badge } from "@/presentation/components/Badge";
import { Button } from "@/presentation/components/Button";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Surface, SurfaceBody } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";

import { useOnchainConfig } from "./hooks";
import { Tabs } from "./ui/Tabs";
import { AllowlistTable, AddressCell, StatusBadge } from "./ui/AllowlistTable";
import { ConfigFieldRow } from "./ui/ConfigFieldRow";
import { ReportersList } from "./ui/ReportersList";
import { ConfirmTxModal } from "./ui/ConfirmTxModal";

export default function OnchainConfigPage() {
  const uc = useOnchainConfig();

  const [newRouterName, setNewRouterName] = useState("");
  const [newRouterAddr, setNewRouterAddr] = useState("");

  const [newAdapterLabel, setNewAdapterLabel] = useState("");
  const [newAdapterType, setNewAdapterType] = useState("");
  const [newAdapterAddr, setNewAdapterAddr] = useState("");

  const [newDepositorAddr, setNewDepositorAddr] = useState("");
  const [newDepositorLabel, setNewDepositorLabel] = useState("");

  const chainLabel = useMemo(() => {
    return uc.chainOptions.find((c) => c.chainId === uc.chainId)?.name ?? "Unknown";
  }, [uc.chainId, uc.chainOptions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              On-chain Config & Allowlists
            </h1>

            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1">
              <span className="text-xs font-medium text-slate-300">{chainLabel}</span>
              <select
                value={uc.chainId}
                onChange={(e) => uc.setChainId(Number(e.target.value))}
                className="bg-transparent text-xs text-slate-400 outline-none"
              >
                {uc.chainOptions.map((c) => (
                  <option key={c.chainId} value={c.chainId}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl">
            Manage protocol parameters, allowlists, and contract configurations on-chain.
          </p>

          <div className="flex items-center gap-3">
            <input
              value={uc.search}
              onChange={(e) => uc.setSearch(e.target.value)}
              placeholder="Search parameters, addresses..."
              className="w-full max-w-xl rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500"
            />
            <div className="hidden md:block">
              <Badge tone="amber">Admin Access</Badge>
            </div>
          </div>
        </div>

        <div className="flex md:flex-col items-start md:items-end gap-3">
          <Badge tone="amber" className="md:hidden">
            Admin Access
          </Badge>

          <div className="text-right">
            <div className="font-medium text-slate-400 text-[10px] md:text-xs">
              {uc.activeContractLabel}
            </div>
            {uc.activeContractAddress ? (
              <AddressPill address={uc.activeContractAddress} withCopy={true} className="mt-1" />
            ) : (
              <div className="mt-1 text-xs text-slate-500">No active contract record</div>
            )}
          </div>
        </div>
      </div>

      {uc.error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {uc.error}
        </div>
      )}

      {uc.loading && (
        <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300">
          Loading current chain configuration...
        </div>
      )}

      <Tabs active={uc.activeTab} onChange={uc.setActiveTab} />

      {uc.activeTab === "strategyRegistry" && (
        <div className="space-y-6">
          <AllowlistTable
            title="Routers Allowlist"
            description="Admin snapshots cross-checked with the StrategyRegistry contract."
            secondaryAction={{ label: "Bulk Paste", onClick: uc.bulkPasteRouters }}
            primaryAction={{
              label: "Add Router",
              onClick: () => {
                uc.addRouter(newRouterName, newRouterAddr);
                setNewRouterName("");
                setNewRouterAddr("");
              },
            }}
            columns={[
              {
                header: "Router Name",
                cell: (r: any) => <div className="text-sm text-white font-medium">{r.name}</div>,
              },
              {
                header: "Address",
                cell: (r: any) => <AddressCell address={r.address} />,
              },
              {
                header: "Saved",
                className: "text-center",
                cell: (r: any) => (
                  <div className="flex justify-center">
                    <Badge tone={r.desiredAllowed ? "blue" : "slate"} className="text-[10px]">
                      {r.desiredAllowed ? "Allowed" : "Revoked"}
                    </Badge>
                  </div>
                ),
              },
              {
                header: "On-chain",
                className: "text-center",
                cell: (r: any) => <StatusBadge status={r.onchainAllowed ? "active" : "disabled"} />,
              },
              {
                header: "Actions",
                className: "text-right",
                cell: (r: any) => (
                  <button
                    type="button"
                    className="text-red-300 hover:text-red-200 text-xs font-medium hover:underline"
                    onClick={() => uc.removeRouter(r.id)}
                  >
                    Revoke
                  </button>
                ),
              },
            ]}
            rows={uc.routers}
            rowKey={(r: any) => r.id}
            emptyLabel="No routers saved for the active StrategyRegistry."
          />

          <Surface variant="panel" className="bg-slate-900 border border-slate-700">
            <SurfaceBody className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                <input
                  value={newRouterName}
                  onChange={(e) => setNewRouterName(e.target.value)}
                  placeholder="Router name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
                <input
                  value={newRouterAddr}
                  onChange={(e) => setNewRouterAddr(e.target.value)}
                  placeholder="0x..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500"
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-2">
                Bulk paste still requires one wallet confirmation per address because the contract has no batch method.
              </div>
            </SurfaceBody>
          </Surface>

          <AllowlistTable
            title="Adapters Allowlist"
            description="Saved adapter entries cross-checked with the StrategyRegistry contract."
            secondaryAction={{ label: "Bulk Paste", onClick: uc.bulkPasteAdapters }}
            primaryAction={{
              label: "Add Adapter",
              onClick: () => {
                uc.addAdapter(newAdapterLabel, newAdapterType, newAdapterAddr);
                setNewAdapterLabel("");
                setNewAdapterType("");
                setNewAdapterAddr("");
              },
            }}
            columns={[
              {
                header: "Adapter ID",
                cell: (a: any) => <div className="text-sm text-white font-medium">{a.label}</div>,
              },
              {
                header: "Type",
                cell: (a: any) => <div className="text-xs text-slate-400">{a.adapterType}</div>,
              },
              {
                header: "Address",
                cell: (a: any) => <AddressCell address={a.address} />,
              },
              {
                header: "Saved",
                className: "text-center",
                cell: (a: any) => (
                  <div className="flex justify-center">
                    <Badge tone={a.desiredAllowed ? "blue" : "slate"} className="text-[10px]">
                      {a.desiredAllowed ? "Allowed" : "Revoked"}
                    </Badge>
                  </div>
                ),
              },
              {
                header: "On-chain",
                className: "text-center",
                cell: (a: any) => <StatusBadge status={a.onchainAllowed ? "active" : "disabled"} />,
              },
              {
                header: "Actions",
                className: "text-right",
                cell: (a: any) => (
                  <button
                    type="button"
                    className="text-red-300 hover:text-red-200 text-xs font-medium hover:underline"
                    onClick={() => uc.removeAdapter(a.id)}
                  >
                    Revoke
                  </button>
                ),
              },
            ]}
            rows={uc.adapters}
            rowKey={(a: any) => a.id}
            emptyLabel="No adapters saved for the active StrategyRegistry."
          />

          <Surface variant="panel" className="bg-slate-900 border border-slate-700">
            <SurfaceBody className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                <input
                  value={newAdapterLabel}
                  onChange={(e) => setNewAdapterLabel(e.target.value)}
                  placeholder="Adapter label"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
                <input
                  value={newAdapterType}
                  onChange={(e) => setNewAdapterType(e.target.value)}
                  placeholder="Type (e.g. PancakeV3)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
                <input
                  value={newAdapterAddr}
                  onChange={(e) => setNewAdapterAddr(e.target.value)}
                  placeholder="0x..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500"
                />
              </div>
            </SurfaceBody>
          </Surface>
        </div>
      )}

      {uc.activeTab === "vaultFactory" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Surface variant="panel" className="bg-slate-900 border border-slate-700">
            <SurfaceBody>
              <div className="text-lg font-semibold text-white mb-2">Factory Configuration</div>
              <div className="text-xs text-slate-500 mb-6">
                Last saved admin snapshot: {uc.vaultFactorySavedAtLabel || "—"}
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <ConfigFieldRow
                    label="Executor Address"
                    currentValue={
                      <span className="font-mono text-sm text-slate-300">
                        {uc.vaultFactory.executorAddress}
                      </span>
                    }
                    right={
                      <input
                        value={uc.vaultFactoryDraft.executorAddress ?? ""}
                        onChange={(e) =>
                          uc.setVaultFactoryDraft((p) => ({ ...p, executorAddress: e.target.value }))
                        }
                        placeholder="New Address (0x...)"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono outline-none focus:border-cyan-500"
                      />
                    }
                  />

                  <ConfigFieldRow
                    label="Fee Collector Address"
                    currentValue={
                      <span className="font-mono text-sm text-slate-300">
                        {uc.vaultFactory.feeCollectorAddress}
                      </span>
                    }
                    right={
                      <input
                        value={uc.vaultFactoryDraft.feeCollectorAddress ?? ""}
                        onChange={(e) =>
                          uc.setVaultFactoryDraft((p) => ({ ...p, feeCollectorAddress: e.target.value }))
                        }
                        placeholder="New Address (0x...)"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono outline-none focus:border-cyan-500"
                      />
                    }
                  />
                </div>

                <div className="h-px bg-slate-700" />

                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    Vault Defaults
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MiniNumberRow
                      label="Cooldown (Sec)"
                      current={uc.vaultFactory.cooldownSec}
                      draft={uc.vaultFactoryDraft.cooldownSec}
                      onDraft={(v) => uc.setVaultFactoryDraft((p) => ({ ...p, cooldownSec: v }))}
                    />

                    <MiniNumberRow
                      label="Max Slippage (Bps)"
                      current={uc.vaultFactory.maxSlippageBps}
                      draft={uc.vaultFactoryDraft.maxSlippageBps}
                      onDraft={(v) => uc.setVaultFactoryDraft((p) => ({ ...p, maxSlippageBps: v }))}
                    />

                    <div className="space-y-2">
                      <div className="text-sm text-slate-400">Default Allow Swap</div>
                      <div className="flex items-center gap-3 h-[40px]">
                        <Badge tone={uc.vaultFactory.allowSwap ? "green" : "slate"} className="text-[10px]">
                          {uc.vaultFactory.allowSwap ? "TRUE" : "FALSE"}
                        </Badge>

                        <span className="text-slate-600">→</span>

                        <Toggle
                          value={
                            typeof uc.vaultFactoryDraft.allowSwap === "boolean"
                              ? uc.vaultFactoryDraft.allowSwap
                              : uc.vaultFactory.allowSwap
                          }
                          onChange={(v) => uc.setVaultFactoryDraft((p) => ({ ...p, allowSwap: v }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button variant="primary" className="text-sm" onClick={uc.requestApplyVaultFactory}>
                      Apply Changes
                    </Button>
                  </div>
                </div>
              </div>
            </SurfaceBody>
          </Surface>
        </div>
      )}

      {uc.activeTab === "protocolFeeCollector" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Surface variant="panel" className="bg-slate-900 border border-slate-700">
            <SurfaceBody>
              <div className="text-lg font-semibold text-white mb-2">Protocol Fees</div>
              <div className="text-xs text-slate-500 mb-4">
                Last saved admin snapshot: {uc.protocolFeeSavedAtLabel || "—"}
              </div>

              <div className="space-y-6">
                <ConfigFieldRow
                  label="Treasury Address"
                  currentValue={
                    <span className="font-mono text-sm text-slate-300">
                      {uc.protocolFee.treasuryAddress}
                    </span>
                  }
                  right={
                    <input
                      value={uc.protocolFeeDraft.treasuryAddress ?? ""}
                      onChange={(e) =>
                        uc.setProtocolFeeDraft((p) => ({ ...p, treasuryAddress: e.target.value }))
                      }
                      placeholder="New Address (0x...)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono outline-none focus:border-cyan-500"
                    />
                  }
                />

                <ConfigFieldRow
                  label="Protocol Fee (Bps)"
                  currentLabel="Current On-chain Value"
                  currentValue={
                    <span className="font-mono text-sm text-slate-300">
                      {uc.protocolFee.feeBps}{" "}
                      <span className="text-slate-500 text-xs">
                        ({(uc.protocolFee.feeBps / 100).toFixed(2)}%)
                      </span>
                    </span>
                  }
                  right={
                    <input
                      type="number"
                      min={0}
                      max={5000}
                      value={typeof uc.protocolFeeDraft.feeBps === "number" ? uc.protocolFeeDraft.feeBps : ""}
                      onChange={(e) =>
                        uc.setProtocolFeeDraft((p) => ({
                          ...p,
                          feeBps: e.target.value === "" ? undefined : Number(e.target.value),
                        }))
                      }
                      placeholder="e.g. 500"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono outline-none focus:border-cyan-500"
                    />
                  }
                />

                <div className="flex justify-end pt-2">
                  <Button variant="primary" onClick={uc.requestApplyProtocolFee}>
                    Apply Changes
                  </Button>
                </div>
              </div>
            </SurfaceBody>
          </Surface>

          <ReportersList items={uc.reporters} onAdd={uc.addReporter} onRemove={uc.removeReporter} />
        </div>
      )}

      {uc.activeTab === "vaultFeeBuffer" && (
        <Surface variant="panel" className="bg-slate-900 border border-slate-700 max-w-5xl">
          <SurfaceBody>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-lg font-semibold text-white">Depositors Allowlist</div>
                <div className="text-sm text-slate-400">
                  Saved depositor entries cross-checked with the active VaultFeeBuffer contract.
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <input
                  value={newDepositorAddr}
                  onChange={(e) => setNewDepositorAddr(e.target.value)}
                  placeholder="0x..."
                  className="bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white font-mono outline-none focus:border-cyan-500 w-full md:w-72"
                />
                <input
                  value={newDepositorLabel}
                  onChange={(e) => setNewDepositorLabel(e.target.value)}
                  placeholder="Label"
                  className="bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-cyan-500 w-full md:w-64"
                />
                <Button
                  variant="primary"
                  className="px-4 py-2"
                  onClick={() => {
                    uc.addDepositor(newDepositorAddr, newDepositorLabel);
                    setNewDepositorAddr("");
                    setNewDepositorLabel("");
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950/60 text-xs uppercase text-slate-500 font-semibold">
                    <tr>
                      <th className="px-6 py-3 border-b border-slate-700">Address</th>
                      <th className="px-6 py-3 border-b border-slate-700">Label</th>
                      <th className="px-6 py-3 border-b border-slate-700 text-center">Saved</th>
                      <th className="px-6 py-3 border-b border-slate-700 text-center">On-chain</th>
                      <th className="px-6 py-3 border-b border-slate-700 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 bg-slate-900">
                    {uc.depositors.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-3">
                          <AddressPill address={d.address} />
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-400">{d.label}</td>
                        <td className="px-6 py-3 text-center">
                          <Badge tone={d.desiredAllowed ? "blue" : "slate"} className="text-[10px]">
                            {d.desiredAllowed ? "Allowed" : "Revoked"}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <Badge tone={d.onchainAllowed ? "green" : "red"} className="text-[10px]">
                            {d.onchainAllowed ? "Allowed" : "Revoked"}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            type="button"
                            className="text-red-300 hover:text-red-200 text-xs font-medium"
                            onClick={() => uc.revokeDepositor(d.id)}
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                    {uc.depositors.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-6 text-sm text-slate-400">
                          No depositors saved for the active VaultFeeBuffer.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </SurfaceBody>
        </Surface>
      )}

      <ConfirmTxModal
        open={uc.confirmOpen}
        tx={uc.pendingTx}
        onClose={uc.closeConfirm}
        onExecute={uc.executePendingTxMock}
      />

      <div className="pt-8 pb-4 text-center text-xs text-slate-600">
        &copy; Protocol Admin Dashboard. All actions are recorded on-chain and mirrored in admin storage.
      </div>
    </div>
  );
}

function MiniNumberRow({
  label,
  current,
  draft,
  onDraft,
}: {
  label: string;
  current: number;
  draft?: number;
  onDraft: (v?: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="flex items-center gap-2">
        <div className="bg-slate-950/60 px-3 py-2 rounded border border-slate-700 text-sm text-slate-300 w-24 text-center">
          {current}
        </div>
        <span className="text-slate-600">→</span>
        <input
          type="number"
          value={typeof draft === "number" ? draft : ""}
          onChange={(e) => onDraft(e.target.value === "" ? undefined : Number(e.target.value))}
          className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white w-full outline-none focus:border-cyan-500"
          placeholder="New val"
        />
      </div>
    </div>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
        "border-slate-700 bg-slate-800",
        value && "bg-cyan-500/60"
      )}
      aria-pressed={value}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          value ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
}