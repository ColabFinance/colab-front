"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useToast } from "@/shared/ui/toast/useToast";

import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { useActiveWallet } from "@/hooks/useActiveWallet";

import { getVaultDetails } from "@/application/vault/onchain/getVaultDetails.usecase";
import { getVaultStatus } from "@/application/vault/api/getVaultStatus.usecase";
import { setAutomationEnabled } from "@/application/vault/onchain/setAutomationEnabled.usecase";
import { setAutomationConfig } from "@/application/vault/onchain/setAutomationConfig.usecase";

import { depositToken } from "@/application/vault/onchain/depositToken.usecase";
import { openInitialPosition } from "@/application/vault/onchain/openInitialPosition.usecase";
import { rebalanceWithCaps } from "@/application/vault/onchain/rebalanceWithCaps.usecase";
import { stake } from "@/application/vault/onchain/stake.usecase";
import { unstake } from "@/application/vault/onchain/unstake.usecase";
import { claimRewards } from "@/application/vault/onchain/claimRewards.usecase";
import { collectToVault } from "@/application/vault/onchain/collectToVault.usecase";
import { exitToVault } from "@/application/vault/onchain/exitToVault.usecase";
import { exitWithdrawAll } from "@/application/vault/onchain/exitWithdrawAll.usecase";
import { swapExactInPancake } from "@/application/vault/onchain/swapExactInPancake.usecase";

// import { autoRebalancePancake } from "@/application/vault/api/autoRebalancePancake.usecase";

import type { VaultDetails } from "@/domain/vault/types";
import type { VaultStatus } from "@/domain/vault/status";
import { usePrivy } from "@privy-io/react-auth";
import { useAuthToken } from "@/hooks/useAuthToken";
import { setDailyHarvestConfigOnchain } from "@/application/vault/onchain/setDailyHarvestConfig.usecase";
import { updateDailyHarvestConfigUseCase } from "@/application/vault/api/updateDailyHarvestConfig.usecase";
import { setCompoundConfigOnchain } from "@/application/vault/onchain/etCompoundConfig.usecase";
import { updateCompoundConfigUseCase } from "@/application/vault/api/updateCompoundConfig.usecase";
import { setRewardSwapConfigOnchain } from "@/application/vault/onchain/setRewardSwapConfig.usecase";
import { updateRewardSwapConfigUseCase } from "@/application/vault/api/updateRewardSwapConfig.usecase";

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function formatTs(ts?: number) {
  if (!ts || ts <= 0) return "-";
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

function is0xAddress(a?: string) {
  if (!a) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(a);
}

export default function VaultDetailsPage() {
  const { authenticated, login } = usePrivy();
  const { ensureTokenOrLogin } = useAuthToken();
  const params = useParams();

  const vaultAddress = useMemo(() => {
    const raw = (params as any)?.address;
    if (!raw) return "";
    if (Array.isArray(raw)) return raw[0] || "";
    return String(raw);
  }, [params]);

  const isAddress = useMemo(() => /^0x[a-fA-F0-9]{40}$/.test(vaultAddress), [vaultAddress]);

  const { push } = useToast();
  const { ownerAddr } = useOwnerAddress();
  const { activeWallet } = useActiveWallet();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState<VaultDetails | null>(null);
  const [lastTx, setLastTx] = useState<{ tx_hash: string; receipt: any } | null>(null);

  // status panel (api-lp)
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusErr, setStatusErr] = useState("");
  const [status, setStatus] = useState<VaultStatus | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);

  // ---------------- form state ----------------

  // automation
  const [cooldownSec, setCooldownSec] = useState<string>("0");
  const [maxSlippageBps, setMaxSlippageBps] = useState<string>("50");
  const [allowSwap, setAllowSwap] = useState<boolean>(true);

  // deposit
  const [depositTokenAddr, setDepositTokenAddr] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [depositDecimals, setDepositDecimals] = useState<string>("18");

  // open initial position
  const [openLowerTick, setOpenLowerTick] = useState<string>("");
  const [openUpperTick, setOpenUpperTick] = useState<string>("");

  // rebalance
  const [rebalLowerTick, setRebalLowerTick] = useState<string>("");
  const [rebalUpperTick, setRebalUpperTick] = useState<string>("");
  const [cap0, setCap0] = useState<string>("0");
  const [cap1, setCap1] = useState<string>("0");

  // swap exact in pancake
  const [swapTokenIn, setSwapTokenIn] = useState<string>("");
  const [swapAmountIn, setSwapAmountIn] = useState<string>("");
  const [swapDecimalsIn, setSwapDecimalsIn] = useState<string>("18");
  const [swapMinOut, setSwapMinOut] = useState<string>("0");

  // withdraw
  const [withdrawTo, setWithdrawTo] = useState<string>("");

  // api bot
  const [autoReason, setAutoReason] = useState<string>("manual_trigger");

  // ---------------- new: client vault setConfigs ----------------
  const [dhEnabled, setDhEnabled] = useState(true);
  const [dhCooldownSec, setDhCooldownSec] = useState<string>("86400");

  const [cpEnabled, setCpEnabled] = useState(true);
  const [cpCooldownSec, setCpCooldownSec] = useState<string>("0");

  const [rsEnabled, setRsEnabled] = useState(false);
  const [rsTokenIn, setRsTokenIn] = useState("");
  const [rsTokenOut, setRsTokenOut] = useState("");
  const [rsFee, setRsFee] = useState<string>("0");
  const [rsSqrtPriceLimitX96, setRsSqrtPriceLimitX96] = useState<string>("0");

  const isOwner = !!data?.owner && !!ownerAddr && data.owner.toLowerCase() === ownerAddr.toLowerCase();

  async function refresh() {
    if (!vaultAddress) return;
    if (!isAddress) return;

    setErr("");
    setLoading(true);
    try {
      const d = await getVaultDetails(vaultAddress);
      setData(d);

      setCooldownSec(String(d.cooldownSec ?? 0));
      setMaxSlippageBps(String(d.maxSlippageBps ?? 0));
      setAllowSwap(Boolean(d.allowSwap));

      // sensible defaults for deposit token (token0)
      if (!depositTokenAddr) setDepositTokenAddr(d.token0 || "");

      // default withdraw_to = owner wallet
      if (!withdrawTo && ownerAddr) setWithdrawTo(ownerAddr);
    } catch (e: any) {
      setErr(e?.message || String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function refreshStatus() {
    if (!vaultAddress) return;
    if (!isAddress) return;

    setStatusErr("");
    setStatusLoading(true);
    try {
      const s = await getVaultStatus(vaultAddress);
      setStatus(s);
      setStatusOpen(true);

      // prefill ticks for open/rebalance
      if (s?.tick_spacing && typeof s.tick === "number") {
        const spacing = Number(s.tick_spacing || 0);
        if (spacing > 0) {
          // default bands if empty
          if (!openLowerTick && !openUpperTick) {
            const lower = s.tick - 60 * spacing;
            const upper = s.tick + 60 * spacing;
            setOpenLowerTick(String(lower));
            setOpenUpperTick(String(upper));
          }
          if (!rebalLowerTick && !rebalUpperTick) {
            const lower = s.tick - 40 * spacing;
            const upper = s.tick + 40 * spacing;
            setRebalLowerTick(String(lower));
            setRebalUpperTick(String(upper));
          }
        }
      }

      push({ title: "Status loaded", description: `${shortAddr(s.pool)} pool` });
    } catch (e: any) {
      setStatusErr(e?.message || String(e));
      setStatus(null);
    } finally {
      setStatusLoading(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      push({ title: "Copied", description: text });
    } catch {
      push({ title: "Copy failed", description: "Clipboard permission denied." });
    }
  }

  async function runTx(fn: () => Promise<{ tx_hash: string; receipt: any }>) {
    setErr("");
    setLastTx(null);

    if (!isAddress || !vaultAddress) {
      setErr("Invalid vault address in URL.");
      return;
    }
    if (!activeWallet) {
      setErr("Wallet not connected. Login/Connect with Privy first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fn();
      setLastTx(res);
      push({ title: "Tx confirmed", description: shortAddr(res.tx_hash) });
      await refresh();
    } catch (e: any) {
      setErr(e?.shortMessage || e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function runApi(fn: () => Promise<any>) {
    setErr("");
    setLastTx(null);

    if (!isAddress || !vaultAddress) {
      setErr("Invalid vault address in URL.");
      return;
    }

    setLoading(true);
    try {
      const res = await fn();
      push({ title: "API OK", description: "Operation executed." });
      // if the API returns tx hash, show it
      if (res?.tx_hash) setLastTx({ tx_hash: String(res.tx_hash), receipt: res });
      await refresh();
      await refreshStatus();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function requireToken(): Promise<string | null> {
    if (!authenticated) {
      login();
      return null;
    }
    const token = await ensureTokenOrLogin();
    return token || null;
  }

  async function onSetDailyHarvest() {
    setErr("");
    setLastTx(null);

    if (!activeWallet) {
      setErr("Wallet not connected.");
      return;
    }

    const cd = Number((dhCooldownSec || "").trim());
    if (!Number.isFinite(cd) || cd < 0 || cd > 0xffffffff || Math.floor(cd) !== cd) {
      setErr("dailyHarvestCooldownSec must be a uint32 integer.");
      return;
    }

    setLoading(true);
    try {
      // 1) onchain
      const tx = await setDailyHarvestConfigOnchain({
        wallet: activeWallet,
        vault: vaultAddress,
        enabled: !!dhEnabled,
        cooldownSec: cd,
      });
      setLastTx(tx);

      // 2) persist in Mongo
      const token = await requireToken();
      if (!token) return;

      await updateDailyHarvestConfigUseCase({
        accessToken: token,
        vault: vaultAddress,
        payload: { enabled: !!dhEnabled, cooldown_sec: cd },
      });

      push({ title: "Daily harvest config", description: "On-chain + Mongo updated." });
      await refresh();
      await refreshStatus();
    } catch (e: any) {
      setErr(e?.shortMessage || e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function onSetCompound() {
    setErr("");
    setLastTx(null);

    if (!activeWallet) {
      setErr("Wallet not connected.");
      return;
    }

    const cd = Number((cpCooldownSec || "").trim());
    if (!Number.isFinite(cd) || cd < 0 || cd > 0xffffffff || Math.floor(cd) !== cd) {
      setErr("compoundCooldownSec must be a uint32 integer.");
      return;
    }

    setLoading(true);
    try {
      // 1) onchain
      const tx = await setCompoundConfigOnchain({
        wallet: activeWallet,
        vault: vaultAddress,
        enabled: !!cpEnabled,
        cooldownSec: cd,
      });
      setLastTx(tx);

      // 2) persist in Mongo
      const token = await requireToken();
      if (!token) return;

      await updateCompoundConfigUseCase({
        accessToken: token,
        vault: vaultAddress,
        payload: { enabled: !!cpEnabled, cooldown_sec: cd },
      });

      push({ title: "Compound config", description: "On-chain + Mongo updated." });
      await refresh();
      await refreshStatus();
    } catch (e: any) {
      setErr(e?.shortMessage || e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function onSetRewardSwap() {
    setErr("");
    setLastTx(null);

    if (!activeWallet) {
      setErr("Wallet not connected.");
      return;
    }

    if (rsEnabled) {
      if (!is0xAddress(rsTokenIn)) {
        setErr("rewardSwap tokenIn must be an address.");
        return;
      }
      if (!is0xAddress(rsTokenOut)) {
        setErr("rewardSwap tokenOut must be an address.");
        return;
      }
      const feeN = Number((rsFee || "").trim());
      if (!Number.isFinite(feeN) || feeN < 0 || feeN > 0xffffff || Math.floor(feeN) !== feeN) {
        setErr("rewardSwap fee must be uint24 integer (ex: 100, 500, 2500, 10000).");
        return;
      }
    }

    setLoading(true);
    try {
      // 1) onchain
      const tx = await setRewardSwapConfigOnchain({
        wallet: activeWallet,
        vault: vaultAddress,
        enabled: !!rsEnabled,
        tokenIn: rsEnabled ? rsTokenIn.trim() : "0x0000000000000000000000000000000000000000",
        tokenOut: rsEnabled ? rsTokenOut.trim() : "0x0000000000000000000000000000000000000000",
        fee: rsEnabled ? (rsFee || "0").trim() : "0",
        sqrtPriceLimitX96: (rsSqrtPriceLimitX96 || "0").trim() || "0",
      });
      setLastTx(tx);

      // 2) persist in Mongo
      const token = await requireToken();
      if (!token) return;

      await updateRewardSwapConfigUseCase({
        accessToken: token,
        vault: vaultAddress,
        payload: {
          enabled: !!rsEnabled,
          token_in: rsEnabled ? rsTokenIn.trim() : "0x0000000000000000000000000000000000000000",
          token_out: rsEnabled ? rsTokenOut.trim() : "0x0000000000000000000000000000000000000000",
          fee: rsEnabled ? Number((rsFee || "0").trim()) : 0,
          sqrt_price_limit_x96: (rsSqrtPriceLimitX96 || "0").trim() || "0",
        },
      });

      push({ title: "Reward swap config", description: "On-chain + Mongo updated." });
      await refresh();
      await refreshStatus();
    } catch (e: any) {
      setErr(e?.shortMessage || e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!vaultAddress) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultAddress]);

  if (!vaultAddress || !isAddress) {
    return <div style={{ padding: 24 }}>Invalid or missing vault address in URL.</div>;
  }

  // derived helpers for selects
  const tokenOptions = useMemo(() => {
    const opts: { label: string; value: string }[] = [];
    if (data?.token0) opts.push({ label: `token0 (${shortAddr(data.token0)})`, value: data.token0 });
    if (data?.token1) opts.push({ label: `token1 (${shortAddr(data.token1)})`, value: data.token1 });
    return opts;
  }, [data?.token0, data?.token1]);

  return (
    <main style={{ padding: 24, maxWidth: 1200 }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Vault</h1>
          <div style={{ marginTop: 6, opacity: 0.85, fontFamily: "monospace" }}>{vaultAddress}</div>
          <div style={{ marginTop: 6, opacity: 0.75 }}>
            Wallet: {activeWallet?.address ? shortAddr(activeWallet.address) : "-"}
          </div>
          <div style={{ marginTop: 6, opacity: 0.75 }}>Owner: {ownerAddr ? shortAddr(ownerAddr) : "-"}</div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Button onClick={() => copy(vaultAddress)} variant="ghost">
            Copy address
          </Button>
          <Button onClick={refresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={refreshStatus} disabled={statusLoading}>
            {statusLoading ? "Loading status..." : "Vault status"}
          </Button>
        </div>
      </div>

      {err ? <div style={{ marginTop: 12, color: "crimson" }}>{err}</div> : null}
      {statusErr ? <div style={{ marginTop: 12, color: "crimson" }}>{statusErr}</div> : null}

      {/* status drawer */}
      {statusOpen && status ? (
        <Card style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <div style={{ fontWeight: 800 }}>Vault status (api-lp)</div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="ghost" onClick={() => setStatusOpen(false)}>
                Close
              </Button>
              <Button variant="ghost" onClick={() => copy(JSON.stringify(status, null, 2))}>
                Copy JSON
              </Button>
            </div>
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Mini label="Pool" value={status.pool} />
            <Mini label="Adapter" value={status.adapter} />
            <Mini label="NFPM" value={status.nfpm} />
            <Mini label="Gauge" value={status.gauge} />
            <Mini label="Pair" value={`${status.token0.symbol}/${status.token1.symbol}`} />
            <Mini label="Tick" value={`${status.tick} (spacing ${status.tick_spacing})`} />
            <Mini label="Range" value={`${status.lower_tick} → ${status.upper_tick} (${status.range_side})`} />
            <Mini label="Out of range" value={String(status.out_of_range)} />
            <Mini
              label="Price"
              value={`${status.prices.current.p_t1_t0.toFixed(6)} ${status.token1.symbol} per ${status.token0.symbol}`}
            />
            <Mini
              label="Fees (uncollected)"
              value={`${status.fees_uncollected.token0.toFixed(6)} ${status.token0.symbol} / ${status.fees_uncollected.token1.toFixed(6)} ${status.token1.symbol}`}
            />
            <Mini
              label="Holdings (totals)"
              value={`${status.holdings.totals.token0.toFixed(6)} ${status.token0.symbol} / ${status.holdings.totals.token1.toFixed(6)} ${status.token1.symbol}`}
            />
            <Mini label="Last rebalance" value={formatTs(status.last_rebalance_ts)} />
          </div>

          <pre style={{ marginTop: 12, background: "#fafafa", padding: 10, borderRadius: 10, overflow: "auto" }}>
            {JSON.stringify(status, null, 2)}
          </pre>
        </Card>
      ) : null}

      {/* last tx */}
      {lastTx ? (
        <Card style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 800 }}>Last action</div>
          <div style={{ marginTop: 6, opacity: 0.8, fontFamily: "monospace" }}>
            tx_hash: {lastTx.tx_hash ? shortAddr(lastTx.tx_hash) : "-"}
          </div>
          <pre style={{ marginTop: 8, background: "#fafafa", padding: 10, borderRadius: 10, overflow: "auto" }}>
            {JSON.stringify(lastTx, null, 2)}
          </pre>
        </Card>
      ) : null}

      {!data ? (
        <Card style={{ marginTop: 14 }}>
          <div style={{ opacity: 0.85 }}>{loading ? "Loading vault details..." : "No data."}</div>
        </Card>
      ) : (
        <>
          {/* top info */}
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Wiring</div>

              <Row label="Owner" value={data.owner} right={`You: ${ownerAddr ? shortAddr(ownerAddr) : "-"}`} />
              <Row label="Executor" value={data.executor} />
              <Row label="Adapter" value={data.adapter} />
              <Row label="DEX Router" value={data.dexRouter} />
              <Row label="Fee Collector" value={data.feeCollector} />
              <Row label="Strategy ID" value={String(data.strategyId)} />

              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button onClick={() => copy(data.owner)} variant="ghost">
                  Copy owner
                </Button>
                <Button onClick={() => copy(data.adapter)} variant="ghost">
                  Copy adapter
                </Button>
                <Button onClick={() => copy(data.dexRouter)} variant="ghost">
                  Copy router
                </Button>
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>State</div>

              <Row label="token0" value={data.token0} />
              <Row label="token1" value={data.token1} />
              <Row label="positionTokenId" value={data.positionTokenId} />
              <Row label="lastRebalanceTs" value={String(data.lastRebalanceTs)} right={formatTs(data.lastRebalanceTs)} />

              <div style={{ marginTop: 10, opacity: 0.75 }}>
                {isOwner ? "You are the owner (owner actions enabled)." : "Not owner (owner actions disabled)."}
              </div>
            </Card>
          </div>

          {/* ACTIONS GRID */}
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Automation */}
            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>1) Automation</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input
                  label="cooldown_sec"
                  value={cooldownSec}
                  onChange={(e) => setCooldownSec(e.target.value)}
                  placeholder="0"
                  disabled={!isOwner}
                />
                <Input
                  label="max_slippage_bps"
                  value={maxSlippageBps}
                  onChange={(e) => setMaxSlippageBps(e.target.value)}
                  placeholder="50"
                  disabled={!isOwner}
                />
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <label style={{ display: "flex", gap: 10, alignItems: "center", opacity: isOwner ? 1 : 0.6 }}>
                  <input
                    type="checkbox"
                    checked={allowSwap}
                    onChange={(e) => setAllowSwap(e.target.checked)}
                    disabled={!isOwner}
                  />
                  allow_swap
                </label>

                <Button
                  disabled={loading || !isOwner || !activeWallet}
                  onClick={() =>
                    runTx(() =>
                      setAutomationEnabled({
                        wallet: activeWallet!,
                        vaultAddress,
                        enabled: !data.automationEnabled,
                      }),
                    )
                  }
                >
                  {data.automationEnabled ? "Disable automation" : "Enable automation"}
                </Button>

                <Button
                  disabled={loading || !isOwner || !activeWallet}
                  onClick={() =>
                    runTx(() =>
                      setAutomationConfig({
                        wallet: activeWallet!,
                        vaultAddress,
                        cooldown_sec: Number(cooldownSec || "0"),
                        max_slippage_bps: Number(maxSlippageBps || "0"),
                        allow_swap: Boolean(allowSwap),
                      }),
                    )
                  }
                >
                  Save config
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75 }}>
                Current: enabled={String(data.automationEnabled)}, cooldown={data.cooldownSec}, slippageBps=
                {data.maxSlippageBps}, allowSwap={String(data.allowSwap)}
              </div>
            </Card>
            
            <Card style={{ marginTop: 14 }}>
              <div style={{ fontWeight: 800 }}>ClientVault setConfig (on-chain) + persist (Mongo)</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
                Cada botão faz a tx on-chain (owner) e depois atualiza o vault no Mongo via API.
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                {/* Daily harvest */}
                <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
                  <div style={{ fontWeight: 800 }}>Daily harvest</div>

                  <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                    <input type="checkbox" checked={dhEnabled} onChange={(e) => setDhEnabled(e.target.checked)} disabled={loading} />
                    <div>enabled</div>
                  </label>

                  <Input
                    label="cooldown_sec (uint32)"
                    placeholder="86400"
                    value={dhCooldownSec}
                    onChange={(e) => setDhCooldownSec(e.target.value)}
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <Button onClick={onSetDailyHarvest} disabled={loading}>
                      {loading ? "Running..." : "Set daily harvest"}
                    </Button>
                  </div>
                </div>

                {/* Compound */}
                <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
                  <div style={{ fontWeight: 800 }}>Compound</div>

                  <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                    <input type="checkbox" checked={cpEnabled} onChange={(e) => setCpEnabled(e.target.checked)} disabled={loading} />
                    <div>enabled</div>
                  </label>

                  <Input
                    label="cooldown_sec (uint32)"
                    placeholder="0"
                    value={cpCooldownSec}
                    onChange={(e) => setCpCooldownSec(e.target.value)}
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <Button onClick={onSetCompound} disabled={loading}>
                      {loading ? "Running..." : "Set compound"}
                    </Button>
                  </div>
                </div>

                {/* Reward swap */}
                <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
                  <div style={{ fontWeight: 800 }}>Reward swap</div>

                  <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                    <input type="checkbox" checked={rsEnabled} onChange={(e) => setRsEnabled(e.target.checked)} disabled={loading} />
                    <div>enabled</div>
                  </label>

                  <Input
                    label="tokenIn (address)"
                    placeholder="0x..."
                    value={rsTokenIn}
                    onChange={(e) => setRsTokenIn(e.target.value)}
                    disabled={loading || !rsEnabled}
                  />
                  <Input
                    label="tokenOut (address)"
                    placeholder="0x..."
                    value={rsTokenOut}
                    onChange={(e) => setRsTokenOut(e.target.value)}
                    disabled={loading || !rsEnabled}
                  />
                  <Input
                    label="fee (uint24)"
                    placeholder="2500"
                    value={rsFee}
                    onChange={(e) => setRsFee(e.target.value)}
                    disabled={loading || !rsEnabled}
                  />
                  <Input
                    label="sqrtPriceLimitX96 (uint160)"
                    placeholder="0"
                    value={rsSqrtPriceLimitX96}
                    onChange={(e) => setRsSqrtPriceLimitX96(e.target.value)}
                    disabled={loading}
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                    <Button onClick={onSetRewardSwap} disabled={loading}>
                      {loading ? "Running..." : "Set reward swap"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Deposit */}
            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>2) Deposit tokens (wallet → vault)</div>

              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>token</div>
                  <select
                    value={depositTokenAddr}
                    onChange={(e) => setDepositTokenAddr(e.target.value)}
                    disabled={!isOwner}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      fontFamily: "monospace",
                    }}
                  >
                    <option value="">Select token...</option>
                    {tokenOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                    {/* manual */}
                    <option value={depositTokenAddr}>
                      Custom ({depositTokenAddr ? shortAddr(depositTokenAddr) : "set below"})
                    </option>
                  </select>
                </div>

                {!tokenOptions.length ? (
                  <div style={{ opacity: 0.75 }}>Tokens not loaded yet. Click Refresh.</div>
                ) : null}

                <Input
                  label="token_address (optional override)"
                  value={depositTokenAddr}
                  onChange={(e) => setDepositTokenAddr(e.target.value)}
                  placeholder="0x..."
                  disabled={!isOwner}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Input
                    label="amount (human)"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="e.g. 10.5"
                    disabled={!isOwner}
                  />
                  <Input
                    label="decimals"
                    value={depositDecimals}
                    onChange={(e) => setDepositDecimals(e.target.value)}
                    placeholder="18"
                    disabled={!isOwner}
                  />
                </div>

                <Button
                  disabled={loading || !isOwner || !activeWallet || !is0xAddress(depositTokenAddr) || !depositAmount}
                  onClick={() =>
                    runTx(() =>
                      depositToken({
                        wallet: activeWallet!,
                        vaultAddress,
                        tokenAddress: depositTokenAddr,
                        amount: depositAmount,
                        decimals: Number(depositDecimals || "18"),
                      } as any),
                    )
                  }
                >
                  Deposit token
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75 }}>
                Dica: faça 2 deposits, um para token0 e outro para token1.
              </div>
            </Card>

            {/* Open initial position */}
            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>3) Open initial position</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input
                  label="lower_tick"
                  value={openLowerTick}
                  onChange={(e) => setOpenLowerTick(e.target.value)}
                  placeholder="e.g. -120000"
                  disabled={!isOwner}
                />
                <Input
                  label="upper_tick"
                  value={openUpperTick}
                  onChange={(e) => setOpenUpperTick(e.target.value)}
                  placeholder="e.g. -118000"
                  disabled={!isOwner}
                />
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button disabled={statusLoading} onClick={refreshStatus}>
                  Prefill using status
                </Button>

                <Button
                  disabled={loading || !isOwner || !activeWallet || !openLowerTick || !openUpperTick}
                  onClick={() =>
                    runTx(() =>
                      openInitialPosition({
                        wallet: activeWallet!,
                        vaultAddress,
                        lower_tick: Number(openLowerTick),
                        upper_tick: Number(openUpperTick),
                      } as any),
                    )
                  }
                >
                  Open initial position
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75 }}>
                Recomendado: clique “Vault status” antes pra pegar tick/tick_spacing e montar um range bom.
              </div>
            </Card>

            {/* Rebalance */}
            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>4) Rebalance (manual)</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input
                  label="lower_tick"
                  value={rebalLowerTick}
                  onChange={(e) => setRebalLowerTick(e.target.value)}
                  placeholder="e.g. -120000"
                  disabled={!isOwner}
                />
                <Input
                  label="upper_tick"
                  value={rebalUpperTick}
                  onChange={(e) => setRebalUpperTick(e.target.value)}
                  placeholder="e.g. -118000"
                  disabled={!isOwner}
                />
              </div>

              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input
                  label="cap0 (raw, optional)"
                  value={cap0}
                  onChange={(e) => setCap0(e.target.value)}
                  placeholder="0"
                  disabled={!isOwner}
                />
                <Input
                  label="cap1 (raw, optional)"
                  value={cap1}
                  onChange={(e) => setCap1(e.target.value)}
                  placeholder="0"
                  disabled={!isOwner}
                />
              </div>

              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button disabled={statusLoading} onClick={refreshStatus}>
                  Prefill using status
                </Button>

                <Button
                  disabled={loading || !isOwner || !activeWallet || !rebalLowerTick || !rebalUpperTick}
                  onClick={() =>
                    runTx(() =>
                      rebalanceWithCaps({
                        wallet: activeWallet!,
                        vaultAddress,
                        lower_tick: Number(rebalLowerTick),
                        upper_tick: Number(rebalUpperTick),
                        cap0: String(cap0 || "0"),
                        cap1: String(cap1 || "0"),
                      } as any),
                    )
                  }
                >
                  Rebalance with caps
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75 }}>
                Use cap0/cap1 só se você estiver usando limites no contrato (senão deixe 0).
              </div>
            </Card>

            {/* Stake / Rewards */}
            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>5) Stake / Rewards</div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button disabled={loading || !isOwner || !activeWallet} onClick={() => runTx(() => stake({ wallet: activeWallet!, vaultAddress } as any))}>
                  Stake
                </Button>

                <Button
                  disabled={loading || !isOwner || !activeWallet}
                  onClick={() => runTx(() => unstake({ wallet: activeWallet!, vaultAddress } as any))}
                >
                  Unstake
                </Button>

                <Button
                  disabled={loading || !isOwner || !activeWallet}
                  onClick={() => runTx(() => claimRewards({ wallet: activeWallet!, vaultAddress } as any))}
                >
                  Claim rewards
                </Button>

                <Button
                  disabled={loading || !isOwner || !activeWallet}
                  onClick={() => runTx(() => collectToVault({ wallet: activeWallet!, vaultAddress }))}
                >
                  Collect fees → vault
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75 }}>
                Ordem típica pra sair: Claim → Collect → Unstake → Exit+Withdraw.
              </div>
            </Card>

            {/* Swap */}
            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>6) Swap (Pancake)</div>

              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>token_in</div>
                  <select
                    value={swapTokenIn}
                    onChange={(e) => setSwapTokenIn(e.target.value)}
                    disabled={!isOwner}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      fontFamily: "monospace",
                    }}
                  >
                    <option value="">Select token...</option>
                    {tokenOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Input
                    label="amount_in (human)"
                    value={swapAmountIn}
                    onChange={(e) => setSwapAmountIn(e.target.value)}
                    placeholder="e.g. 1.25"
                    disabled={!isOwner}
                  />
                  <Input
                    label="decimals_in"
                    value={swapDecimalsIn}
                    onChange={(e) => setSwapDecimalsIn(e.target.value)}
                    placeholder="18"
                    disabled={!isOwner}
                  />
                </div>

                <Input
                  label="min_out (raw)"
                  value={swapMinOut}
                  onChange={(e) => setSwapMinOut(e.target.value)}
                  placeholder="0"
                  disabled={!isOwner}
                />

                <Button
                  disabled={loading || !isOwner || !activeWallet || !is0xAddress(swapTokenIn) || !swapAmountIn}
                  onClick={() =>
                    runTx(() =>
                      swapExactInPancake({
                        wallet: activeWallet!,
                        vaultAddress,
                        token_in: swapTokenIn,
                        amount_in: swapAmountIn,
                        decimals_in: Number(swapDecimalsIn || "18"),
                        min_out: String(swapMinOut || "0"),
                      } as any),
                    )
                  }
                >
                  Swap exact in
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75 }}>
                Se você não sabe o min_out, deixe 0 (não recomendado em produção).
              </div>
            </Card>

            {/* Exit / Withdraw */}
            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>7) Exit / Withdraw</div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
                  disabled={loading || !isOwner || !activeWallet}
                  onClick={() => runTx(() => exitToVault({ wallet: activeWallet!, vaultAddress }))}
                >
                  Exit position → vault
                </Button>
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                <Input
                  label="withdraw_to"
                  value={withdrawTo}
                  onChange={(e) => setWithdrawTo(e.target.value)}
                  placeholder="0x..."
                  disabled={!isOwner}
                />
                <Button
                  disabled={loading || !isOwner || !activeWallet || !is0xAddress(withdrawTo)}
                  onClick={() => runTx(() => exitWithdrawAll({ wallet: activeWallet!, vaultAddress, to: withdrawTo }))}
                >
                  Exit + withdraw all
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75 }}>Obs: essas txs são onchain via wallet do usuário.</div>
            </Card>

            {/* API executor */}
            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>8) Bot / Executor (api-lp)</div>

              <div style={{ display: "grid", gap: 10 }}>
                <Input
                  label="reason"
                  value={autoReason}
                  onChange={(e) => setAutoReason(e.target.value)}
                  placeholder="manual_trigger"
                />

                {/* <Button
                  disabled={loading}
                  onClick={() =>
                    runApi(() =>
                      autoRebalancePancake({
                        vaultAddress,
                        reason: autoReason,
                      } as any),
                    )
                  }
                >
                  Auto rebalance (api-lp)
                </Button> */}
              </div>

              <div style={{ marginTop: 10, opacity: 0.75 }}>
                Esse botão chama o executor (server) e não usa sua carteira.
              </div>
            </Card>
          </div>
        </>
      )}
    </main>
  );
}

function Row(props: { label: string; value: string; right?: string }) {
  const { label, value, right } = props;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 10, marginTop: 8 }}>
      <div style={{ opacity: 0.7 }}>{label}</div>
      <div style={{ fontFamily: "monospace" }}>
        <div>{value || "-"}</div>
        {right ? <div style={{ opacity: 0.7, marginTop: 2 }}>{right}</div> : null}
      </div>
    </div>
  );
}

function Mini(props: { label: string; value: string }) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{props.label}</div>
      <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 12, wordBreak: "break-all" }}>
        {props.value || "-"}
      </div>
    </div>
  );
}
