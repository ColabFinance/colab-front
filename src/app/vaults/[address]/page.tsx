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
import { collectToVault } from "@/application/vault/onchain/collectToVault.usecase";
import { exitToVault } from "@/application/vault/onchain/exitToVault.usecase";
import { exitWithdrawAll } from "@/application/vault/onchain/exitWithdrawAll.usecase";

import type { VaultDetails } from "@/domain/vault/types";
import type { VaultStatus } from "@/domain/vault/status";

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function formatTs(ts?: number) {
  if (!ts || ts <= 0) return "-";
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

export default function VaultDetailsPage() {
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

  // form state
  const [cooldownSec, setCooldownSec] = useState<string>("0");
  const [maxSlippageBps, setMaxSlippageBps] = useState<string>("50");
  const [allowSwap, setAllowSwap] = useState<boolean>(true);
  const [withdrawTo, setWithdrawTo] = useState<string>("");

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

  useEffect(() => {
    if (!vaultAddress) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultAddress]);

  if (!vaultAddress || !isAddress) {
    return <div style={{ padding: 24 }}>Invalid or missing vault address in URL.</div>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Vault</h1>
          <div style={{ marginTop: 6, opacity: 0.85, fontFamily: "monospace" }}>{vaultAddress}</div>
          <div style={{ marginTop: 6, opacity: 0.75 }}>
            Wallet: {activeWallet?.address ? shortAddr(activeWallet.address) : "-"}
          </div>
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
            <Mini label="Tick" value={`${status.tick}`} />
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

      {lastTx ? (
        <Card style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 800 }}>Last tx</div>
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
            </Card>
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Automation (owner only)</div>

              <Row label="automationEnabled" value={String(data.automationEnabled)} />
              <Row label="cooldownSec" value={String(data.cooldownSec)} />
              <Row label="maxSlippageBps" value={String(data.maxSlippageBps)} />
              <Row label="allowSwap" value={String(data.allowSwap)} />

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
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
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
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
                  Save automation config
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.8 }}>
                {isOwner ? "You are the owner." : "Not owner (actions disabled)."}
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Operations (owner only)</div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
                  disabled={loading || !isOwner || !activeWallet}
                  onClick={() => runTx(() => collectToVault({ wallet: activeWallet!, vaultAddress }))}
                >
                  Collect to vault
                </Button>
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
                  disabled={loading || !isOwner || !activeWallet || !withdrawTo}
                  onClick={() => runTx(() => exitWithdrawAll({ wallet: activeWallet!, vaultAddress, to: withdrawTo }))}
                >
                  Exit + withdraw all
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75 }}>Obs: essas txs são onchain via wallet do usuário.</div>
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
