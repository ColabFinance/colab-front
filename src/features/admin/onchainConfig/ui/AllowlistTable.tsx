"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";
import { Badge } from "@/presentation/components/Badge";
import { AddressPill } from "@/presentation/components/AddressPill";
import { Button } from "@/presentation/components/Button";
import { Surface, SurfaceHeader } from "@/presentation/components/Surface";

type Column<T> = {
  header: string;
  className?: string;
  cell: (row: T) => React.ReactNode;
};

export function AllowlistTable<T>({
  title,
  description,
  primaryAction,
  secondaryAction,
  columns,
  rows,
  rowKey,
  emptyLabel = "No entries",
}: {
  title: string;
  description?: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  emptyLabel?: string;
}) {
  return (
    <Surface variant="table" className="bg-slate-900 border border-slate-700">
      <SurfaceHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">{title}</div>
          {description && <div className="mt-1 text-xs text-slate-400">{description}</div>}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {secondaryAction && (
            <Button
              variant="secondary"
              className="w-full sm:w-auto bg-slate-800 border border-slate-600 hover:bg-slate-700 text-xs px-3 py-2"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              variant="primary"
              className="w-full sm:w-auto text-xs px-3 py-2"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </SurfaceHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-950/60 text-xs uppercase text-slate-500 font-semibold tracking-wider">
            <tr>
              {columns.map((c, idx) => (
                <th key={idx} className={cn("px-6 py-3 border-b border-slate-700", c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700 bg-slate-900">
            {rows.length === 0 ? (
              <tr>
                <td className="px-6 py-6 text-sm text-slate-400" colSpan={columns.length}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={rowKey(r)} className="hover:bg-slate-800/50 transition-colors">
                  {columns.map((c, idx) => (
                    <td key={idx} className={cn("px-6 py-3", c.className)}>
                      {c.cell(r)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}

export function StatusBadge({ status }: { status: "active" | "disabled" }) {
  return (
    <div className="flex justify-center">
      <Badge tone={status === "active" ? "green" : "slate"} className="text-[10px] px-2 py-0.5">
        {status === "active" ? "Active" : "Disabled"}
      </Badge>
    </div>
  );
}

export function AddressCell({ address }: { address: string }) {
  return (
    <div className="flex items-center gap-2">
      <AddressPill address={address} className="bg-slate-900 border-slate-700" />
      <a
        className="text-slate-500 hover:text-cyan-300 text-xs"
        href="#"
        onClick={(e) => e.preventDefault()}
        title="Open explorer (mock)"
      >
        ↗
      </a>
    </div>
  );
}