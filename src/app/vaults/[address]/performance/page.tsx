"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useToast } from "@/shared/ui/toast/useToast";

import { getVaultPerformanceUseCase } from "@/application/vault/api/getVaultPerformance.usecase";
import type { VaultPerformanceData } from "@/domain/vault/performance";

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function formatUsd(x?: number | null) {
  if (x === null || x === undefined || !Number.isFinite(Number(x))) return "-";
  const v = Number(x);
  return `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatPct(x?: number | null) {
  if (x === null || x === undefined || !Number.isFinite(Number(x))) return "-";
  return `${(Number(x) * 100).toFixed(2)}%`;
}

function formatIso(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function VaultPerformancePage() {
  const params = useParams();
  const { push } = useToast();

  const vaultAddress = useMemo(() => {
    const raw = (params as any)?.address;
    if (!raw) return "";
    if (Array.isArray(raw)) return raw[0] || "";
    return String(raw);
  }, [params]);

  const [episodesLimit, setEpisodesLimit] = useState<string>("300");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState<VaultPerformanceData | null>(null);

  async function load() {
    if (!vaultAddress) return;
    setErr("");
    setLoading(true);
    try {
      const lim = Number((episodesLimit || "300").trim());
      const res = await getVaultPerformanceUseCase({
        vault: vaultAddress,
        episodesLimit: Number.isFinite(lim) ? lim : 300,
      });
      setData(res.data);
      push({ title: "Performance loaded", description: shortAddr(vaultAddress) });
    } catch (e: any) {
      setErr(e?.message || String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!vaultAddress) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultAddress]);

  return (
    <main style={{ padding: 24, maxWidth: 1200 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Vault Performance</h1>
          <div style={{ marginTop: 6, opacity: 0.85, fontFamily: "monospace" }}>{vaultAddress}</div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Link href={`/vaults/${encodeURIComponent(vaultAddress)}`} style={{ textDecoration: "none" }}>
            <Button variant="ghost">Back</Button>
          </Link>

          <Input
            label="episodes_limit"
            value={episodesLimit}
            onChange={(e) => setEpisodesLimit(e.target.value)}
            placeholder="300"
          />

          <Button onClick={load} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {err ? <div style={{ marginTop: 12, color: "crimson" }}>{err}</div> : null}

      {!data ? (
        <Card style={{ marginTop: 14 }}>
          <div style={{ opacity: 0.85 }}>{loading ? "Loading..." : "No data."}</div>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Vault</div>
              <Row label="alias" value={String(data.vault?.alias || "-")} />
              <Row label="dex" value={String(data.vault?.dex || "-")} />
              <Row label="owner" value={String(data.vault?.owner || "-")} />
              <Row label="chain" value={String(data.vault?.chain || "-")} />
              <Row label="period start" value={formatIso(data.period?.start_ts_iso)} />
              <Row label="period end" value={formatIso(data.period?.end_ts_iso)} />
            </Card>

            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Totals</div>
              <Row label="deposited" value={formatUsd(data.cashflows_totals?.deposited_usd)} />
              <Row label="withdrawn" value={formatUsd(data.cashflows_totals?.withdrawn_usd)} />
              <Row label="net contributed" value={formatUsd(data.cashflows_totals?.net_contributed_usd)} />
              <Row label="missing usd items" value={String(data.cashflows_totals?.missing_usd_count ?? 0)} />
            </Card>
          </div>

          {/* Current / Profit */}
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Current value</div>
              <Row label="total" value={formatUsd(data.current_value?.total_usd)} right={String(data.current_value?.source || "unknown")} />
              <Row label="in position" value={formatUsd(data.current_value?.in_position_usd)} />
              <Row label="vault idle" value={formatUsd(data.current_value?.vault_idle_usd)} />
              <Row label="fees uncollected" value={formatUsd(data.current_value?.fees_uncollected_usd)} />
              <Row label="rewards pending" value={formatUsd(data.current_value?.rewards_pending_usd)} />
            </Card>

            <Card>
              <div style={{ fontWeight: 900, marginBottom: 10 }}>Profit</div>
              <Row label="profit" value={formatUsd(data.profit?.profit_usd)} right={formatPct(data.profit?.profit_pct)} />
              <Row label="profit net gas" value={formatUsd(data.profit?.profit_net_gas_usd)} right={formatPct(data.profit?.profit_net_gas_pct)} />
              <Row label="APR" value={formatPct(data.profit?.annualized?.apr)} />
              <Row label="APY (daily comp)" value={formatPct(data.profit?.annualized?.apy_daily_compound)} />
              <Row label="days" value={data.profit?.annualized?.days ? Number(data.profit.annualized.days).toFixed(2) : "-"} />
              <Row label="gas costs" value={formatUsd(data.gas_costs?.total_gas_usd)} right={`${data.gas_costs?.tx_count ?? 0} tx`} />
            </Card>
          </div>

          {/* Cashflows */}
          <Card style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 900 }}>Cashflows</div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
                  deposit/withdraw (USD best-effort)
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(data.cashflows, null, 2))}
              >
                Copy JSON
              </Button>
            </div>

            <div style={{ marginTop: 12, overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>time</th>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>type</th>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>usd</th>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>token</th>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>tx</th>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>source</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.cashflows || []).map((c, idx) => (
                    <tr key={`${c.tx_hash}-${idx}`}>
                      <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3" }}>{formatIso(c.ts_iso)}</td>
                      <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3" }}>{c.event_type}</td>
                      <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3" }}>{formatUsd(c.amount_usd)}</td>
                      <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3", fontFamily: "monospace" }}>
                        {c.token ? shortAddr(c.token) : "-"}
                      </td>
                      <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3", fontFamily: "monospace" }}>
                        {c.tx_hash ? shortAddr(c.tx_hash) : "-"}
                      </td>
                      <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3" }}>
                        {c.amount_usd_source || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Episodes */}
          <Card style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 900 }}>Episodes</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>
              total: {data.episodes?.total ?? data.episodes?.items?.length ?? 0}
            </div>

            <div style={{ marginTop: 12, overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>status</th>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>open</th>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>close</th>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>open px</th>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>close px</th>
                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>totals_usd</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.episodes?.items || []).map((ep, idx) => {
                    const totalsUsd = (ep.metrics as any)?.totals_usd;
                    return (
                      <tr key={`${ep.id || idx}-${idx}`}>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3" }}>{ep.status}</td>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3" }}>{formatIso(ep.open_time_iso || null)}</td>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3" }}>{formatIso(ep.close_time_iso || null)}</td>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3" }}>
                          {ep.open_price !== null && ep.open_price !== undefined ? Number(ep.open_price).toFixed(6) : "-"}
                        </td>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3" }}>
                          {ep.close_price !== null && ep.close_price !== undefined ? Number(ep.close_price).toFixed(6) : "-"}
                        </td>
                        <td style={{ padding: "8px 6px", borderBottom: "1px solid #f3f3f3" }}>
                          {totalsUsd !== null && totalsUsd !== undefined ? formatUsd(Number(totalsUsd)) : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Raw JSON</div>
            <pre style={{ background: "#fafafa", padding: 10, borderRadius: 10, overflow: "auto" }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </Card>
        </>
      )}
    </main>
  );
}

function Row(props: { label: string; value: any; right?: string }) {
  const { label, value, right } = props;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 10, marginTop: 8 }}>
      <div style={{ opacity: 0.7 }}>{label}</div>
      <div style={{ fontFamily: "monospace" }}>
        <div>{String(value ?? "-")}</div>
        {right ? <div style={{ opacity: 0.7, marginTop: 2 }}>{right}</div> : null}
      </div>
    </div>
  );
}
