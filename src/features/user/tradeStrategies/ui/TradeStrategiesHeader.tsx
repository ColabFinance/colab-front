type Props = {
  onOpenCreateDrawer: () => void;
  onRefresh: () => void;
};

export function TradeStrategiesHeader({ onOpenCreateDrawer, onRefresh }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
          Trade Strategies
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Create and manage trade strategies bound to one stream and one execution account
        </p>
      </div>

      <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={onOpenCreateDrawer}
          className="w-full xs:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-plus" />
          Create Trade Strategy
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="w-full xs:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-rotate" />
          Refresh
        </button>
      </div>
    </div>
  );
}