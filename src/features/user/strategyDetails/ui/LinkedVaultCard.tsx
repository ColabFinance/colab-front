"use client";

import React from "react";
import Link from "next/link";
import { Surface, SurfaceBody, SurfaceHeader } from "@/presentation/components/Surface";
import type { StrategyDetails, VaultUsingStrategy } from "../types";

export function LinkedVaultCard({
  strategy,
  vaults,
}: {
  strategy: StrategyDetails;
  vaults: VaultUsingStrategy[];
}) {
  const linkedVault = vaults[0] || null;
  const href = linkedVault?.href || strategy.vaultHref || null;
  const label = linkedVault?.name || strategy.vaultAlias || "Not linked";
  const address = linkedVault?.address || "";

  return (
    <Surface variant="panel" className="bg-slate-900 border-slate-700 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
      <SurfaceHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <i className="fa-solid fa-link text-cyan-400" aria-hidden="true" />
            Linked Vault
          </h2>

          <span
            className={`px-2 py-0.5 rounded text-xs font-medium border ${
              href
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-slate-700/20 text-slate-400 border-slate-600/20"
            }`}
          >
            {href ? "Linked" : "Not Linked"}
          </span>
        </div>
      </SurfaceHeader>

      <SurfaceBody>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-950/50 rounded border border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
              V
            </div>

            <div>
              <div className="font-medium text-white mb-0.5">{label}</div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                {address ? <span className="font-mono">{address}</span> : <span>No vault linked yet</span>}
              </div>
            </div>
          </div>

          {href ? (
            <Link
              href={href}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
              Open Linked Vault
            </Link>
          ) : null}
        </div>
      </SurfaceBody>
    </Surface>
  );
}