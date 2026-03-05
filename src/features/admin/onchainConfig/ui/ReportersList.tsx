"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/presentation/components/Button";
import { Surface, SurfaceHeader, SurfaceBody } from "@/presentation/components/Surface";
import { ReporterItem } from "../types";
import { AddressPill } from "@/presentation/components/AddressPill";

export function ReportersList({
  title = "Authorized Reporters",
  items,
  onAdd,
  onRemove,
  className,
}: {
  title?: string;
  items: ReporterItem[];
  onAdd: (addr: string) => void;
  onRemove: (id: string) => void;
  className?: string;
}) {
  const [addr, setAddr] = useState("");

  const canAdd = useMemo(() => addr.trim().startsWith("0x") && addr.trim().length >= 10, [addr]);

  return (
    <Surface variant="panel" className={cn("bg-slate-900 border border-slate-700", className)}>
      <SurfaceHeader className="flex items-center justify-between gap-3">
        <div className="text-lg font-semibold text-white">{title}</div>

        <div className="flex items-center gap-2">
          <input
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder="0x..."
            className="w-56 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none focus:border-cyan-500"
          />
          <Button
            variant="secondary"
            className="text-xs px-3 py-2 bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30"
            onClick={() => {
              if (!canAdd) return;
              onAdd(addr.trim());
              setAddr("");
            }}
            disabled={!canAdd}
          >
            + Add
          </Button>
        </div>
      </SurfaceHeader>

      <SurfaceBody className="pt-3">
        <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2">
          {items.length === 0 ? (
            <div className="text-sm text-slate-400">No reporters</div>
          ) : (
            items.map((r, idx) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-950/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 grid place-items-center text-xs text-slate-400 font-mono">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <AddressPill address={r.address} className="bg-slate-900/60" />
                    <div className="text-[10px] text-slate-500">{r.addedAtLabel}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(r.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                  title="Remove"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
      </SurfaceBody>
    </Surface>
  );
}