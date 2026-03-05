import React from "react";
import { Surface } from "@/presentation/components/Surface";
import { Badge } from "@/presentation/components/Badge";
import type { MyStrategyRow } from "../types";

function StrategyIdChip({ id, active }: { id: number; active: boolean }) {
  return (
    <div
      className={[
        "w-9 h-9 rounded-lg flex items-center justify-center border font-mono text-xs font-bold",
        active
          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
          : "bg-slate-800 text-slate-400 border-slate-700",
      ].join(" ")}
    >
      #{id}
    </div>
  );
}

function TokenMini({ symbol, variant }: { symbol: string; variant: "blue" | "slate" | "orange" | "green" }) {
  const cls =
    variant === "blue"
      ? "bg-blue-500"
      : variant === "orange"
      ? "bg-orange-500"
      : variant === "green"
      ? "bg-green-500"
      : "bg-slate-700";

  return (
    <div
      className={[
        "w-4 h-4 rounded-full border border-slate-900 flex items-center justify-center text-[8px] text-white font-bold",
        cls,
      ].join(" ")}
      title={symbol}
    >
      {symbol === "USDC" ? "$" : symbol === "WBTC" ? "₿" : symbol.slice(0, 1).toUpperCase()}
    </div>
  );
}

function TokenPair({ token0, token1 }: { token0: string; token1: string }) {
  // heurística simples só pra variar cor do bolinha
  const v0: any = token0 === "WBTC" ? "orange" : token0 === "ETH" ? "slate" : "green";
  const v1: any = token1 === "USDC" ? "blue" : "slate";

  return (
    <div className="flex -space-x-1">
      <TokenMini symbol={token0} variant={v0} />
      <TokenMini symbol={token1} variant={v1} />
    </div>
  );
}

export function StrategiesTable({
  rows,
  onEditParams,
}: {
  rows: MyStrategyRow[];
  onEditParams: (row: MyStrategyRow) => void;
}) {
  return (
    <Surface variant="table" className="shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-slate-950 text-xs uppercase text-slate-500 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 border-b border-slate-700">Strategy</th>
              <th className="px-6 py-4 border-b border-slate-700">Market</th>
              <th className="px-6 py-4 border-b border-slate-700">DEX / Pool</th>
              <th className="px-6 py-4 border-b border-slate-700 text-center">Status</th>
              <th className="px-6 py-4 border-b border-slate-700">Updated</th>
              <th className="px-6 py-4 border-b border-slate-700 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700 bg-slate-900">
            {rows.map((r) => {
              const active = r.status === "ACTIVE";
              return (
                <tr key={r.id} className="group hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <StrategyIdChip id={r.id} active={active} />
                      <div>
                        <div className="font-medium text-white text-sm">{r.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-slate-300">{r.symbol}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-slate-500 bg-slate-800 border border-slate-700 w-fit px-2 py-0.5 rounded">
                        {r.dexName}
                      </div>

                      <div className="flex items-center gap-2">
                        <TokenPair token0={r.token0Symbol} token1={r.token1Symbol} />
                        <span className="text-xs text-slate-300">{r.poolPairLabel}</span>
                        <span className="text-[10px] text-slate-500">{r.feeLabel}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {active ? (
                      <Badge tone="green" className="text-[10px] px-2.5 py-1">
                        ACTIVE
                      </Badge>
                    ) : (
                      <Badge tone="slate" className="text-[10px] px-2.5 py-1 text-slate-400">
                        INACTIVE
                      </Badge>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-400">{r.updatedAtLabel}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        title="View Details"
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                      >
                        <i className="fa-regular fa-eye text-sm" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        title="Edit Params"
                        onClick={() => onEditParams(r)}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <i className="fa-solid fa-sliders text-sm" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        title="Run Backtest"
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <i className="fa-solid fa-vial text-sm" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        title="Create Vault"
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <i className="fa-solid fa-piggy-bank text-sm" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}