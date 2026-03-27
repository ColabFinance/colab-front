"use client";

import type {
  CreateVaultProgress,
  CreateVaultResult,
  StrategyOption,
  VaultCreateForm,
} from "../types";

function formatAddress(value: string) {
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function CreateVaultPanel({
  isOpen,
  onClose,
  strategies,
  selectedStrategy,
  form,
  onSelectStrategy,
  onChange,
  isAdvancedOpen,
  onToggleAdvanced,
  onSubmit,
  isSubmitting,
  errorMessage,
  progress,
  result,
}: {
  isOpen: boolean;
  onClose: () => void;
  strategies: StrategyOption[];
  selectedStrategy: StrategyOption | null;
  form: VaultCreateForm;
  onSelectStrategy: (strategyId: string) => void;
  onChange: <K extends keyof VaultCreateForm>(field: K, value: VaultCreateForm[K]) => void;
  isAdvancedOpen: boolean;
  onToggleAdvanced: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
  progress?: CreateVaultProgress | null;
  result?: CreateVaultResult | null;
}) {
  if (!isOpen) return null;

  const hasActiveSelectableStrategy = strategies.some((item) => item.status === "active");

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={isSubmitting ? undefined : onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-slate-800 bg-slate-900 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 p-6">
          <div>
            <h2 className="text-xl font-bold text-white">Create New Vault</h2>
            <p className="mt-1 text-sm text-slate-400">
              Step 1 creates the vault on-chain. Step 2 registers it in the app database.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="space-y-8 p-6">
          {progress ? (
            <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-4 w-4 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                <div>
                  <div className="text-sm font-semibold text-cyan-300">{progress.label}</div>
                  {progress.detail ? (
                    <div className="mt-1 text-xs text-cyan-200/80">{progress.detail}</div>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {errorMessage ? (
            <section className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
              <div className="text-sm font-semibold text-rose-300">Create vault failed</div>
              <div className="mt-1 text-xs text-rose-200/80">{errorMessage}</div>

              {result?.vaultAddress ? (
                <div className="mt-3 space-y-1 text-xs text-rose-100/80">
                  <div>On-chain vault: {result.vaultAddress}</div>
                  <div>Tx hash: {result.txHash}</div>
                </div>
              ) : null}
            </section>
          ) : null}

          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-800/70 p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/15 text-sm font-bold text-blue-400">
                1
              </span>
              <h3 className="text-lg font-bold text-white">Select Strategy</h3>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-200/80">
              Only strategies with status <span className="font-semibold text-blue-100">ACTIVE</span> can
              be selected to create a vault.
            </div>

            <div className="max-h-[340px] space-y-3 overflow-y-auto pr-1">
              {strategies.map((strategy) => {
                const isSelected = selectedStrategy?.id === strategy.id;
                const isDisabled = strategy.status !== "active";

                return (
                  <label
                    key={strategy.id}
                    className={`block ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <input
                      type="radio"
                      name="strategyId"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => onSelectStrategy(strategy.id)}
                      disabled={isSubmitting || isDisabled}
                    />

                    <div
                      className={`rounded-xl border-2 p-4 transition ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500/5"
                          : "border-slate-800 bg-slate-950 hover:border-cyan-500/40"
                      } ${isDisabled ? "opacity-50" : ""} ${isSubmitting ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-white">{strategy.name}</h4>
                            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                              #{strategy.id}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400">{strategy.symbol}</p>

                          <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                            <span
                              className={`rounded px-2 py-0.5 ${
                                strategy.status === "active"
                                  ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                  : "border border-slate-600/30 bg-slate-500/10 text-slate-400"
                              }`}
                            >
                              {strategy.status === "active" ? "Active" : "Inactive"}
                            </span>
                            <span>Chain: {strategy.chainName}</span>
                            <span>DEX: {strategy.dexName}</span>
                            <span className="font-mono">
                              Owner: {formatAddress(strategy.ownerAddress)}
                            </span>
                          </div>
                        </div>

                        <div className={`text-xl ${isSelected ? "text-cyan-400" : "text-slate-700"}`}>
                          {isSelected ? "●" : "○"}
                        </div>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {!hasActiveSelectableStrategy ? (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-200/80">
                No ACTIVE strategy is currently available for vault creation.
              </div>
            ) : null}
          </section>

          {selectedStrategy ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-800/70 p-6">
              <h4 className="border-b border-slate-800 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Selected Strategy Summary
              </h4>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs text-slate-500">Strategy Name</span>
                  <span className="font-medium text-white">{selectedStrategy.name}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Symbol</span>
                  <span className="font-medium text-white">{selectedStrategy.symbol}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Strategy ID</span>
                  <span className="font-mono text-white">#{selectedStrategy.id}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Chain</span>
                  <span className="text-white">{selectedStrategy.chainName}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Status</span>
                  <span
                    className={`inline-flex rounded px-2 py-0.5 text-[10px] ${
                      selectedStrategy.status === "active"
                        ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border border-slate-600/30 bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    {selectedStrategy.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Owner</span>
                  <span className="font-mono text-xs text-white">
                    {formatAddress(selectedStrategy.ownerAddress)}
                  </span>
                </div>
              </div>
            </section>
          ) : null}

          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-800/70 p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/15 text-sm font-bold text-blue-400">
                2
              </span>
              <h3 className="text-lg font-bold text-white">Vault Identity</h3>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Vault Name *</label>
              <input
                value={form.vaultName}
                onChange={(event) => onChange("vaultName", event.target.value)}
                placeholder="e.g. My Alpha Vault"
                disabled={isSubmitting}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description (optional)
              </label>
              <textarea
                value={form.description}
                onChange={(event) => onChange("description", event.target.value)}
                placeholder="Purpose and notes about this vault..."
                disabled={isSubmitting}
                className="min-h-[100px] w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </section>

          {selectedStrategy ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-800/70 p-6">
              <h4 className="border-b border-slate-800 pb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Infrastructure Preview
              </h4>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs text-slate-500">Owner Wallet</span>
                  <span className="font-mono text-xs text-white">
                    {formatAddress(selectedStrategy.ownerAddress)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Strategy ID</span>
                  <span className="font-mono text-white">#{selectedStrategy.id}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Chain</span>
                  <span className="text-white">{selectedStrategy.chainName}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">DEX</span>
                  <span className="text-white">{selectedStrategy.dexName || "—"}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Pair</span>
                  <span className="text-white">{selectedStrategy.marketPair}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Par Token</span>
                  <span className="text-white">{selectedStrategy.parToken || "—"}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Adapter</span>
                  <span className={selectedStrategy.adapterCompatible ? "text-emerald-400" : "text-rose-400"}>
                    {selectedStrategy.adapterCompatible ? "Compatible" : "Not compatible"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Pool</span>
                  <span className="font-mono text-xs text-white">
                    {formatAddress(selectedStrategy.poolAddress)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">NFPM</span>
                  <span className="font-mono text-xs text-white">
                    {formatAddress(selectedStrategy.nfpmAddress)}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Gauge</span>
                  <span className="text-white">
                    {selectedStrategy.gaugeAddress
                      ? formatAddress(selectedStrategy.gaugeAddress)
                      : "Not Available"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Version</span>
                  <span className="text-white">{selectedStrategy.version}</span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">RPC URL</span>
                  <span className="truncate text-xs text-white">
                    {selectedStrategy.rpcUrl || "—"}
                  </span>
                </div>
              </div>
            </section>
          ) : null}

          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-800/70">
            <button
              type="button"
              onClick={onToggleAdvanced}
              disabled={isSubmitting}
              className="flex w-full items-center justify-between p-6 text-left transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-700/30 text-sm text-slate-400">
                  3
                </span>
                <span className="font-bold text-white">Advanced Configuration</span>
                <span className="text-xs font-normal text-slate-500">(Optional)</span>
              </div>

              <span className={`text-slate-500 transition ${isAdvancedOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {isAdvancedOpen ? (
              <div className="space-y-4 border-t border-slate-800 bg-slate-950/40 p-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Swap Pools JSON
                  </label>
                  <textarea
                    value={form.swapPoolsJson}
                    onChange={(event) => onChange("swapPoolsJson", event.target.value)}
                    spellCheck={false}
                    placeholder='{"reward_to_quote":{"dex":"uniswap_v3","pool":"0x..."}}'
                    disabled={isSubmitting}
                    className="min-h-[150px] w-full rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 outline-none transition placeholder:text-slate-600 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Reward Swap Config Preview
                  </label>
                  <textarea
                    value={form.rewardSwapPreview}
                    onChange={(event) => onChange("rewardSwapPreview", event.target.value)}
                    disabled={isSubmitting}
                    className="min-h-[72px] w-full rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Job Config Preview
                  </label>
                  <textarea
                    value={form.jobConfigPreview}
                    onChange={(event) => onChange("jobConfigPreview", event.target.value)}
                    disabled={isSubmitting}
                    className="min-h-[92px] w-full rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>
            ) : null}
          </section>
        </div>

        <div className="sticky bottom-0 flex flex-col justify-end gap-3 border-t border-slate-800 bg-slate-900 p-6 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full px-6 py-3 text-sm font-medium text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={
              isSubmitting ||
              !selectedStrategy ||
              selectedStrategy.status !== "active"
            }
            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "Processing..." : "Create Vault"}
          </button>
        </div>
      </div>
    </div>
  );
}