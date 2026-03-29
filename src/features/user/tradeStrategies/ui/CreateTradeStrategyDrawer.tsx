import type { CreateTradeStrategyFormState } from "../types";

type Props = {
  open: boolean;
  form: CreateTradeStrategyFormState;
  executionAccountOptions: string[];
  onClose: () => void;
  onChange: (name: keyof CreateTradeStrategyFormState, value: string | boolean) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function CreateTradeStrategyDrawer({
  open,
  form,
  executionAccountOptions,
  onClose,
  onChange,
  onSubmit,
  isSubmitting,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 w-full max-w-2xl bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Create Trade Strategy</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-400 w-6 h-6 rounded flex items-center justify-center text-xs">
                1
              </span>
              Identity
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder="e.g. BTC Momentum Strategy"
                  className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Symbol</label>
                  <input
                    type="text"
                    value={form.symbol}
                    onChange={(e) => onChange("symbol", e.target.value)}
                    placeholder="BTC/USDT"
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Source</label>
                  <select
                    value={form.source}
                    onChange={(e) => onChange("source", e.target.value)}
                    className="block w-full pl-3 pr-3 py-2.5 border border-slate-700 bg-slate-950 text-white rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm cursor-pointer"
                  >
                    <option value="binance">binance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Interval</label>
                  <select
                    value={form.interval}
                    onChange={(e) => onChange("interval", e.target.value)}
                    className="block w-full pl-3 pr-3 py-2.5 border border-slate-700 bg-slate-950 text-white rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm cursor-pointer"
                  >
                    <option value="1m">1m</option>
                    <option value="5m">5m</option>
                    <option value="15m">15m</option>
                    <option value="1h">1h</option>
                    <option value="4h">4h</option>
                    <option value="1d">1d</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Stream Key</label>
                  <input
                    type="text"
                    value={form.streamKey}
                    onChange={(e) => onChange("streamKey", e.target.value)}
                    placeholder="binance_btcusdt_5m"
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Strategy Type</label>
                  <select
                    value={form.strategyType}
                    onChange={(e) => onChange("strategyType", e.target.value)}
                    className="block w-full pl-3 pr-3 py-2.5 border border-slate-700 bg-slate-950 text-white rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm cursor-pointer"
                  >
                    <option value="atr_two_stage">atr_two_stage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => onChange("status", e.target.value)}
                    className="block w-full pl-3 pr-3 py-2.5 border border-slate-700 bg-slate-950 text-white rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-400 w-6 h-6 rounded flex items-center justify-center text-xs">
                2
              </span>
              Execution Binding
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Execution Target</label>
                <select
                  value={form.executionTarget}
                  onChange={(e) => onChange("executionTarget", e.target.value)}
                  className="block w-full pl-3 pr-3 py-2.5 border border-slate-700 bg-slate-950 text-white rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm cursor-pointer"
                >
                  <option value="api_trade_execution">api_trade_execution</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Execution Account ID</label>
                <input
                  list="execution-account-options"
                  type="text"
                  value={form.executionAccountId}
                  onChange={(e) => onChange("executionAccountId", e.target.value)}
                  placeholder="acc_1234"
                  className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm font-mono"
                />
                <datalist id="execution-account-options">
                  {executionAccountOptions.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="bg-green-500/20 text-green-400 w-6 h-6 rounded flex items-center justify-center text-xs">
                3
              </span>
              ATR Two-Stage Parameters
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">ATR Window</label>
                  <input
                    type="number"
                    value={form.atrWindow}
                    onChange={(e) => onChange("atrWindow", e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">ATR Low Threshold</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={form.atrLowThreshold}
                    onChange={(e) => onChange("atrLowThreshold", e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">ATR High Threshold</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={form.atrHighThreshold}
                    onChange={(e) => onChange("atrHighThreshold", e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">ATR Threshold Mode</label>
                  <select
                    value={form.atrThresholdMode}
                    onChange={(e) => onChange("atrThresholdMode", e.target.value)}
                    className="block w-full pl-3 pr-3 py-2.5 border border-slate-700 bg-slate-950 text-white rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm cursor-pointer"
                  >
                    <option value="atr_pct">atr_pct</option>
                    <option value="atr">atr</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Cooloff Bars</label>
                  <input
                    type="number"
                    value={form.cooloffBars}
                    onChange={(e) => onChange("cooloffBars", e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Trade Mode</label>
                  <select
                    value={form.tradeMode}
                    onChange={(e) => onChange("tradeMode", e.target.value)}
                    className="block w-full pl-3 pr-3 py-2.5 border border-slate-700 bg-slate-950 text-white rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm cursor-pointer"
                  >
                    <option value="flip">flip</option>
                    <option value="long_only">long_only</option>
                    <option value="short_only">short_only</option>
                    <option value="flat_on_down">flat_on_down</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200">Reverse Signal</span>
                  <span className="text-xs text-slate-500">Invert long/short signals</span>
                </div>

                <input
                  type="checkbox"
                  checked={form.reverseSignal}
                  onChange={(e) => onChange("reverseSignal", e.target.checked)}
                  className="h-4 w-4 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Allowed Weekdays</label>
                <input
                  type="text"
                  value={form.allowedWeekdays}
                  onChange={(e) => onChange("allowedWeekdays", e.target.value)}
                  placeholder="segunda,terça,quarta,quinta,sexta"
                  className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Use weekday names separated by comma.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Max Loss Pct</label>
                <input
                  type="number"
                  step="0.0001"
                  value={form.maxLossPct}
                  onChange={(e) => onChange("maxLossPct", e.target.value)}
                  placeholder="0.02"
                  className="block w-full px-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create Trade Strategy"}
          </button>
        </div>
      </div>
    </div>
  );
}