"use client";

import React from "react";
import { cn } from "@/shared/utils/cn";

export function AdaptersPagination({
  page,
  pageCount,
  total,
  from,
  to,
  onPageChange,
  className,
}: {
  page: number;
  pageCount: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (next: number) => void;
  className?: string;
}) {
  const canPrev = page > 1;
  const canNext = page < pageCount;

  const pages = buildPages(page, pageCount);

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      <div className="text-xs text-slate-500 order-2 sm:order-1">
        Showing <span className="text-slate-100 font-medium">{from}</span> to{" "}
        <span className="text-slate-100 font-medium">{to}</span> of{" "}
        <span className="text-slate-100 font-medium">{total}</span> adapters
      </div>

      <div className="flex gap-2 order-1 sm:order-2">
        <IconButton
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          ariaLabel="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </IconButton>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className="self-end px-1 text-slate-600">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "px-3 py-1 rounded border text-xs font-medium",
                p === page
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-100"
              )}
            >
              {p}
            </button>
          )
        )}

        <IconButton
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          ariaLabel="Next page"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  children,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-100",
        disabled && "opacity-50 cursor-not-allowed hover:text-slate-400"
      )}
    >
      {children}
    </button>
  );
}

function buildPages(page: number, pageCount: number): Array<number | "..."> {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, i) => i + 1);

  const out: Array<number | "..."> = [];
  out.push(1);

  const left = Math.max(2, page - 1);
  const right = Math.min(pageCount - 1, page + 1);

  if (left > 2) out.push("...");
  for (let p = left; p <= right; p++) out.push(p);
  if (right < pageCount - 1) out.push("...");

  out.push(pageCount);
  return out;
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}