"use client";

type Props = {
  prettyJson: string;
  open: boolean;
  onClose: () => void;
};

export function TradeStrategyExecutionResponseDrawer({ prettyJson, open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Execution Response</h2>
            <p className="text-sm text-slate-400 mt-1">Full execution response payload</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
            <pre>{prettyJson}</pre>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}