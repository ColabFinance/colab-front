"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { ChainDrawerPayload, ChainRow, RpcTestState } from "./types";

function normalizeExplorerLabel(url: string) {
  return url.replace(/^https?:\/\//, "").split("/")[0] || url;
}

export default function ChainDrawer(props: {
  open: boolean;
  mode: "create" | "edit";
  initial: ChainRow | null;
  onClose: () => void;
  onSubmit: (payload: ChainDrawerPayload) => void;
  onTestRpc: (rpcUrl: string) => void;
  rpcTest: RpcTestState;
}) {
  const title = props.mode === "create" ? "Add New Chain" : "Edit Chain";

  const [name, setName] = useState("");
  const [chainId, setChainId] = useState<number>(8453);
  const [nativeSymbol, setNativeSymbol] = useState("ETH");
  const [rpcUrl, setRpcUrl] = useState("https://mainnet.base.org");
  const [explorerUrl, setExplorerUrl] = useState("https://basescan.org");
  const [enabled, setEnabled] = useState(true);

  const [stables, setStables] = useState<string[]>(["USDC", "USDbC"]);
  const [stableInput, setStableInput] = useState("");

  useEffect(() => {
    if (!props.open) return;

    if (props.mode === "edit" && props.initial) {
      setName(props.initial.name);
      setChainId(props.initial.chainId);
      setNativeSymbol(props.initial.nativeSymbol);
      setRpcUrl(props.initial.rpcUrl);
      setExplorerUrl(props.initial.explorerUrl);
      setEnabled(props.initial.status !== "disabled");
      setStables(props.initial.stables);
      setStableInput("");
      return;
    }

    // create defaults
    setName("");
    setChainId(8453);
    setNativeSymbol("ETH");
    setRpcUrl("https://mainnet.base.org");
    setExplorerUrl("https://basescan.org");
    setEnabled(true);
    setStables(["USDC", "USDbC"]);
    setStableInput("");
  }, [props.open, props.mode, props.initial]);

  const explorerLabel = useMemo(() => normalizeExplorerLabel(explorerUrl), [explorerUrl]);

  function addStable(symbol: string) {
    const s = symbol.trim().toUpperCase();
    if (!s) return;
    setStables((prev) => (prev.includes(s) ? prev : [...prev, s]));
  }

  function removeStable(symbol: string) {
    setStables((prev) => prev.filter((x) => x !== symbol));
  }

  function submit() {
    const payload: ChainDrawerPayload = {
      name: name.trim() || "Unnamed",
      chainId: Number(chainId),
      nativeSymbol: nativeSymbol.trim().toUpperCase() || "ETH",
      rpcUrl: rpcUrl.trim(),
      explorerUrl: explorerUrl.trim(),
      explorerLabel,
      stables,
      enabled,
    };

    props.onSubmit(payload);
  }

  if (!props.open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={props.onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-[520px] flex-col border-l border-white/10 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-black/20 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Configure network parameters and RPC endpoints.
            </p>
          </div>
          <button
            onClick={props.onClose}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300 transition hover:border-white/15 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Basic */}
            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Basic Information
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-200">
                  Chain Name <span className="text-rose-400">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Base Mainnet"
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-sky-400/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-200">
                    Chain ID <span className="text-rose-400">*</span>
                  </label>
                  <input
                    value={chainId}
                    onChange={(e) => setChainId(Number(e.target.value))}
                    type="number"
                    placeholder="8453"
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-sky-400/50"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    Must be unique across protocol.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-200">
                    Native Symbol <span className="text-rose-400">*</span>
                  </label>
                  <input
                    value={nativeSymbol}
                    onChange={(e) => setNativeSymbol(e.target.value)}
                    placeholder="ETH"
                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-sky-400/50"
                  />
                </div>
              </div>
            </section>

            <hr className="border-white/10" />

            {/* Connection */}
            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Connection Details
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-200">
                  RPC URL <span className="text-rose-400">*</span>
                </label>

                <div className="flex gap-2">
                  <input
                    value={rpcUrl}
                    onChange={(e) => setRpcUrl(e.target.value)}
                    placeholder="https://mainnet.base.org"
                    className="flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-sky-400/50"
                  />
                  <button
                    onClick={() => props.onTestRpc(rpcUrl)}
                    className="whitespace-nowrap rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/30 hover:text-white"
                  >
                    {props.rpcTest.state === "loading" ? "Testing…" : "Test RPC"}
                  </button>
                </div>

                {props.rpcTest.state === "success" && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-2 text-xs text-emerald-300">
                    <span>✓</span>
                    Connection successful! Latest block:{" "}
                    <span className="font-mono text-white">{props.rpcTest.latestBlock}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-200">
                  Explorer Base URL <span className="text-rose-400">*</span>
                </label>
                <input
                  value={explorerUrl}
                  onChange={(e) => setExplorerUrl(e.target.value)}
                  placeholder="https://basescan.org"
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-sky-400/50"
                />
              </div>
            </section>

            <hr className="border-white/10" />

            {/* Config */}
            <section className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Configuration
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-200">
                  Supported Stablecoins
                </label>

                <div className="min-h-[42px] rounded-lg border border-white/10 bg-black/20 p-2">
                  <div className="flex flex-wrap gap-2">
                    {stables.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200"
                      >
                        {s}
                        <button
                          onClick={() => removeStable(s)}
                          className="ml-1 text-slate-400 transition hover:text-rose-300"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    <input
                      value={stableInput}
                      onChange={(e) => setStableInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addStable(stableInput);
                          setStableInput("");
                        }
                      }}
                      placeholder="+ Add symbol"
                      className="w-28 bg-transparent px-1 py-1 text-xs text-white placeholder:text-slate-600 outline-none"
                    />

                    <button
                      onClick={() => {
                        addStable(stableInput);
                        setStableInput("");
                      }}
                      className="rounded border border-white/10 bg-black/20 px-2 py-1 text-xs text-slate-300 transition hover:border-white/15 hover:text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
                <div>
                  <span className="block text-sm font-medium text-slate-200">Enable Chain</span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    Allow interactions on this network immediately.
                  </span>
                </div>

                <button
                  onClick={() => setEnabled((v) => !v)}
                  className={[
                    "relative inline-flex h-6 w-11 items-center rounded-full border border-white/10 transition",
                    enabled ? "bg-sky-400/80" : "bg-white/5",
                  ].join(" ")}
                  aria-pressed={enabled}
                >
                  <span
                    className={[
                      "inline-block h-5 w-5 transform rounded-full bg-white transition",
                      enabled ? "translate-x-5" : "translate-x-1",
                    ].join(" ")}
                  />
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-white/10 bg-black/20 p-6">
          <button
            onClick={props.onClose}
            className="flex-1 rounded-lg border border-white/10 bg-transparent px-4 py-2.5 font-medium text-slate-200 transition hover:border-white/15 hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="flex-1 rounded-lg bg-sky-400 px-4 py-2.5 font-bold text-slate-950 transition hover:bg-sky-300"
          >
            {props.mode === "create" ? "Create Chain" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}