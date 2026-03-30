"use client";

import type { TradeOrderRow, TradePositionRow } from "../types";

type Props = {
  position: TradePositionRow | null;
  order: TradeOrderRow | null;
  rawResponsePretty: string;
  rawResponseOpen: boolean;
  onCopy: (value: string) => void;
  onClosePosition: () => void;
  onCloseOrder: () => void;
  onCloseRawResponse: () => void;
};

function DrawerShell({
  open,
  title,
  onClose,
  widthClass = "md:w-[600px]",
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  widthClass?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`absolute inset-y-0 right-0 w-full ${widthClass} bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto`}
      >
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function DetailCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      {children}
    </div>
  );
}

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
      <span className="text-sm text-slate-200 font-mono">{value}</span>
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

  if (raw.includes("OPEN")) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
        {value}
      </span>
    );
  }

  if (raw.includes("FILLED") || raw.includes("SUCCESS")) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
        {value}
      </span>
    );
  }

  if (raw.includes("CLOSED")) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-500/10 text-slate-300 border border-slate-500/20">
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

export function PositionsOrdersDrawers({
  position,
  order,
  rawResponsePretty,
  rawResponseOpen,
  onCopy,
  onClosePosition,
  onCloseOrder,
  onCloseRawResponse,
}: Props) {
  return (
    <>
      <DrawerShell
        open={Boolean(position)}
        title="Position Details"
        onClose={onClosePosition}
      >
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <DetailCard label="Strategy ID">
              <CopyableMono value={position?.strategyId || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Execution Account ID">
              <CopyableMono value={position?.executionAccountId || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Symbol">
              <span className="text-sm text-slate-200 font-mono">{position?.symbol || "—"}</span>
            </DetailCard>
            <DetailCard label="Position Side">
              <PositionSideBadge value={position?.positionSide || ""} />
            </DetailCard>
            <DetailCard label="Status">
              <StatusBadge value={position?.status || ""} />
            </DetailCard>
            <DetailCard label="Quantity">
              <span className="text-sm text-slate-200 font-mono">{position?.quantity ?? "—"}</span>
            </DetailCard>
            <DetailCard label="Entry Price">
              <span className="text-sm text-slate-200 font-mono">{position?.entryPrice ?? "—"}</span>
            </DetailCard>
            <DetailCard label="Open Order ID">
              <CopyableMono value={position?.openOrderId || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Close Order ID">
              <CopyableMono value={position?.closeOrderId || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Signal Open ID">
              <CopyableMono value={position?.signalOpenId || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Signal Close ID">
              <CopyableMono value={position?.signalCloseId || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Open Reason">
              <span className="text-sm text-slate-200">{position?.openReason || "—"}</span>
            </DetailCard>
            <DetailCard label="Close Reason">
              <span className="text-sm text-slate-200">{position?.closeReason || "—"}</span>
            </DetailCard>
            <DetailCard label="Opened At">
              <span className="text-sm text-slate-200 font-mono">{position?.openedAt ?? "—"}</span>
            </DetailCard>
            <DetailCard label="Opened At ISO">
              <span className="text-sm text-slate-200 font-mono">{position?.openedAtIso || "—"}</span>
            </DetailCard>
            <DetailCard label="Closed At ISO">
              <span className="text-sm text-slate-200 font-mono">{position?.closedAtIso || "—"}</span>
            </DetailCard>
            <DetailCard label="Exit Price">
              <span className="text-sm text-slate-200 font-mono">
                {position?.exitPrice === null || position?.exitPrice === undefined ? "—" : position.exitPrice}
              </span>
            </DetailCard>
            <DetailCard label="Created At ISO">
              <span className="text-sm text-slate-200 font-mono">{position?.createdAtIso || "—"}</span>
            </DetailCard>
            <DetailCard label="Updated At ISO">
              <span className="text-sm text-slate-200 font-mono">{position?.updatedAtIso || "—"}</span>
            </DetailCard>
          </div>
        </div>
      </DrawerShell>

      <DrawerShell
        open={Boolean(order)}
        title="Order Details"
        onClose={onCloseOrder}
      >
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <DetailCard label="Action">
              <span className="text-sm text-slate-200 font-medium">{order?.action || "—"}</span>
            </DetailCard>
            <DetailCard label="Idempotency Key">
              <CopyableMono value={order?.idempotencyKey || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Strategy ID">
              <CopyableMono value={order?.strategyId || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Execution Account ID">
              <CopyableMono value={order?.executionAccountId || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Symbol">
              <span className="text-sm text-slate-200 font-mono">{order?.symbol || "—"}</span>
            </DetailCard>
            <DetailCard label="Position Side">
              <PositionSideBadge value={order?.positionSide || ""} />
            </DetailCard>
            <DetailCard label="Side">
              <SideText value={order?.side || ""} />
            </DetailCard>
            <DetailCard label="Quantity">
              <span className="text-sm text-slate-200 font-mono">{order?.quantity ?? "—"}</span>
            </DetailCard>
            <DetailCard label="Signal ID">
              <CopyableMono value={order?.signalId || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Signal TS">
              <span className="text-sm text-slate-200 font-mono">
                {order?.signalTs === null || order?.signalTs === undefined ? "—" : order.signalTs}
              </span>
            </DetailCard>
            <DetailCard label="Binance Order ID">
              <CopyableMono value={order?.binanceOrderId || null} onCopy={onCopy} />
            </DetailCard>
            <DetailCard label="Status">
              <StatusBadge value={order?.status || ""} />
            </DetailCard>
            <DetailCard label="Created At ISO">
              <span className="text-sm text-slate-200 font-mono">{order?.createdAtIso || "—"}</span>
            </DetailCard>
            <DetailCard label="Updated At ISO">
              <span className="text-sm text-slate-200 font-mono">{order?.updatedAtIso || "—"}</span>
            </DetailCard>
          </div>
        </div>
      </DrawerShell>

      <DrawerShell
        open={rawResponseOpen}
        title="Raw Execution Response"
        onClose={onCloseRawResponse}
        widthClass="md:w-[700px]"
      >
        <div className="p-6">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{rawResponsePretty}</pre>
          </div>
        </div>
      </DrawerShell>
    </>
  );
}