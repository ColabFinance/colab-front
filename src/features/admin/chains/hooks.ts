"use client";

import { useMemo, useState } from "react";
import type { ChainRow, ChainDrawerPayload, ChainStatus, RpcTestState } from "./ui/types";

const CHAINS_SEED: ChainRow[] = [
  {
    key: "ethereum",
    name: "Ethereum Mainnet",
    chainId: 1,
    status: "enabled",
    rpcUrl: "https://eth-mainnet…",
    explorerLabel: "etherscan.io",
    explorerUrl: "https://etherscan.io",
    nativeSymbol: "ETH",
    stables: ["USDC", "USDT", "DAI"],
    updatedAt: "2 mins ago",
    logoUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/748fc90d1c-fd3da7b1eeda49dbf09d.png",
  },
  {
    key: "arbitrum",
    name: "Arbitrum One",
    chainId: 42161,
    status: "enabled",
    rpcUrl: "https://arb1.arbit…",
    explorerLabel: "arbiscan.io",
    explorerUrl: "https://arbiscan.io",
    nativeSymbol: "ETH",
    stables: ["USDC.e", "USDT"],
    updatedAt: "1 day ago",
    logoUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/f4a51f4e3c-07a515278e95e6d26a4a.png",
  },
  {
    key: "optimism",
    name: "Optimism",
    chainId: 10,
    status: "maintenance",
    rpcUrl: "https://mainnet.opt…",
    explorerLabel: "optimistic.etherscan.io",
    explorerUrl: "https://optimistic.etherscan.io",
    nativeSymbol: "ETH",
    stables: ["USDC", "DAI"],
    updatedAt: "3 days ago",
    logoUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/1df20551de-74b020e4587cdaf5f839.png",
  },
  {
    key: "polygon",
    name: "Polygon PoS",
    chainId: 137,
    status: "disabled",
    rpcUrl: "https://polygon-rp…",
    explorerLabel: "polygonscan.com",
    explorerUrl: "https://polygonscan.com",
    nativeSymbol: "MATIC",
    stables: ["USDC", "USDT"],
    updatedAt: "1 week ago",
    logoUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/ec8afc0622-233fff3d9e44378a288f.png",
  },
  {
    key: "base",
    name: "Base",
    chainId: 8453,
    status: "enabled",
    rpcUrl: "https://mainnet.base…",
    explorerLabel: "basescan.org",
    explorerUrl: "https://basescan.org",
    nativeSymbol: "ETH",
    stables: ["USDC", "USDbC"],
    updatedAt: "2 weeks ago",
    logoUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/52b04f8e41-8c488ec604e5c8802b0a.png",
  },
  {
    key: "bnb",
    name: "BNB Smart Chain",
    chainId: 56,
    status: "enabled",
    rpcUrl: "https://bsc-dataseed…",
    explorerLabel: "bscscan.com",
    explorerUrl: "https://bscscan.com",
    nativeSymbol: "BNB",
    stables: ["USDT", "USDC"],
    updatedAt: "1 month ago",
    logoUrl:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/11e860ba4b-4bb817aacbebe25507af.png",
  },
];

type Toast = { title: string; description?: string };

export function useChainsEnvState(opts: { onToast: (t: Toast) => void }) {
  const [rows, setRows] = useState<ChainRow[]>(CHAINS_SEED);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ChainStatus | "all">("all");

  const pageSize = 4;
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<ChainRow | null>(null);

  const [rpcTest, setRpcTest] = useState<RpcTestState>({ state: "idle" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((r) => {
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        String(r.chainId).includes(q) ||
        r.rpcUrl.toLowerCase().includes(q);

      const matchesStatus = status === "all" ? true : r.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [rows, query, status]);

  const filteredCount = filtered.length;

  const maxPage = Math.max(1, Math.ceil(filteredCount / pageSize));
  const safePage = Math.min(page, maxPage);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  const range = useMemo(() => {
    if (filteredCount === 0) return { from: 0, to: 0 };
    const from = (safePage - 1) * pageSize + 1;
    const to = Math.min(safePage * pageSize, filteredCount);
    return { from, to };
  }, [filteredCount, safePage]);

  const canPrev = safePage > 1;
  const canNext = safePage < maxPage;

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () => setPage((p) => Math.min(maxPage, p + 1));

  const activeCount = useMemo(() => {
    // “Active” = enabled + maintenance (igual no visual do HTML)
    return rows.filter((r) => r.status === "enabled" || r.status === "maintenance").length;
  }, [rows]);

  function openCreate() {
    setDrawerMode("create");
    setEditing(null);
    setDrawerOpen(true);
    setRpcTest({ state: "idle" });
  }

  function openEdit(row: ChainRow) {
    setDrawerMode("edit");
    setEditing(row);
    setDrawerOpen(true);
    setRpcTest({ state: "idle" });
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  async function testRpc(row: ChainRow) {
    opts.onToast({
      title: "Test RPC",
      description: `Mock test for ${row.name} (${row.rpcUrl})`,
    });
  }

  async function testRpcInline(rpcUrl: string) {
    setRpcTest({ state: "loading" });

    // mock delay
    await new Promise((r) => setTimeout(r, 900));

    // mock latest block
    const latestBlock = (12_000_000 + Math.floor(Math.random() * 900_000)).toLocaleString("en-US");
    setRpcTest({ state: "success", latestBlock });
  }

  function toggleRow(row: ChainRow) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.key !== row.key) return r;

        if (r.status === "disabled") {
          opts.onToast({ title: "Enabled", description: `${r.name} is now enabled (mock).` });
          return { ...r, status: "enabled", updatedAt: "just now" };
        }

        opts.onToast({ title: "Disabled", description: `${r.name} is now disabled (mock).` });
        return { ...r, status: "disabled", updatedAt: "just now" };
      }),
    );
  }

  function submitDrawer(payload: ChainDrawerPayload) {
    if (drawerMode === "create") {
      const key = `${payload.chainId}-${payload.name}`.toLowerCase().replace(/\s+/g, "-");
      const next: ChainRow = {
        key,
        name: payload.name,
        chainId: payload.chainId,
        status: payload.enabled ? "enabled" : "disabled",
        rpcUrl: payload.rpcUrl,
        explorerUrl: payload.explorerUrl,
        explorerLabel: payload.explorerLabel || payload.explorerUrl.replace(/^https?:\/\//, "").split("/")[0],
        nativeSymbol: payload.nativeSymbol,
        stables: payload.stables,
        updatedAt: "just now",
        logoUrl: payload.logoUrl || "",
      };

      setRows((prev) => [next, ...prev]);
      opts.onToast({ title: "Chain created", description: `${payload.name} (mock)` });
      setDrawerOpen(false);
      setPage(1);
      return;
    }

    if (drawerMode === "edit" && editing) {
      setRows((prev) =>
        prev.map((r) => {
          if (r.key !== editing.key) return r;

          return {
            ...r,
            name: payload.name,
            chainId: payload.chainId,
            status: payload.enabled ? "enabled" : "disabled",
            rpcUrl: payload.rpcUrl,
            explorerUrl: payload.explorerUrl,
            explorerLabel:
              payload.explorerLabel ||
              payload.explorerUrl.replace(/^https?:\/\//, "").split("/")[0],
            nativeSymbol: payload.nativeSymbol,
            stables: payload.stables,
            updatedAt: "just now",
          };
        }),
      );

      opts.onToast({ title: "Chain updated", description: `${payload.name} (mock)` });
      setDrawerOpen(false);
    }
  }

  // keep page stable when filters change
  function setQuerySafe(v: string) {
    setQuery(v);
    setPage(1);
  }
  function setStatusSafe(v: ChainStatus | "all") {
    setStatus(v);
    setPage(1);
  }

  return {
    rows,
    query,
    setQuery: setQuerySafe,
    status,
    setStatus: setStatusSafe,

    pageRows,
    filteredCount,
    range,
    canPrev,
    canNext,
    prevPage,
    nextPage,

    drawerOpen,
    drawerMode,
    editing,
    openCreate,
    openEdit,
    closeDrawer,
    submitDrawer,

    testRpc,
    testRpcInline,
    rpcTest,

    toggleRow,
    activeCount,
  };
}