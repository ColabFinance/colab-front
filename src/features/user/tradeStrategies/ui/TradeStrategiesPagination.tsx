type Props = {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
};

export function TradeStrategiesPagination({
  page,
  totalPages,
  limit,
  total,
  onChangePage,
  onChangeLimit,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-700 px-4 py-3">
      <div className="text-xs text-slate-400">
        Total: <span className="text-slate-300 font-mono">{total}</span>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={limit}
          onChange={(e) => onChangeLimit(Number(e.target.value))}
          className="px-3 py-2 text-sm border border-slate-700 bg-slate-950 text-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer"
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>

        <div className="text-xs text-slate-400">
          Page <span className="text-slate-300 font-mono">{page}</span> of{" "}
          <span className="text-slate-300 font-mono">{totalPages}</span>
        </div>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChangePage(page - 1)}
          className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Prev
        </button>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChangePage(page + 1)}
          className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}