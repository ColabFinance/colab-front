"use client";

import { useMemo, useState } from "react";
import type { CreateStrategyDraft, EditParamsDraft, MyStrategyRow } from "./types";
import { DEX_OPTIONS, MOCK_MY_STRATEGIES, POOL_OPTIONS } from "./mock";

function defaultCreateDraft(): CreateStrategyDraft {
  return {
    dexId: "",
    poolId: "",
    name: "",
    description: "",
    symbol: "",
    indicatorSource: "binance",
    emaFast: 10,
    emaSlow: 50,
    atrWindow: 20,
  };
}

function defaultEditDraft(row: MyStrategyRow): EditParamsDraft {
  return {
    status: row.status,
    indicatorSetId: row.indicatorSetId,
    symbol: row.symbol,

    indicatorSource: "binance",
    emaFast: 10,
    emaSlow: 50,
    atrWindow: 20,

    skewLowPct: 0.3,
    skewHighPct: 0.7,
    eps: 0.0005,
    cooloffBars: 12,
    breakoutConfirmBars: 3,
    inrangeResizeMode: "skew_swap",

    gaugeEnabled: true,

    tiersJson: `{
  "tiers": [
    { "lower": -1000, "upper": -500, "allocation": 0.2 },
    { "lower": -500, "upper": 0, "allocation": 0.3 },
    { "lower": 0, "upper": 500, "allocation": 0.3 },
    { "lower": 500, "upper": 1000, "allocation": 0.2 }
  ]
}`,
  };
}

export function useMyStrategies() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [selected, setSelected] = useState<MyStrategyRow | null>(null);

  const dexOptions = useMemo(() => DEX_OPTIONS, []);
  const poolOptions = useMemo(() => POOL_OPTIONS, []);
  const rows = useMemo(() => MOCK_MY_STRATEGIES, []);

  const [createDraft, setCreateDraft] = useState<CreateStrategyDraft>(defaultCreateDraft);
  const [editDraft, setEditDraft] = useState<EditParamsDraft | null>(null);

  const hasRows = rows.length > 0;

  function openCreate() {
    setCreateDraft(defaultCreateDraft());
    setCreateOpen(true);
  }

  function closeCreate() {
    setCreateOpen(false);
  }

  function confirmCreate() {
    // placeholder (vai pro backend depois)
    setCreateOpen(false);
  }

  function openEdit(row: MyStrategyRow) {
    setSelected(row);
    setEditDraft(defaultEditDraft(row));
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
  }

  function saveParams() {
    // placeholder (vai pro backend depois)
    setEditOpen(false);
  }

  function refresh() {
    // placeholder (vai pro backend depois)
  }

  return {
    dexOptions,
    poolOptions,

    rows,
    hasRows,

    createOpen,
    openCreate,
    closeCreate,
    createDraft,
    setCreateDraft,
    confirmCreate,

    editOpen,
    selected,
    openEdit,
    closeEdit,
    editDraft,
    setEditDraft,
    saveParams,

    refresh,
  };
}