"use client";

import React from "react";
import Link from "next/link";
import type { StrategyDetails } from "../types";

export function StrategyIdentityHeader({
  strategy,
  onEdit,
}: {
  strategy: StrategyDetails;
  onEdit: () => void;
}) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 pb-4 border-b border-slate-700/50">
      <div className="flex gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <i className="fa-solid fa-chess-knight text-white text-2xl" aria-hidden="true" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{strategy.name}</h1>
            <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-400">
              {strategy.symbol}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
                strategy.status === "ACTIVE"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-slate-700/20 border-slate-600/20 text-slate-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  strategy.status === "ACTIVE" ? "bg-green-400" : "bg-slate-500"
                }`}
              />
              {strategy.status}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300">
              {strategy.chainName}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300">
              <i className="fa-solid fa-arrow-right-arrow-left text-xs text-cyan-400" aria-hidden="true" />
              {strategy.dexName}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300">
              {strategy.pairLabel}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300">
              {strategy.feeTierLabel}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
                strategy.isPublic
                  ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                  : "bg-slate-700/20 border-slate-600/20 text-slate-400"
              }`}
            >
              {strategy.isPublic ? "Public" : "Private"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
        {strategy.vaultHref ? (
          <Link
            href={strategy.vaultHref}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-cyan-400" aria-hidden="true" />
            Open Linked Vault
          </Link>
        ) : null}

        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-sliders" aria-hidden="true" />
          Edit Params
        </button>
      </div>
    </div>
  );
}