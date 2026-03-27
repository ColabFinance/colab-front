"use client";

import { SurfaceFooter } from "@/presentation/components/Surface";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
};

export function PoolsPagination({ page, pageSize, total, onPageChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <SurfaceFooter className="bg-slate-950/50 flex items-center justify-between">
      <div className="text-xs text-slate-400">
        Showing <span className="text-white font-medium">{from}</span> to{" "}
        <span className="text-white font-medium">{to}</span> of{" "}
        <span className="text-white font-medium">{total}</span> pools
      </div>

      <div className="flex gap-2 items-center">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          ←
        </button>

        <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-white rounded font-medium text-xs flex items-center">
          {page}
        </span>

        <button
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page >= pages}
          className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </SurfaceFooter>
  );
}