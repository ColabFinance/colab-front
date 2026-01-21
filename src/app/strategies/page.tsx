"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

import { listStrategiesOnchain } from "@/application/strategy/onchain/listStrategies.usecase";
import { registerStrategyOnchain } from "@/application/strategy/onchain/registerStrategy.usecase";
import { getStrategyParamsUseCase } from "@/application/strategy/api/getStrategyParams.usecase";
import { upsertStrategyParamsUseCase } from "@/application/strategy/api/upsertStrategyParams.usecase";

import { Strategy } from "@/domain/strategy/types";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useToast } from "@/shared/ui/toast/useToast";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { useActiveWallet } from "@/hooks/useActiveWallet";
import { createClientVaultOnchain } from "@/application/vault/onchain/createClientVault.usecase";
import { registerClientVault } from "@/application/vault/api/registerClientVault.usecase";
import { registerStrategyDbUseCase } from "@/application/strategy/api/registerStrategy.usecase";
import { strategyExistsUseCase } from "@/application/strategy/api/strategyExists.usecase";
import { listStrategiesUseCase } from "@/application/strategy/api/listStrategies.usecase";

type StrategyParamsForm = {
  // identity / metadata (name comes from onchain, read-only)
  symbol: string;
  indicator_set_id: string;
  status: "ACTIVE" | "INACTIVE";

  // params (typed inputs)
  skew_low_pct: string;
  skew_high_pct: string;

  max_major_side_pct: string; // optional
  vol_high_threshold_pct: string; // optional
  vol_high_threshold_pct_down: string; // optional

  high_vol_max_major_side_pct: string;
  standard_max_major_side_pct: string;

  eps: string;
  cooloff_bars: string;

  inrange_resize_mode: "preserve" | "skew_swap";
  breakout_confirm_bars: string;

  gauge_flow_enabled: boolean;
  low_vol_threshold: string; // optional
};

function numToStr(v: any, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;
  return fallback;
}

function normalizeSymbol(v: string) {
  return (v || "").trim().toUpperCase();
}

function isAddressLike(v?: string) {
  const s = (v || "").trim();
  return /^0x[a-fA-F0-9]{40}$/.test(s);
}

function buildParamsFromForm(form: StrategyParamsForm, tiersRaw: any[]) {
  const parseOptNum = (s: string) => {
    const t = (s || "").trim();
    if (!t) return null;
    const n = Number(t);
    if (Number.isNaN(n)) return null;
    return n;
  };

  const parseReqNum = (s: string) => {
    const t = (s || "").trim();
    const n = Number(t);
    if (Number.isNaN(n)) throw new Error(`Invalid number: "${s}"`);
    return n;
  };

  const parseReqInt = (s: string) => {
    const t = (s || "").trim();
    const n = Number(t);
    if (Number.isNaN(n) || !Number.isFinite(n)) throw new Error(`Invalid integer: "${s}"`);
    const i = Math.trunc(n);
    if (String(i) !== String(n) && t.includes(".")) {
      throw new Error(`Expected integer, got: "${s}"`);
    }
    return i;
  };

  const tiers = (tiersRaw || [])
    .filter(Boolean)
    .map((t: any) => ({
      name: String(t?.name || "").trim(),
      atr_pct_threshold: Number(t?.atr_pct_threshold),
      atr_pct_threshold_down:
        t?.atr_pct_threshold_down === null || t?.atr_pct_threshold_down === undefined
          ? null
          : Number(t?.atr_pct_threshold_down),
      bars_required: Number(t?.bars_required),
      max_major_side_pct: Number(t?.max_major_side_pct),
      allowed_from: Array.isArray(t?.allowed_from) ? t.allowed_from.map((x: any) => String(x)) : [],
    }))
    .filter(
      (t: any) =>
        t.name &&
        Number.isFinite(t.atr_pct_threshold) &&
        Number.isFinite(t.bars_required) &&
        Number.isFinite(t.max_major_side_pct)
    );

  return {
    skew_low_pct: parseReqNum(form.skew_low_pct),
    skew_high_pct: parseReqNum(form.skew_high_pct),

    max_major_side_pct: parseOptNum(form.max_major_side_pct),
    vol_high_threshold_pct: parseOptNum(form.vol_high_threshold_pct),
    vol_high_threshold_pct_down: parseOptNum(form.vol_high_threshold_pct_down),

    high_vol_max_major_side_pct: parseReqNum(form.high_vol_max_major_side_pct),
    standard_max_major_side_pct: parseReqNum(form.standard_max_major_side_pct),

    tiers,

    eps: parseReqNum(form.eps),
    cooloff_bars: parseReqInt(form.cooloff_bars),

    inrange_resize_mode: form.inrange_resize_mode,
    breakout_confirm_bars: parseReqInt(form.breakout_confirm_bars),

    gauge_flow_enabled: !!form.gauge_flow_enabled,
    low_vol_threshold: parseOptNum(form.low_vol_threshold),
  };
}

function safeJsonParseArray(raw: string): { ok: true; value: any[] } | { ok: false; error: string } {
  try {
    const v = JSON.parse(raw || "[]");
    if (!Array.isArray(v)) {
      return { ok: false, error: "tiers must be a JSON array" };
    }
    return { ok: true, value: v };
  } catch (e: any) {
    return { ok: false, error: e?.message || "invalid json" };
  }
}

function safeJsonParseObj(raw: string): { ok: true; value: any } | { ok: false; error: string } {
  try {
    const v = JSON.parse(raw || "{}");
    if (!v || typeof v !== "object" || Array.isArray(v)) return { ok: false, error: "swap_pools must be a JSON object" };
    return { ok: true, value: v };
  } catch (e: any) {
    return { ok: false, error: e?.message || "invalid json" };
  }
}

export default function StrategiesPage() {
  const { ready, authenticated, login } = usePrivy();
  const { ownerAddr } = useOwnerAddress();
  const { activeWallet } = useActiveWallet();
  const { ensureTokenOrLogin } = useAuthToken();
  const { push } = useToast();

  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [err, setErr] = useState("");
  const [lastTx, setLastTx] = useState<any>(null);

  // --- create onchain modal state ---
  const [createOpen, setCreateOpen] = useState(false);
  const [cAdapter, setCAdapter] = useState("");
  const [cRouter, setCRouter] = useState("");
  const [cToken0, setCToken0] = useState("");
  const [cToken1, setCToken1] = useState("");
  const [cName, setCName] = useState("");
  const [cDesc, setCDesc] = useState("");
  const [cSymbol, setCSymbol] = useState("ETHUSDT");
  const [cIndicatorSetId, setCIndicatorSetId] = useState("");

  // --- create vault modal (NEW) ---
  const [createVaultOpen, setCreateVaultOpen] = useState(false);
  const [createVaultStrategyId, setCreateVaultStrategyId] = useState<number | null>(null);

  const [vDex, setVDex] = useState("pancake");
  const [vChain] = useState<"base">("base");
  const [vParToken, setVParToken] = useState("WETH"); // key do alias
  const [vName, setVName] = useState("");
  const [vDescription, setVDescription] = useState("");

  const [vPool, setVPool] = useState("");
  const [vNfpm, setVNfpm] = useState("");
  const [vGauge, setVGauge] = useState("");
  const [vRpcUrl, setVRpcUrl] = useState("");
  const [vVersion, setVVersion] = useState("v2");

  const [vSwapPoolsJson, setVSwapPoolsJson] = useState<string>("{}");

  // --- params modal state ---
  const [paramsOpen, setParamsOpen] = useState(false);
  const [paramsStrategyId, setParamsStrategyId] = useState<number | null>(null);
  const [paramsLoading, setParamsLoading] = useState(false);

  // tier editor
  const [tiersJson, setTiersJson] = useState<string>("[]");

  // fields required by your collection (name is taken from onchain)
  const [form, setForm] = useState<StrategyParamsForm>({
    symbol: "ETHUSDT",
    indicator_set_id: "",
    status: "INACTIVE",

    skew_low_pct: "0.05",
    skew_high_pct: "0.05",

    max_major_side_pct: "0.01",
    vol_high_threshold_pct: "0.0008",
    vol_high_threshold_pct_down: "",

    high_vol_max_major_side_pct: "2",
    standard_max_major_side_pct: "0.01",

    eps: "0.000001",
    cooloff_bars: "10",

    inrange_resize_mode: "skew_swap",
    breakout_confirm_bars: "20",

    gauge_flow_enabled: true,
    low_vol_threshold: "0.0004",
  });

  const chainKey = useMemo<"base">(() => "base", []);

  const selectedStrategy = useMemo(() => {
    if (paramsStrategyId == null) return null;
    return strategies.find((s) => s.strategyId === paramsStrategyId) || null;
  }, [paramsStrategyId, strategies]);

  const selectedCreateVaultStrategy = useMemo(() => {
    if (createVaultStrategyId == null) return null;
    return strategies.find((s) => s.strategyId === createVaultStrategyId) || null;
  }, [createVaultStrategyId, strategies]);

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      if (!ownerAddr) {
        setStrategies([]);
        setErr("Connect with an wallet to continue.");
        return;
      }

      if (!authenticated) {
        login();
        return;
      }
      
      const token = await ensureTokenOrLogin();
      if (!token) {
        setStrategies([]);
        setErr("Missing access token. Please login again.");
        return;
      }

      const items = await listStrategiesUseCase({
        accessToken: token,
        query: { chain: chainKey, owner: ownerAddr },
      });
      
      setStrategies(items);
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function resetCreateVaultModal() {
    setCreateVaultStrategyId(null);
    setVDex("pancake");
    setVParToken("WETH");
    setVName("");
    setVDescription("");
    setVPool("");
    setVNfpm("");
    setVGauge("");
    setVRpcUrl("");
    setVVersion("v2");
    setVSwapPoolsJson("{}");
  }

  async function onOpenCreateVault(strategyId: number) {
    setErr("");
    setLastTx(null);

    if (!authenticated) {
      login();
      return;
    }
    if (!ownerAddr) {
      setErr("Connect a wallet first.");
      return;
    }

    setCreateVaultStrategyId(strategyId);

    setCreateVaultOpen(true);
  }

  async function onSubmitCreateVault() {
    setErr("");
    setLastTx(null);

    try {
      if (!authenticated) {
        login();
        return;
      }
      if (!ownerAddr) {
        setErr("Ainda sem wallet. Faça login novamente ou link MetaMask.");
        return;
      }
      if (createVaultStrategyId == null) {
        setErr("Missing strategy id.");
        return;
      }

      const s = selectedCreateVaultStrategy;
      if (!s) {
        setErr("Strategy not found. Refresh and try again.");
        return;
      }
      if (!s.active) {
        setErr("Strategy is not active on-chain.");
        return;
      }

      // required fields
      if (!vName.trim()) {
        setErr("name is required.");
        return;
      }
      if (!vDex.trim()) {
        setErr("dex is required.");
        return;
      }
      if (!vParToken.trim()) {
        setErr("par_token is required (used to generate alias).");
        return;
      }
      if (!isAddressLike(s.adapter)) {
        setErr("Strategy adapter invalid. Refresh on-chain strategies.");
        return;
      }

      // config required
      if (!isAddressLike(vPool)) {
        setErr("pool must be a valid 0x address.");
        return;
      }
      if (!isAddressLike(vNfpm)) {
        setErr("nfpm must be a valid 0x address.");
        return;
      }
      if (vGauge && !isAddressLike(vGauge)) {
        setErr("gauge must be a valid 0x address (or empty).");
        return;
      }
      if (!vRpcUrl.trim()) {
        setErr("rpc_url is required.");
        return;
      }
      if (!vVersion.trim()) {
        setErr("version is required (ex: v2).");
        return;
      }

      const swapPoolsParsed = safeJsonParseObj(vSwapPoolsJson);
      if (!swapPoolsParsed.ok) {
        setErr(swapPoolsParsed.error);
        return;
      }

      setLoading(true);
      const token = await ensureTokenOrLogin();
      if (!token) {
        setErr("Missing access token. Please login again.");
        return;
      }

      const onchain = await createClientVaultOnchain({
        wallet: activeWallet,
        strategyId: createVaultStrategyId,
        owner: ownerAddr,
      });
      
      const res = await registerClientVault({
        accessToken: token,
        payload: {
          vault_address: onchain.vault_address,
          chain: vChain,
          dex: vDex.trim(),
          owner: ownerAddr,
          par_token: vParToken.trim(),
          name: vName.trim(),
          description: vDescription.trim() || undefined,
          strategy_id: createVaultStrategyId,
          config: {
            adapter: selectedCreateVaultStrategy.adapter,
            pool: vPool.trim(),
            nfpm: vNfpm.trim(),
            gauge: vGauge.trim() || undefined,
            rpc_url: vRpcUrl.trim(),
            version: vVersion.trim(),
            swap_pools: swapPoolsParsed.value,
          },
        },
      });

      setLastTx({
        tx_hash: onchain.tx_hash,
        vault: onchain.vault_address,
        mongo_id: res?.mongo_id,
        alias: res?.alias,
      });

      push({
        title: "Vault created",
        description: res?.alias ? `alias: ${res.alias}` : onchain.vault_address,
      });

      setCreateVaultOpen(false);
      resetCreateVaultModal();
    } catch (e: any) {
      const msg = e?.message || String(e);
      setErr(msg);
      push({ title: "Create vault failed", description: msg });
    } finally {
      setLoading(false);
    }
  }

  async function onOpenCreateStrategy() {
    setErr("");
    setLastTx(null);

    if (!authenticated) {
      login();
      return;
    }
    if (!ownerAddr) {
      setErr("Connect a wallet first.");
      return;
    }
    setCreateOpen(true);
  }

  async function onSubmitCreateStrategy() {
    setErr("");
    setLastTx(null);

    try {
      if (!authenticated) {
        login();
        return;
      }
      if (!ownerAddr) {
        setErr("Connect a wallet first.");
        return;
      }

      setLoading(true);
      
      const name = cName.trim();
      const symbol = normalizeSymbol(cSymbol);
      const indicator_set_id = (cIndicatorSetId || "").trim();

      if (!name) {
        setErr("Name is required.");
        return;
      }
      if (!symbol) {
        setErr("Symbol is required (e.g. ETHUSDT).");
        return;
      }
      if (!indicator_set_id) {
        setErr("Indicator set id is required.");
        return;
      }
      
      const token = await ensureTokenOrLogin();
      if (!token) {
        throw new Error("Missing access token. Please login again.");
      }

      const existsRes = await strategyExistsUseCase({
        accessToken: token,
        query: {
          chain: chainKey,
          owner: ownerAddr,
          name,
          symbol,
        },
      });

      if (existsRes?.data?.exists) {
        setErr("A strategy with same (name, symbol) already exists. Choose another name for this symbol.");
        push({ title: "Cannot create strategy", description: "Duplicate (name, symbol)." });
        return;
      }

      const onchain = await registerStrategyOnchain({
        wallet: activeWallet,
        owner: ownerAddr,
        payload: {
          adapter: cAdapter.trim(),
          dexRouter: cRouter.trim(),
          token0: cToken0.trim(),
          token1: cToken1.trim(),
          name: cName.trim(),
          description: cDesc.trim(),
        },
      });
      
      const dbRes = await registerStrategyDbUseCase({
        accessToken: token,
        payload: {
          chain: chainKey, // "base"
          owner: ownerAddr,
          strategy_id: onchain.strategy_id,
          name: cName.trim(),
          
          symbol,
          indicator_set_id,

          adapter: cAdapter.trim(),
          dex_router: cRouter.trim(),
          token0: cToken0.trim(),
          token1: cToken1.trim(),

          tx_hash: onchain.tx_hash,
          status: "INACTIVE",
        },
      });
      
      setLastTx({
        tx_hash: onchain.tx_hash,
        strategy_id: onchain.strategy_id,
        db: dbRes?.data || dbRes,
      });
      
      push({
        title: "Strategy created",
        description: `strategy_id: ${onchain.strategy_id}`,
      });

      setCreateOpen(false);
      setCAdapter("");
      setCRouter("");
      setCToken0("");
      setCToken1("");
      setCName("");
      setCDesc("");
      setCSymbol("ETHUSDT");
      setCIndicatorSetId("");

      await refresh();
    } catch (e: any) {
      const msg = e?.message || String(e);
      setErr(msg);
      push({ title: "Create strategy failed", description: msg });
    } finally {
      setLoading(false);
    }
  }

  async function onOpenParams(strategyId: number) {
    setErr("");
    setParamsStrategyId(strategyId);
    setParamsOpen(true);

    // reset to defaults (deterministic UX)
    setForm((s) => ({
      ...s,
      symbol: "ETHUSDT",
      indicator_set_id: "",
      status: "INACTIVE",
    }));
    setTiersJson("[]");

    try {
      if (!authenticated) {
        login();
        return;
      }
      if (!ownerAddr) {
        setErr("Connect a wallet first.");
        return;
      }
      setParamsLoading(true);

      const token = await ensureTokenOrLogin();
      if (!token) {
        setErr("Missing access token. Please login again.");
        return;
      }

      const res = await getStrategyParamsUseCase({
        accessToken: token,
        chain: chainKey,
        owner: ownerAddr,
        strategyId,
      });

      const p = res?.data?.params || {};

      setForm((s) => ({
        ...s,
        // meta from backend if exists
        symbol: normalizeSymbol(res?.data?.symbol || "ETHUSDT"),
        indicator_set_id: res?.data?.indicator_set_id || "",
        status: (res?.data?.status || "INACTIVE").toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE",

        // params typed fields
        skew_low_pct: numToStr(p?.skew_low_pct, s.skew_low_pct),
        skew_high_pct: numToStr(p?.skew_high_pct, s.skew_high_pct),

        max_major_side_pct: numToStr(p?.max_major_side_pct, ""),
        vol_high_threshold_pct: numToStr(p?.vol_high_threshold_pct, ""),
        vol_high_threshold_pct_down: numToStr(p?.vol_high_threshold_pct_down, ""),

        high_vol_max_major_side_pct: numToStr(p?.high_vol_max_major_side_pct, s.high_vol_max_major_side_pct),
        standard_max_major_side_pct: numToStr(p?.standard_max_major_side_pct, s.standard_max_major_side_pct),

        eps: numToStr(p?.eps, s.eps),
        cooloff_bars: numToStr(p?.cooloff_bars, s.cooloff_bars),

        inrange_resize_mode: p?.inrange_resize_mode === "preserve" ? "preserve" : "skew_swap",
        breakout_confirm_bars: numToStr(p?.breakout_confirm_bars, s.breakout_confirm_bars),

        gauge_flow_enabled: typeof p?.gauge_flow_enabled === "boolean" ? p.gauge_flow_enabled : s.gauge_flow_enabled,
        low_vol_threshold: numToStr(p?.low_vol_threshold, ""),
      }));

      setTiersJson(JSON.stringify(Array.isArray(p?.tiers) ? p.tiers : [], null, 2));
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setParamsLoading(false);
    }
  }

  async function onSaveParams() {
    setErr("");
    try {
      if (!authenticated) {
        login();
        return;
      }
      if (!ownerAddr) {
        setErr("Connect a wallet first.");
        return;
      }
      if (paramsStrategyId == null) return;

      const s = selectedStrategy;
      const onchainName = (s?.name || "").trim();

      if (!onchainName) {
        setErr("Missing on-chain strategy name. Refresh and try again.");
        return;
      }

      const symbol = normalizeSymbol(form.symbol);
      const indicator_set_id = (form.indicator_set_id || "").trim();

      if (!symbol) {
        setErr("Symbol is required (e.g. ETHUSDT).");
        return;
      }
      if (!indicator_set_id) {
        setErr("Indicator set id is required.");
        return;
      }

      const tiersParsed = safeJsonParseArray(tiersJson);
      if (!tiersParsed.ok) {
        setErr(tiersParsed.error);
        return;
      }

      const params = buildParamsFromForm(form, tiersParsed.value);

      const token = await ensureTokenOrLogin();
      if (!token) {
        setErr("Missing access token. Please login again.");
        return;
      }

      const payload: any = {
        chain: chainKey,
        owner: ownerAddr,
        strategy_id: paramsStrategyId,

        // IMPORTANT: name must match on-chain strategy name
        name: onchainName,
        symbol,
        indicator_set_id,
        status: form.status,

        // onchain metadata (no form)
        adapter: s?.adapter,
        dex_router: s?.dexRouter,
        token0: s?.token0,
        token1: s?.token1,

        params,
      };

      // best-effort sanity for onchain fields
      if (payload.adapter && !isAddressLike(payload.adapter)) delete payload.adapter;
      if (payload.dex_router && !isAddressLike(payload.dex_router)) delete payload.dex_router;
      if (payload.token0 && !isAddressLike(payload.token0)) delete payload.token0;
      if (payload.token1 && !isAddressLike(payload.token1)) delete payload.token1;

      setParamsLoading(true);
      const res = await upsertStrategyParamsUseCase({
        accessToken: token,
        payload,
      });

      push({ title: "Params saved", description: res?.message || "ok" });
      setParamsOpen(false);
      setParamsStrategyId(null);
    } catch (e: any) {
      const msg = e?.message || String(e);
      setErr(msg);
      push({ title: "Save params failed", description: msg });
    } finally {
      setParamsLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ownerAddr]);

  if (!ready) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <main style={{ padding: 24, maxWidth: 1100 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Strategies</h1>

      <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <Button onClick={refresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>

        <Button onClick={onOpenCreateStrategy} disabled={loading}>
          Create strategy (on-chain)
        </Button>

        <div style={{ opacity: 0.85 }}>
          Owner: <b>{ownerAddr || "-"}</b>{" "}
          <span style={{ opacity: 0.75 }}>({activeWallet?.walletClientType || "unknown"})</span>
        </div>
      </div>

      {err ? <div style={{ marginTop: 12, color: "crimson" }}>{err}</div> : null}

      {lastTx ? (
        <Card style={{ marginTop: 12 }}>
          <div>
            <b>Last tx:</b>
          </div>
          <pre style={{ marginTop: 8, background: "#fafafa", padding: 10, borderRadius: 10, overflow: "auto" }}>
            {JSON.stringify(lastTx, null, 2)}
          </pre>
        </Card>
      ) : null}

      {/* Create vault modal (NEW) */}
      {createVaultOpen ? (
        <Card style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontWeight: 800 }}>
              Create Client Vault — Strategy #{createVaultStrategyId ?? "-"}{" "}
              <span style={{ opacity: 0.7 }}>
                {selectedCreateVaultStrategy?.name ? `(${selectedCreateVaultStrategy.name})` : ""}
              </span>
            </div>
            <Button
              onClick={() => {
                setCreateVaultOpen(false);
                resetCreateVaultModal();
              }}
              disabled={loading}
            >
              Close
            </Button>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="chain (fixed)" value={vChain} onChange={() => {}} disabled />
              <Input label="dex" placeholder="pancake | aerodrome | uniswap" value={vDex} onChange={(e) => setVDex(e.target.value)} />
            </div>

            <Input
              label="par_token (used for alias generation)"
              placeholder="WETH/USDC | ..."
              value={vParToken}
              onChange={(e) => setVParToken(e.target.value)}
            />

            <Input label="name" placeholder="Any display name" value={vName} onChange={(e) => setVName(e.target.value)} />

            <Input
              label="description (optional)"
              placeholder="Description for this client vault"
              value={vDescription}
              onChange={(e) => setVDescription(e.target.value)}
            />

            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>
              adapter (from strategy): <span style={{ fontFamily: "monospace" }}>{selectedCreateVaultStrategy?.adapter || "-"}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="pool" placeholder="Pool address" value={vPool} onChange={(e) => setVPool(e.target.value)} />
              <Input label="nfpm" placeholder="NFPM address" value={vNfpm} onChange={(e) => setVNfpm(e.target.value)} />
            </div>

            <Input label="gauge (optional)" placeholder="Gauge address" value={vGauge} onChange={(e) => setVGauge(e.target.value)} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input label="rpc_url" placeholder="RPC Url address" value={vRpcUrl} onChange={(e) => setVRpcUrl(e.target.value)} />
              <Input label="version" placeholder="Version" value={vVersion} onChange={(e) => setVVersion(e.target.value)} />
            </div>

            <div style={{ marginTop: 6 }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>swap_pools (JSON object)</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
                Example: {"{ \"WETH_USDC\": { \"dex\": \"aerodrome\", \"pool\": \"0x...\" } }"}
              </div>
              <textarea
                value={vSwapPoolsJson}
                onChange={(e) => setVSwapPoolsJson(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: 140,
                  fontFamily: "monospace",
                  fontSize: 13,
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #eee",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setCreateVaultOpen(false);
                  resetCreateVaultModal();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={onSubmitCreateVault} disabled={loading}>
                {loading ? "Creating..." : "Create vault (api-lp)"}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Create strategy modal */}
      {createOpen ? (
        <Card style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontWeight: 800 }}>Create Strategy (on-chain)</div>
            <Button onClick={() => setCreateOpen(false)} disabled={loading}>
              Close
            </Button>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            <Input label="Adapter" placeholder="Adapter 0x..." value={cAdapter} onChange={(e) => setCAdapter(e.target.value)} />
            <Input label="DEX Router" placeholder="Dex router 0x..." value={cRouter} onChange={(e) => setCRouter(e.target.value)} />
            <Input label="Token0" placeholder="Token0 0x..." value={cToken0} onChange={(e) => setCToken0(e.target.value)} />
            <Input label="Token1" placeholder="Token1 0x..." value={cToken1} onChange={(e) => setCToken1(e.target.value)} />
            <Input label="On-chain name" placeholder="Name..." value={cName} onChange={(e) => setCName(e.target.value)} />
            <Input label="On-chain description" placeholder="Description..." value={cDesc} onChange={(e) => setCDesc(e.target.value)} />
            <Input label="Symbol" placeholder="ETHUSDT..." value={cSymbol} onChange={(e) => setCSymbol(e.target.value)} />
            <Input label="Indicator set id" placeholder="cfg_hash..." value={cIndicatorSetId} onChange={(e) => setCIndicatorSetId(e.target.value)} />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button onClick={() => setCreateOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={onSubmitCreateStrategy} disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Params modal (unchanged) */}
      {paramsOpen ? (
        <Card style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontWeight: 800 }}>Strategy params (Mongo) — #{paramsStrategyId ?? "-"}</div>
            <Button
              onClick={() => {
                setParamsOpen(false);
                setParamsStrategyId(null);
              }}
              disabled={paramsLoading}
            >
              Close
            </Button>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <Input label="On-chain name (read-only)" placeholder="—" value={selectedStrategy?.name || ""} onChange={() => {}} disabled />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input
                label="Symbol"
                placeholder="ETHUSDT"
                value={form.symbol}
                onChange={(e) => setForm((s) => ({ ...s, symbol: e.target.value }))}
                disabled={paramsLoading}
              />
              <Input
                label="Indicator set id"
                placeholder="cfg_hash"
                value={form.indicator_set_id}
                onChange={(e) => setForm((s) => ({ ...s, indicator_set_id: e.target.value }))}
                disabled={paramsLoading}
              />
            </div>

            <Input
              label="Status"
              placeholder="ACTIVE or INACTIVE"
              value={form.status}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  status: (e.target.value || "INACTIVE").toUpperCase() === "ACTIVE" ? "ACTIVE" : "INACTIVE",
                }))
              }
              disabled={paramsLoading}
            />

            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
              Uniqueness is enforced by backend: (name + symbol). Name comes from on-chain.
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Params</div>

            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input
                  label="Skew low (%)"
                  placeholder="0.05"
                  value={form.skew_low_pct}
                  onChange={(e) => setForm((s) => ({ ...s, skew_low_pct: e.target.value }))}
                  disabled={paramsLoading}
                />
                <Input
                  label="Skew high (%)"
                  placeholder="0.05"
                  value={form.skew_high_pct}
                  onChange={(e) => setForm((s) => ({ ...s, skew_high_pct: e.target.value }))}
                  disabled={paramsLoading}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <Input
                  label="Max major side (opt)"
                  placeholder="0.01"
                  value={form.max_major_side_pct}
                  onChange={(e) => setForm((s) => ({ ...s, max_major_side_pct: e.target.value }))}
                  disabled={paramsLoading}
                />
                <Input
                  label="High vol threshold (opt)"
                  placeholder="0.0008"
                  value={form.vol_high_threshold_pct}
                  onChange={(e) => setForm((s) => ({ ...s, vol_high_threshold_pct: e.target.value }))}
                  disabled={paramsLoading}
                />
                <Input
                  label="High vol threshold down (opt)"
                  placeholder="0.0008"
                  value={form.vol_high_threshold_pct_down}
                  onChange={(e) => setForm((s) => ({ ...s, vol_high_threshold_pct_down: e.target.value }))}
                  disabled={paramsLoading}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input
                  label="High vol max major side"
                  placeholder="2"
                  value={form.high_vol_max_major_side_pct}
                  onChange={(e) => setForm((s) => ({ ...s, high_vol_max_major_side_pct: e.target.value }))}
                  disabled={paramsLoading}
                />
                <Input
                  label="Standard max major side"
                  placeholder="0.01"
                  value={form.standard_max_major_side_pct}
                  onChange={(e) => setForm((s) => ({ ...s, standard_max_major_side_pct: e.target.value }))}
                  disabled={paramsLoading}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <Input label="Epsilon (eps)" placeholder="0.000001" value={form.eps} onChange={(e) => setForm((s) => ({ ...s, eps: e.target.value }))} disabled={paramsLoading} />
                <Input label="Cooloff bars" placeholder="10" value={form.cooloff_bars} onChange={(e) => setForm((s) => ({ ...s, cooloff_bars: e.target.value }))} disabled={paramsLoading} />
                <Input label="Breakout confirm bars" placeholder="20" value={form.breakout_confirm_bars} onChange={(e) => setForm((s) => ({ ...s, breakout_confirm_bars: e.target.value }))} disabled={paramsLoading} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input
                  label="In-range resize mode"
                  placeholder="skew_swap | preserve"
                  value={form.inrange_resize_mode}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      inrange_resize_mode: (e.target.value || "skew_swap") === "preserve" ? "preserve" : "skew_swap",
                    }))
                  }
                  disabled={paramsLoading}
                />
                <Input label="Low vol threshold (opt)" placeholder="0.0004" value={form.low_vol_threshold} onChange={(e) => setForm((s) => ({ ...s, low_vol_threshold: e.target.value }))} disabled={paramsLoading} />
              </div>

              <label style={{ display: "flex", gap: 10, alignItems: "center", padding: 10, border: "1px solid #eee", borderRadius: 10 }}>
                <input type="checkbox" checked={form.gauge_flow_enabled} onChange={(e) => setForm((s) => ({ ...s, gauge_flow_enabled: e.target.checked }))} disabled={paramsLoading} />
                <div>
                  <div style={{ fontWeight: 700 }}>Gauge flow enabled</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>Use UNSTAKE → WITHDRAW → SWAP → OPEN → STAKE flow</div>
                </div>
              </label>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Tiers (JSON array)</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
              Array of objects: name, atr_pct_threshold, atr_pct_threshold_down, bars_required, max_major_side_pct, allowed_from.
            </div>

            <textarea
              value={tiersJson}
              onChange={(e) => setTiersJson(e.target.value)}
              style={{
                width: "100%",
                minHeight: 180,
                fontFamily: "monospace",
                fontSize: 13,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #eee",
              }}
              disabled={paramsLoading}
            />
          </div>

          <div style={{ marginTop: 14, fontSize: 13, opacity: 0.85 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>On-chain (auto)</div>
            <div>adapter: {selectedStrategy?.adapter || "-"}</div>
            <div>dexRouter: {selectedStrategy?.dexRouter || "-"}</div>
            <div>token0: {selectedStrategy?.token0 || "-"}</div>
            <div>token1: {selectedStrategy?.token1 || "-"}</div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
            <Button onClick={onSaveParams} disabled={paramsLoading}>
              {paramsLoading ? "Saving..." : "Save params"}
            </Button>
          </div>
        </Card>
      ) : null}

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {strategies.map((s) => (
          <Card key={s.strategyId}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 800 }}>
                  #{s.strategyId} — {s.name || "(no name)"}
                </div>
                <div style={{ opacity: 0.85, marginTop: 6 }}>{s.description || "-"}</div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div>
                  Active: <b>{String(s.active)}</b>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", marginTop: 8 }}>
                  <Button onClick={() => onOpenParams(s.strategyId)} disabled={loading}>
                    Edit params (Mongo)
                  </Button>

                  <Button onClick={() => onOpenCreateVault(s.strategyId)} disabled={loading || !s.active}>
                    {loading ? "Opening..." : "Create vault"}
                  </Button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
              <div>token0: {s.token0}</div>
              <div>token1: {s.token1}</div>
              <div>adapter: {s.adapter}</div>
              <div>dexRouter: {s.dexRouter}</div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}