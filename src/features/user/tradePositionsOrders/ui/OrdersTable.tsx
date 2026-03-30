"use client";

import { ActionBadge } from "@/presentation/components/ActionBadge";
import { Pagination } from "@/presentation/components/Pagination";
import type { PaginationState, TradeOrderRow } from "../types";

type Props = {
  rows: TradeOrderRow[];
  pagination: PaginationState;
  totalPages: number;
  strategySelected: boolean;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
  onCopy: (value: string) => void;
  onOpenDetails: (row: TradeOrderRow) => void;
  onOpenRawResponse: (payload: Record<string, unknown> | null) => void;
};

function CopyButton({
  value,
  onCopy,
}: {
  value: string;
  onCopy: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
    >
      <i className="fa-regular fa-copy text-xs" />
    </button>
  );
}

function CopyableMono({
  value,
  onCopy,
}: {
  value: string | null | undefined;
  onCopy: (value: string) => void;
}) {
  if (!value) return <span className="text-slate-500">—</span>;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-400 font-mono">{value}</span>
      <CopyButton value={value} onCopy={onCopy} />
    </div>
  );
}

function PositionSideBadge({ value }: { value: string }) {
  const raw = String(value || "").toUpperCase();

  if (raw === "LONG") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
        {value}
      </span>
    );
  }

  if (raw === "SHORT") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
        {value}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20">
      {value || "—"}
    </span>
  );
}

function StatusBadge({ value }: { value: string }) {
  const raw = String(value || "").toUpperCase();

  if (raw.includes("FILLED") || raw.includes("SUCCESS")) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
        {value}
      </span>
    );
  }

  if (raw.includes("FAIL") || raw.includes("CANCEL")) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
        {value}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20">
      {value}
    </span>
  );
}

function SideText({ value }: { value: string }) {
  const raw = String(value || "").toUpperCase();

  if (raw === "BUY") return <span className="text-sm text-green-400 font-medium">{value}</span>;
  if (raw === "SELL") return <span className="text-sm text-red-400 font-medium">{value}</span>;
  return <span className="text-sm text-slate-300">{value || "—"}</span>;
}

export function OrdersTable({
  rows,
  pagination,
  totalPages,
  strategySelected,
  onChangePage,
  onChangeLimit,
  onCopy,
  onOpenDetails,
  onOpenRawResponse,
}: Props) {
  return (
    <div className="p-6">
      {!strategySelected ? (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
          <i className="fa-solid fa-info-circle text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-blue-400">Strategy Selection Required</h4>
            <p className="text-xs text-blue-300/80 mt-1">
              Please select a Trade Strategy from the filters above to view orders.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1600px]">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Idempotency Key</th>
                  <th className="px-6 py-4">Strategy ID</th>
                  <th className="px-6 py-4">Execution Account ID</th>
                  <th className="px-6 py-4">Symbol</th>
                  <th className="px-6 py-4">Position Side</th>
                  <th className="px-6 py-4">Side</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Signal ID</th>
                  <th className="px-6 py-4">Signal TS</th>
                  <th className="px-6 py-4">Binance Order ID</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {rows.map((row) => (
                  <tr key={row.id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">{row.action}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-mono">{row.idempotencyKey}</td>
                    <td className="px-6 py-4">
                      <CopyableMono value={row.strategyId} onCopy={onCopy} />
                    </td>
                    <td className="px-6 py-4">
                      <CopyableMono value={row.executionAccountId} onCopy={onCopy} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.symbol}</td>
                    <td className="px-6 py-4 text-sm">
                      <PositionSideBadge value={row.positionSide} />
                    </td>
                    <td className="px-6 py-4">
                      <SideText value={row.side} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{row.quantity}</td>
                    <td className="px-6 py-4">
                      <CopyableMono value={row.signalId} onCopy={onCopy} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                      {row.signalTs === null ? "—" : row.signalTs}
                    </td>
                    <td className="px-6 py-4">
                      <CopyableMono value={row.binanceOrderId} onCopy={onCopy} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge value={row.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 font-mono">{row.createdAtIso || "—"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionBadge label="Details" tone="cyan" onClick={() => onOpenDetails(row)} />
                        <ActionBadge label="Raw Response" tone="blue" onClick={() => onOpenRawResponse(row.rawResponse)} />
                        <ActionBadge
                          href={`/trade/monitor?strategyId=${encodeURIComponent(row.strategyId)}`}
                          label="Trade Monitor"
                          tone="orange"
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={14} className="px-6 py-10 text-center text-sm text-slate-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={pagination.page}
            totalPages={totalPages}
            limit={pagination.limit}
            total={pagination.total}
            onChangePage={onChangePage}
            onChangeLimit={onChangeLimit}
          />
        </>
      )}
    </div>
  );
}