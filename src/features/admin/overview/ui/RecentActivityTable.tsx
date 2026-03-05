import React from "react";
import { Card } from "@/presentation/components/Card";
import { Icon } from "@/presentation/icons/Icon";
import { Badge } from "@/presentation/components/Badge";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Button } from "@/presentation/components/Button";

type Row = {
  type: string;
  tone: "blue" | "green" | "amber" | "slate";
  details: React.ReactNode;
  tx: string;
  time: string;
};

const rows: Row[] = [
  {
    type: "Add Pool",
    tone: "blue",
    details: (
      <>
        Registered <span className="font-medium text-white">USDC-WETH 0.05%</span> on Uniswap V3
      </>
    ),
    tx: "0x8a000000000000000000000000000000003f12",
    time: "2 mins ago",
  },
  {
    type: "Set Config",
    tone: "slate",
    details: (
      <>
        Updated <span className="font-medium text-white">protocolFeeBps</span> to 500
      </>
    ),
    tx: "0x2b000000000000000000000000000000009c81",
    time: "45 mins ago",
  },
  {
    type: "Allowlist",
    tone: "green",
    details: (
      <>
        Enabled adapter <span className="font-medium text-white">AaveV3-Supply-USDC</span>
      </>
    ),
    tx: "0x1d000000000000000000000000000000002e44",
    time: "2 hrs ago",
  },
  {
    type: "Withdraw",
    tone: "amber",
    details: (
      <>
        Swept <span className="font-medium text-white">12,500 USDC</span> to Treasury
      </>
    ),
    tx: "0x9f000000000000000000000000000000001a22",
    time: "5 hrs ago",
  },
  {
    type: "Add Router",
    tone: "blue",
    details: (
      <>
        Added <span className="font-medium text-white">Camelot V3</span> DEX Router
      </>
    ),
    tx: "0x4c000000000000000000000000000000008b77",
    time: "1 day ago",
  },
];

export function RecentActivityTable() {
  return (
    <Card className="overflow-hidden bg-slate-900 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-950/30 px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          <Icon name="clock" className="h-5 w-5 text-blue-300" />
          Recent Admin Activity
        </h3>
        <Button href="/admin" variant="ghost" className="px-0 text-xs text-cyan-300">
          View All Events
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-950/20 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-medium">Event Type</th>
              <th className="px-5 py-3 font-medium">Details</th>
              <th className="px-5 py-3 font-medium">Tx Hash</th>
              <th className="px-5 py-3 text-right font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {rows.map((r, idx) => (
              <tr key={idx} className="group transition-colors hover:bg-slate-800/50">
                <td className="px-5 py-3">
                  <Badge tone={r.tone}>{r.type}</Badge>
                </td>
                <td className="px-5 py-3 text-slate-300">{r.details}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <AddressPill address={r.tx} />
                    <Icon name="external" className="h-4 w-4 text-cyan-300 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </td>
                <td className="px-5 py-3 text-right text-xs text-slate-500">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}