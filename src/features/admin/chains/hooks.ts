"use client";

import { useEffect, useMemo, useState } from "react";

import { useAuthToken } from "@/hooks/useAuthToken";

import {
  type AdminChainItem,
  type ChainRegistryStatus,
  type CreateChainBody,
  type UpdateChainBody,
} from "@/core/infra/api/api-lp/admin";

import { createChainUseCase } from "@/core/usecases/admin/chains/createChain.usecase";
import { listChainsUseCase } from "@/core/usecases/admin/chains/listChains.usecase";
import { updateChainUseCase } from "@/core/usecases/admin/chains/updateChain.usecase";

import type { ChainDrawerPayload, ChainRow, ChainStatus, RpcTestState } from "./types";

type Toast = { title: string; description?: string };

function normalizeExplorerLabel(url: string) {
  return url.replace(/^https?:\/\//, "").split("/")[0] || url;
}

function formatRelativeTime(iso?: string) {
  if (!iso) return "-";

  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return iso;

  const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));

  if (diffSec < 60) return "just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return `${diffWeek} week${diffWeek === 1 ? "" : "s"} ago`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`;

  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} year${diffYear === 1 ? "" : "s"} ago`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "object" && error !== null) {
    const maybe = error as { message?: unknown; detail?: unknown };

    if (typeof maybe.detail === "string") return maybe.detail;
    if (typeof maybe.message === "string") return maybe.message;
  }

  return "Unknown error.";
}

function toUiStatus(status?: ChainRegistryStatus): ChainStatus {
  if (status === "MAINTENANCE") return "maintenance";
  if (status === "DISABLED") return "disabled";
  return "enabled";
}

function toApiStatus(status: ChainStatus): ChainRegistryStatus {
  if (status === "maintenance") return "MAINTENANCE";
  if (status === "disabled") return "DISABLED";
  return "ENABLED";
}

function mapApiItemToRow(item: AdminChainItem): ChainRow {
  return {
    key: item.key || String(item.chain_id),
    name: item.name,
    chainId: item.chain_id,
    status: toUiStatus(item.status),
    rpcUrl: item.rpc_url,
    explorerUrl: item.explorer_url,
    explorerLabel: item.explorer_label || normalizeExplorerLabel(item.explorer_url),
    nativeSymbol: item.native_symbol,
    stables: Array.isArray(item.stables) ? item.stables : [],
    updatedAt: formatRelativeTime(item.updated_at_iso || item.created_at_iso),
    logoUrl: item.logo_url || "",
  };
}

function mapDrawerPayloadToCreateBody(payload: ChainDrawerPayload): CreateChainBody {
  return {
    name: payload.name.trim(),
    chain_id: Number(payload.chainId),
    native_symbol: payload.nativeSymbol.trim().toUpperCase(),
    rpc_url: payload.rpcUrl.trim(),
    explorer_url: payload.explorerUrl.trim(),
    explorer_label: payload.explorerLabel?.trim() || undefined,
    stables: payload.stables.map((item) => item.trim().toUpperCase()).filter(Boolean),
    status: payload.enabled ? "ENABLED" : "DISABLED",
    logo_url: payload.logoUrl?.trim() || undefined,
  };
}

function mapRowToUpdateBody(row: ChainRow, nextStatus?: ChainStatus): UpdateChainBody {
  return {
    key: row.key,
    name: row.name,
    chain_id: row.chainId,
    native_symbol: row.nativeSymbol,
    rpc_url: row.rpcUrl,
    explorer_url: row.explorerUrl,
    explorer_label: row.explorerLabel,
    stables: row.stables,
    status: toApiStatus(nextStatus ?? row.status),
    logo_url: row.logoUrl || undefined,
  };
}

export function useChainsEnvState(opts: { onToast: (t: Toast) => void }) {
  const { token, ready, ensureTokenOrLogin } = useAuthToken();

  const [rows, setRows] = useState<ChainRow[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ChainStatus | "all">("all");

  const pageSize = 4;
  const [page, setPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<ChainRow | null>(null);

  const [rpcTest, setRpcTest] = useState<RpcTestState>({ state: "idle" });
  const [isLoading, setIsLoading] = useState(false);

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
    return rows.filter((r) => r.status === "enabled" || r.status === "maintenance").length;
  }, [rows]);

  async function getAccessTokenOrToast() {
    const accessToken = token || (await ensureTokenOrLogin());

    if (!accessToken) {
      opts.onToast({
        title: "Authentication required",
        description: "Admin access token not found.",
      });
      return "";
    }

    return accessToken;
  }

  async function refreshChains(params?: { silent?: boolean }) {
    const silent = params?.silent ?? false;
    const accessToken = token || (await ensureTokenOrLogin());

    if (!accessToken) {
      if (!silent) {
        opts.onToast({
          title: "Authentication required",
          description: "Admin access token not found.",
        });
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await listChainsUseCase({
        accessToken,
        limit: 500,
      });

      const items = Array.isArray(response.data) ? (response.data as AdminChainItem[]) : [];
      setRows(items.map(mapApiItemToRow));

      if (!silent) {
        opts.onToast({
          title: "Chains refreshed",
          description: `${items.length} chain(s) loaded from backend.`,
        });
      }
    } catch (error) {
      opts.onToast({
        title: "Failed to load chains",
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!ready || !token) return;
    void refreshChains({ silent: true });
  }, [ready, token]);

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

    await new Promise((r) => setTimeout(r, 900));

    const latestBlock = (
      12_000_000 + Math.floor(Math.random() * 900_000)
    ).toLocaleString("en-US");

    setRpcTest({ state: "success", latestBlock });
  }

  async function toggleRow(row: ChainRow) {
    const accessToken = await getAccessTokenOrToast();
    if (!accessToken) return;

    const nextStatus: ChainStatus = row.status === "disabled" ? "enabled" : "disabled";

    try {
      await updateChainUseCase({
        accessToken,
        body: mapRowToUpdateBody(row, nextStatus),
      });

      await refreshChains({ silent: true });

      opts.onToast({
        title: nextStatus === "disabled" ? "Chain disabled" : "Chain enabled",
        description: `${row.name} was updated in backend.`,
      });
    } catch (error) {
      opts.onToast({
        title: "Failed to update chain",
        description: getErrorMessage(error),
      });
    }
  }

  async function submitDrawer(payload: ChainDrawerPayload) {
    const accessToken = await getAccessTokenOrToast();
    if (!accessToken) return;

    try {
      if (drawerMode === "create") {
        await createChainUseCase({
          accessToken,
          body: mapDrawerPayloadToCreateBody(payload),
        });

        opts.onToast({
          title: "Chain created",
          description: `${payload.name} was saved to database.`,
        });

        setDrawerOpen(false);
        setPage(1);
        await refreshChains({ silent: true });
        return;
      }

      if (drawerMode === "edit" && editing) {
        await updateChainUseCase({
          accessToken,
          body: {
            key: editing.key,
            ...mapDrawerPayloadToCreateBody(payload),
          },
        });

        opts.onToast({
          title: "Chain updated",
          description: `${payload.name} was updated in database.`,
        });

        setDrawerOpen(false);
        await refreshChains({ silent: true });
      }
    } catch (error) {
      opts.onToast({
        title: drawerMode === "create" ? "Failed to create chain" : "Failed to update chain",
        description: getErrorMessage(error),
      });
    }
  }

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

    refreshChains,
    isLoading,
  };
}