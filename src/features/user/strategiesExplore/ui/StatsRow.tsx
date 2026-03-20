import React from "react";
import { Card } from "@/presentation/components/Card";

function fmtInt(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function StatsRow({
  totalStrategies,
  activeStrategies,
  inactiveStrategies,
  linkedVaults,
}: {
  totalStrategies: number;
  activeStrategies: number;
  inactiveStrategies: number;
  linkedVaults: number;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Strategies</div>
        <div className="text-2xl font-bold text-white">{fmtInt(totalStrategies)}</div>
      </Card>

      <Card className="p-4">
        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Active</div>
        <div className="text-2xl font-bold text-green-400">{fmtInt(activeStrategies)}</div>
      </Card>

      <Card className="p-4">
        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Inactive</div>
        <div className="text-2xl font-bold text-slate-400">{fmtInt(inactiveStrategies)}</div>
      </Card>

      <Card className="p-4">
        <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Linked Vaults</div>
        <div className="text-2xl font-bold text-cyan-400">{fmtInt(linkedVaults)}</div>
      </Card>
    </div>
  );
}