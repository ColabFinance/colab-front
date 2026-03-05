"use client";

import React from "react";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Badge } from "@/presentation/components/Badge";
import { TokenPill } from "@/presentation/components/TokenPill";
import { cn } from "@/shared/utils/cn";
import { VaultRow } from "../types";
import { IconArrowDown, IconArrowUp, IconExternalLink, IconEye } from "./icons";

function healthTone(h: VaultRow["health"]) {
  if (h === "healthy") return { tone: "green" as const, label: "Healthy" };
  if (h === "warning") return { tone: "amber" as const, label: "Warning" };
  return { tone: "red" as const, label: "Critical" };
}

export function MyVaultsTable({
  rows,
  onDeposit,
}: {
  rows: VaultRow[];
  onDeposit: (v: VaultRow) => void;
}) {
  return (
    <Surface variant="table">
      <SurfaceHeader className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Vaults</div>
          <div className="text-xs text-slate-500">Your deployed vaults linked to strategies.</div>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="text-slate-300">{rows.length}</span>
        </div>
      </SurfaceHeader>

      <SurfaceBody className="p-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead className="bg-slate-950/50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 border-b border-slate-800">Alias / Name</th>
                <th className="px-6 py-4 border-b border-slate-800">Vault Address</th>
                <th className="px-6 py-4 border-b border-slate-800 hidden sm:table-cell">Strategy</th>
                <th className="px-6 py-4 border-b border-slate-800 hidden lg:table-cell">Chain / DEX</th>
                <th className="px-6 py-4 border-b border-slate-800">Pair</th>
                <th className="px-6 py-4 border-b border-slate-800 text-center">Health</th>
                <th className="px-6 py-4 border-b border-slate-800 hidden xl:table-cell">Updated</th>
                <th className="px-6 py-4 border-b border-slate-800 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800 bg-slate-900">
              {rows.map((v) => {
                const ht = healthTone(v.health);
                return (
                  <tr key={v.id} className="group hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-300 border border-cyan-500/20">
                          <span className="text-xs font-semibold">V</span>
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{v.alias}</div>
                          {v.subtitle && <div className="text-[10px] text-slate-500">{v.subtitle}</div>}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <AddressPill address={v.vaultAddress} className="bg-slate-950/40" />
                    </td>

                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="text-sm text-white">{v.strategyName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{v.strategyKey}</div>
                    </td>

                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-slate-200">{v.chainName}</div>
                        <div className="text-[10px] text-slate-500 bg-slate-800 w-fit px-1.5 py-0.5 rounded">
                          {v.dexName}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <TokenPill symbol={v.token0Symbol} />
                          <span className="text-xs text-slate-600">/</span>
                          <TokenPill symbol={v.token1Symbol} />
                        </div>
                        <span className="text-xs text-slate-300">{v.pairLabel}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Badge tone={ht.tone} className="text-[10px]">
                        {ht.label}
                      </Badge>
                    </td>

                    <td className="px-6 py-4 hidden xl:table-cell">
                      <div className="text-xs text-slate-400">{v.updatedAtLabel}</div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className={cn(
                            "p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                          )}
                          title="View Details"
                        >
                          <IconEye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          className="p-1.5 text-slate-400 hover:text-green-300 hover:bg-slate-800 rounded transition-colors"
                          title="Deposit"
                          onClick={() => onDeposit(v)}
                        >
                          <IconArrowDown className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          className="p-1.5 text-slate-400 hover:text-red-300 hover:bg-slate-800 rounded transition-colors"
                          title="Withdraw"
                        >
                          <IconArrowUp className="h-4 w-4" />
                        </button>

                        {v.explorerUrl && (
                          <a
                            href={v.explorerUrl}
                            className="p-1.5 text-slate-400 hover:text-blue-300 hover:bg-slate-800 rounded transition-colors"
                            title="View on Explorer"
                          >
                            <IconExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-500">
                    No vaults found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SurfaceBody>
    </Surface>
  );
}