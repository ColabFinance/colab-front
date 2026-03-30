"use client";

type Props = {
  onRefresh: () => void;
};

export function PositionsOrdersHeader({ onRefresh }: Props) {
  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Positions & Orders
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Inspect current positions and execution records
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={onRefresh}
            className="w-full xs:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-rotate" /> Refresh
          </button>
        </div>
      </div>
    </div>
  );
}