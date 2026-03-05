"use client";

import { useMemo, useState } from "react";
import { CHAINS, MOCK_DEXES } from "./mock";
import { DexRegistryItem } from "./types";

export type DexRegistryFilters = {
  chainId: number | "all";
  keyQuery: string;
  status: "all" | "enabled" | "disabled";
};

export function useDexRegistry() {
  const [filters, setFilters] = useState<DexRegistryFilters>({
    chainId: 1,
    keyQuery: "",
    status: "all",
  });

  const data = useMemo(() => MOCK_DEXES, []);

  const filtered = useMemo(() => {
    const keyQuery = filters.keyQuery.trim().toLowerCase();

    return data.filter((d) => {
      if (filters.chainId !== "all" && d.chainId !== filters.chainId) return false;

      if (filters.status === "enabled" && !d.enabled) return false;
      if (filters.status === "disabled" && d.enabled) return false;

      if (!keyQuery) return true;

      const hay = `${d.name} ${d.key} ${d.routerAddress} ${d.quoterAddress ?? ""}`.toLowerCase();
      return hay.includes(keyQuery);
    });
  }, [data, filters]);

  const chainOptions = useMemo(() => CHAINS, []);

  const registeredCount = useMemo(() => {
    const chainId = filters.chainId === "all" ? 1 : filters.chainId;
    return data.filter((d) => d.chainId === chainId).length;
  }, [data, filters.chainId]);

  function resetFilters() {
    setFilters({ chainId: 1, keyQuery: "", status: "all" });
  }

  function updateDexLocal(id: string, patch: Partial<DexRegistryItem>) {
    // mock-only placeholder; real update will go through API later
    // keeping this hook API ready for when you wire the backend.
    void id;
    void patch;
  }

  return {
    filters,
    setFilters,
    resetFilters,

    chainOptions,

    data,
    filtered,
    registeredCount,

    updateDexLocal,
  };
}