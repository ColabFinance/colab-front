"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Surface, SurfaceHeader } from "@/presentation/components/Surface";
import { cn } from "@/shared/utils/cn";
import { BreakdownNode } from "../types";

function pctBadge(delta?: number, valueLabel?: string) {
  if (valueLabel) return <span className="text-[10px] text-slate-500">{valueLabel}</span>;
  if (typeof delta !== "number") return null;

  const positive = delta >= 0;
  return (
    <span
      className={cn(
        "text-[10px] px-1.5 py-0.5 rounded border",
        positive
          ? "text-green-300 bg-green-500/10 border-green-500/20"
          : "text-red-300 bg-red-500/10 border-red-500/20"
      )}
    >
      {positive ? "+" : ""}
      {delta.toFixed(1)}%
    </span>
  );
}

function isLeaf(n: BreakdownNode): n is Extract<BreakdownNode, { kind: "leaf" }> {
  return n.kind === "leaf";
}

function isGroup(n: BreakdownNode): n is Extract<BreakdownNode, { kind: "group" }> {
  return n.kind === "group";
}

function Caret({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center text-slate-500 transition-transform",
        open ? "rotate-0" : "-rotate-90"
      )}
      aria-hidden="true"
    >
      ▾
    </span>
  );
}

export function BreakdownTree({ root }: { root: BreakdownNode }) {
  const { leafIds, leafById } = useMemo(() => {
    const ids: string[] = [];
    const map: Record<string, Extract<BreakdownNode, { kind: "leaf" }>> = {};

    function walk(n: BreakdownNode) {
      if (isLeaf(n)) {
        ids.push(n.id);
        map[n.id] = n;
        return;
      }
      n.children.forEach(walk);
    }

    walk(root);

    return { leafIds: ids, leafById: map };
  }, [root]);

  const [selectedLeafId, setSelectedLeafId] = useState<string>(leafIds[0] ?? "");

  const selectedLeaf = useMemo(() => {
    if (!selectedLeafId) return null;
    return leafById[selectedLeafId] ?? null;
  }, [leafById, selectedLeafId]);

  const groupIds = useMemo(() => {
    const ids: string[] = [];
    function walk(n: BreakdownNode) {
      if (isGroup(n)) {
        ids.push(n.id);
        n.children.forEach(walk);
      }
    }
    walk(root);
    return ids;
  }, [root]);

  // default: everything expanded (matches the HTML feeling)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const id of groupIds) initial[id] = true;
    return initial;
  });

  const toggleGroup = useCallback((id: string) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const renderNode = useCallback(
    (node: BreakdownNode, depth: number) => {
      const pad = depth === 0 ? "" : "pl-4";
      const rail = depth === 0 ? "" : "border-l border-slate-800";

      if (isGroup(node)) {
        const open = openGroups[node.id] ?? true;

        return (
          <div key={node.id} className={cn("space-y-2", depth > 0 && cn(pad))}>
            <button
              type="button"
              onClick={() => toggleGroup(node.id)}
              className={cn(
                "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
                "hover:bg-slate-950/40"
              )}
            >
              <Caret open={open} />
              <span className="text-xs text-slate-200 font-medium">{node.label}</span>
            </button>

            {open && (
              <div className={cn("space-y-2", depth > 0 ? cn(rail, "ml-2") : "border-l border-slate-800 pl-3")}>
                {node.children.map((c) => renderNode(c, depth + 1))}
              </div>
            )}
          </div>
        );
      }

      // leaf
      const active = node.id === selectedLeafId;

      return (
        <div key={node.id} className={cn(depth > 0 && pad)}>
          <button
            type="button"
            onClick={() => setSelectedLeafId(node.id)}
            className={cn(
              "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
              active ? "bg-slate-950/60" : "hover:bg-slate-950/40"
            )}
          >
            <span className="text-xs text-slate-300">{node.label}</span>
            <span className="ml-auto">{pctBadge(node.deltaPct, node.valueLabel)}</span>
          </button>

          {active && selectedLeaf?.details && (
            <div className="mt-2 ml-2 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs space-y-1.5">
              {Object.entries(selectedLeaf.details).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">{k}:</span>
                  <span className="text-slate-300 font-mono">{String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
    [openGroups, selectedLeaf?.details, selectedLeafId, toggleGroup]
  );

  return (
    <Surface variant="panel">
      <SurfaceHeader>
        <div className="text-sm font-semibold text-white">Breakdown by Pool Type</div>
      </SurfaceHeader>

      <div className="p-4">
        {leafIds.length === 0 ? (
          <div className="text-sm text-slate-400">No breakdown data.</div>
        ) : (
          <div className="space-y-2">{renderNode(root, 0)}</div>
        )}
      </div>
    </Surface>
  );
}