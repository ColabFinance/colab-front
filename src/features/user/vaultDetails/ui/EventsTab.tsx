"use client";

import React from "react";
import { Surface } from "@/presentation/components/Surface";
import { VaultEvent, VaultEventType } from "../types";
import { DrawerShell } from "./DrawerShell";

type EventTypeFilter = "all" | VaultEventType;

type Props = {
  events: VaultEvent[];
  selectedEvent: VaultEvent | null;
  onOpenEvent: (id: string) => void;
  onCloseEvent: () => void;
  eventTypeFilter: EventTypeFilter;
  setEventTypeFilter: (next: EventTypeFilter) => void;
  eventSearch: string;
  setEventSearch: (next: string) => void;
  eventTokenFilter: string;
  setEventTokenFilter: (next: string) => void;
  eventFromDate: string;
  setEventFromDate: (next: string) => void;
  eventToDate: string;
  setEventToDate: (next: string) => void;
  availableEventTokens: string[];
};

export function EventsTab({
  events,
  selectedEvent,
  onOpenEvent,
  onCloseEvent,
  eventTypeFilter,
  setEventTypeFilter,
  eventSearch,
  setEventSearch,
  eventTokenFilter,
  setEventTokenFilter,
  eventFromDate,
  setEventFromDate,
  eventToDate,
  setEventToDate,
  availableEventTokens,
}: Props) {
  return (
    <div className="space-y-6">
      <Surface variant="panel" className="border border-slate-800 bg-slate-900 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-slate-500">Event type</label>
            <select
              value={eventTypeFilter}
              onChange={(event) => setEventTypeFilter(event.target.value as EventTypeFilter)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500"
            >
              <option value="all">All</option>
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
              <option value="claim">Claim</option>
              <option value="rebalance">Rebalance</option>
              <option value="collect">Collect</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-slate-500">Token</label>
            <select
              value={eventTokenFilter}
              onChange={(event) => setEventTokenFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500"
            >
              {availableEventTokens.map((token) => (
                <option key={token} value={token}>
                  {token === "all" ? "All tokens" : token}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-slate-500">From</label>
            <input
              type="date"
              value={eventFromDate}
              onChange={(event) => setEventFromDate(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-slate-500">To</label>
            <input
              type="date"
              value={eventToDate}
              onChange={(event) => setEventToDate(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-slate-500">Search</label>
            <input
              type="text"
              value={eventSearch}
              onChange={(event) => setEventSearch(event.target.value)}
              placeholder="tx hash / owner / vault"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500"
            />
          </div>
        </div>
      </Surface>

      <Surface variant="panel" className="border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-5 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            Event feed
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[960px] w-full text-sm">
            <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Tx Hash</th>
                <th className="px-5 py-3">Block</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Token</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    No events match the current filters.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-t border-slate-800 text-slate-300 transition hover:bg-slate-950/40"
                  >
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-200">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">{event.timestampLabel}</td>
                    <td className="px-5 py-4 font-mono text-xs">{shortHash(event.txHash)}</td>
                    <td className="px-5 py-4">{event.blockNumber}</td>
                    <td className="px-5 py-4 font-mono text-xs">{shortHash(event.owner)}</td>
                    <td className="px-5 py-4">{event.tokenSymbol ?? "—"}</td>
                    <td className="px-5 py-4">{event.amountHuman ?? "—"}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => onOpenEvent(event.id)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Surface>

      <DrawerShell
        open={Boolean(selectedEvent)}
        onClose={onCloseEvent}
        title="Event details"
        subtitle={selectedEvent ? `${selectedEvent.type} • ${selectedEvent.timestampLabel}` : undefined}
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCloseEvent}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        }
      >
        {selectedEvent ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Metric label="Type" value={selectedEvent.type} />
              <Metric label="Timestamp" value={selectedEvent.timestampLabel} />
              <Metric label="Block" value={String(selectedEvent.blockNumber)} mono />
              <Metric label="Owner" value={selectedEvent.owner} mono />
              <Metric label="Vault" value={selectedEvent.vaultAddress} mono />
              <Metric label="Token" value={selectedEvent.tokenSymbol ?? "—"} />
              <Metric label="Amount" value={selectedEvent.amountHuman ?? "—"} />
              <Metric label="Tx Hash" value={selectedEvent.txHash} mono />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="border-b border-slate-800 px-4 py-4">
                <h4 className="text-sm font-semibold text-white">Transfers</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-sm">
                  <thead className="bg-slate-950 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Token</th>
                      <th className="px-4 py-3">From</th>
                      <th className="px-4 py-3">To</th>
                      <th className="px-4 py-3">Amount Raw</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEvent.transfers.map((transfer, index) => (
                      <tr key={`${transfer.tokenAddress}-${index}`} className="border-t border-slate-800">
                        <td className="px-4 py-3">{transfer.tokenSymbol}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-300">
                          {transfer.from}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-300">
                          {transfer.to}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-300">
                          {transfer.amountRaw}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </DrawerShell>
    </div>
  );
}

function Metric({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-2 text-sm text-slate-200 ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </div>
    </div>
  );
}

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}