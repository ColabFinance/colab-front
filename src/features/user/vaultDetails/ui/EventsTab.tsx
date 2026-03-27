"use client";

import React, { useState } from "react";
import { Surface } from "@/presentation/components/Surface";
import type { VaultUserEvent } from "@/core/domain/vault/events";
import { DrawerShell } from "./DrawerShell";

type Props = {
  events: VaultUserEvent[];
  eventTypeFilter: "all" | "deposit" | "withdraw";
  setEventTypeFilter: (next: "all" | "deposit" | "withdraw") => void;
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

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function EventsTab({
  events,
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
  const [selectedEvent, setSelectedEvent] = useState<VaultUserEvent | null>(null);

  return (
    <div className="space-y-6">
      <Surface variant="panel" className="border border-slate-800 bg-slate-900 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide text-slate-500">Event type</label>
            <select
              value={eventTypeFilter}
              onChange={(event) =>
                setEventTypeFilter(event.target.value as "all" | "deposit" | "withdraw")
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500"
            >
              <option value="all">All</option>
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
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
            User event feed
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[960px] w-full text-sm">
            <thead className="bg-slate-950/70 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Tx Hash</th>
                <th className="px-5 py-3">Owner</th>
                <th className="px-5 py-3">Token</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
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
                        {event.event_type}
                      </span>
                    </td>
                    <td className="px-5 py-4">{event.ts_iso}</td>
                    <td className="px-5 py-4 font-mono text-xs">{shortHash(event.tx_hash)}</td>
                    <td className="px-5 py-4 font-mono text-xs">
                      {event.owner ? shortHash(event.owner) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      {event.token || event.transfers?.[0]?.symbol || "—"}
                    </td>
                    <td className="px-5 py-4">{event.amount_human || "—"}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
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
        onClose={() => setSelectedEvent(null)}
        title="Event details"
        subtitle={selectedEvent ? `${selectedEvent.event_type} • ${selectedEvent.ts_iso}` : undefined}
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
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
              <Metric label="Type" value={selectedEvent.event_type} />
              <Metric label="Timestamp" value={selectedEvent.ts_iso} />
              <Metric label="Vault" value={selectedEvent.vault} mono />
              <Metric label="Owner" value={selectedEvent.owner || "—"} mono />
              <Metric label="Token" value={selectedEvent.token || "—"} />
              <Metric label="Amount" value={selectedEvent.amount_human || "—"} />
              <Metric label="Tx Hash" value={selectedEvent.tx_hash} mono />
              <Metric label="Block" value={String(selectedEvent.block_number || "—")} />
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
                    {(selectedEvent.transfers || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                          No transfer details saved for this event.
                        </td>
                      </tr>
                    ) : (
                      selectedEvent.transfers?.map((transfer, index) => (
                        <tr key={`${transfer.token}-${index}`} className="border-t border-slate-800">
                          <td className="px-4 py-3">{transfer.symbol || transfer.token}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-300">
                            {transfer.from}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-300">
                            {transfer.to}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-300">
                            {transfer.amount_raw}
                          </td>
                        </tr>
                      ))
                    )}
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