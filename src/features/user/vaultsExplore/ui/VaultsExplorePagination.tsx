"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export function VaultsExplorePagination({
  rangeLabel,
  page,
  totalPages,
  setPage,
}: {
  rangeLabel: { from: number; to: number; total: number };
  page: number;
  totalPages: number;
  setPage: (n: number) => void;
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  function clamp(n: number) {
    return Math.min(Math.max(1, n), totalPages);
  }

  const pages = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, -1, totalPages];
    }

    if (page >= totalPages - 2) {
      return [1, -1, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, -1, page, -1, totalPages];
  })();

  return (
    <div className="p-4 border-t border-slate-700 bg-slate-950/30 flex justify-between items-center">
      <div className="text-xs text-slate-500">
        Showing <span className="text-white font-medium">{rangeLabel.from}-{rangeLabel.to}</span> of{" "}
        <span className="text-white font-medium">{rangeLabel.total}</span> vaults
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setPage(clamp(page - 1))}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg border border-slate-700",
            canPrev
              ? "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              : "bg-slate-900 text-slate-600 cursor-not-allowed"
          )}
          aria-label="Previous page"
        >
          ‹
        </button>

        {pages.map((p, idx) => {
          if (p === -1) {
            return (
              <button
                key={`dots_${idx}`}
                type="button"
                disabled
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-slate-500"
              >
                ...
              </button>
            );
          }

          const active = p === page;

          return (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg border transition-colors text-sm",
                active
                  ? "border-slate-700 bg-slate-800 text-white"
                  : "border-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              )}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          disabled={!canNext}
          onClick={() => setPage(clamp(page + 1))}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg border border-slate-700",
            canNext
              ? "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              : "bg-slate-900 text-slate-600 cursor-not-allowed"
          )}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}