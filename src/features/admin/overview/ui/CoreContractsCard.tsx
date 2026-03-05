import React from "react";
import { Card } from "@/presentation/components/Card";
import { AddressPill } from "@/presentation/components/AddressPill";

type ContractRow = {
  name: string;
  status: "ok" | "warn" | "bad";
  address: string;
};

const rows: ContractRow[] = [
  { name: "StrategyRegistry", status: "ok", address: "0x7a000000000000000000000000000000004e21" },
  { name: "VaultFactory", status: "ok", address: "0x3f000000000000000000000000000000009b1c" },
  { name: "FeeCollector", status: "warn", address: "0x9c000000000000000000000000000000002d4a" },
];

function dot(status: ContractRow["status"]) {
  if (status === "ok") return "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.45)]";
  if (status === "warn") return "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.45)]";
  return "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.45)]";
}

export function CoreContractsCard() {
  return (
    <Card className="relative overflow-hidden p-5 hover:border-slate-600">
      <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 rounded-bl-3xl bg-gradient-to-br from-blue-500/10 to-transparent" />
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Core Contracts</h3>

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between gap-3">
            <span className="text-sm text-slate-300">{r.name}</span>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${dot(r.status)}`} />
              <AddressPill address={r.address} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}