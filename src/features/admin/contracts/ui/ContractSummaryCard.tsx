import type { ContractDefinition, RuntimeContractRecord } from "../types";
import { ClockIcon, CopyIcon, ExternalLinkIcon } from "./icons";

type Props = {
  contract: ContractDefinition;
  record: RuntimeContractRecord;
};

function copyText(value: string) {
  if (typeof navigator === "undefined") return;
  navigator.clipboard.writeText(value).catch(() => {});
}

function buildExtraRows(record: RuntimeContractRecord) {
  const extra = record.extra || {};

  const rows: Array<{ label: string; value: string }> = [];

  if (extra.treasury) {
    rows.push({ label: "Treasury", value: String(extra.treasury) });
  }

  if (extra.protocol_fee_bps !== undefined) {
    rows.push({ label: "Protocol Fee (bps)", value: String(extra.protocol_fee_bps) });
  }

  if (extra.strategy_registry) {
    rows.push({ label: "Strategy Registry", value: String(extra.strategy_registry) });
  }

  if (extra.executor) {
    rows.push({ label: "Executor", value: String(extra.executor) });
  }

  if (extra.fee_collector) {
    rows.push({ label: "Fee Collector", value: String(extra.fee_collector) });
  }

  if (extra.default_cooldown_sec !== undefined) {
    rows.push({ label: "Default Cooldown (sec)", value: String(extra.default_cooldown_sec) });
  }

  if (extra.default_max_slippage_bps !== undefined) {
    rows.push({
      label: "Default Max Slippage (bps)",
      value: String(extra.default_max_slippage_bps),
    });
  }

  if (extra.default_allow_swap !== undefined) {
    rows.push({
      label: "Default Allow Swap",
      value: String(extra.default_allow_swap),
    });
  }

  return rows;
}

export default function ContractSummaryCard({ contract, record }: Props) {
  const extraRows = buildExtraRows(record);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-lg">
      <div className="border-b border-slate-800 bg-slate-950/30 px-4 py-4 md:px-6 md:py-5">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            {contract.name}
            <span className="rounded border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-400">
              Active
            </span>
          </h3>
          <p className="mt-1 text-xs text-slate-400">{contract.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-6 p-4 md:grid-cols-2 md:gap-y-8 md:p-6">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contract Address
          </label>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="truncate rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 font-mono text-xs text-cyan-400 md:text-sm">
              {record.address}
            </span>
            <button
              type="button"
              onClick={() => copyText(record.address)}
              className="shrink-0 text-slate-500 hover:text-white"
            >
              <CopyIcon size={15} />
            </button>
            <a
              href={record.explorerUrl || "#"}
              className="shrink-0 text-slate-500 hover:text-cyan-400"
            >
              <ExternalLinkIcon size={15} />
            </a>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Transaction Hash
          </label>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="truncate font-mono text-xs text-slate-300 md:text-sm">
              {record.txHash || "Not available"}
            </span>
            <a
              href={record.txExplorerUrl || "#"}
              className="shrink-0 text-slate-500 hover:text-cyan-400"
            >
              <ExternalLinkIcon size={15} />
            </a>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Owner / Admin
          </label>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-[8px] font-bold text-white">
              AD
            </div>
            <span className="font-mono text-sm text-slate-300">
              {record.owner || "Not available"}
            </span>
            {record.ownerTag ? (
              <span className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                {record.ownerTag}
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Status
          </label>
          <span className="inline-flex items-center gap-1.5 rounded border border-green-500/20 bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Active
          </span>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Created At
          </label>
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <ClockIcon size={15} className="text-slate-500" />
            {record.createdAtFullLabel || record.createdAtLabel}
          </span>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Last Updated
          </label>
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <ClockIcon size={15} className="text-slate-500" />
            {record.updatedAtLabel}
          </span>
        </div>
      </div>

      {extraRows.length ? (
        <div className="border-t border-slate-800 px-4 py-4 md:px-6">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Additional Details
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {extraRows.map((row) => (
              <div key={row.label}>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {row.label}
                </label>
                <div
                  className={[
                    "text-sm text-slate-200",
                    row.value.startsWith("0x") ? "font-mono break-all" : "",
                  ].join(" ")}
                >
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}