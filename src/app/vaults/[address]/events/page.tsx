"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/toast/useToast";

import { usePrivy } from "@privy-io/react-auth";
import { useAuthToken } from "@/hooks/useAuthToken";

import { listVaultUserEventsUseCase } from "@/application/vault/api/listVaultUserEvents.usecase";
import type { VaultUserEvent } from "@/domain/vault/events";

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function formatIso(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export default function VaultEventsPage() {
  const params = useParams();
  const vaultAddress = useMemo(() => {
    const raw = (params as any)?.address;
    if (!raw) return "";
    if (Array.isArray(raw)) return raw[0] || "";
    return String(raw);
  }, [params]);

  const { push } = useToast();
  const { authenticated, login } = usePrivy();
  const { ensureTokenOrLogin } = useAuthToken();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [events, setEvents] = useState<VaultUserEvent[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);

  async function requireToken(): Promise<string | null> {
    if (!authenticated) {
      login();
      return null;
    }
    const token = await ensureTokenOrLogin();
    return token || null;
  }

  async function refresh() {
    if (!vaultAddress) return;
    setErr("");
    setLoading(true);
    try {
      const token = await requireToken();
      if (!token) return;

      const res = await listVaultUserEventsUseCase({
        accessToken: token,
        vault: vaultAddress,
        limit,
        offset,
      });

      setEvents(Array.isArray(res?.data) ? res.data : []);
      setTotal(typeof res?.total === "number" ? res.total : null);

      push({ title: "Events loaded", description: `${Array.isArray(res?.data) ? res.data.length : 0} items` });
    } catch (e: any) {
      setErr(e?.message || String(e));
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultAddress, offset]);

  return (
    <main style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Vault events</h1>
          <div style={{ marginTop: 6, opacity: 0.85, fontFamily: "monospace" }}>{vaultAddress}</div>
          {total !== null ? <div style={{ marginTop: 6, opacity: 0.75 }}>Total: {total}</div> : null}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Button onClick={refresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {err ? <div style={{ marginTop: 12, color: "crimson" }}>{err}</div> : null}

      <Card style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div style={{ fontWeight: 800 }}>History</div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost" disabled={loading || offset <= 0} onClick={() => setOffset(Math.max(0, offset - limit))}>
              Prev
            </Button>
            <Button variant="ghost" disabled={loading || (events?.length || 0) < limit} onClick={() => setOffset(offset + limit)}>
              Next
            </Button>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {!events.length ? (
            <div style={{ opacity: 0.75 }}>{loading ? "Loading..." : "No events yet."}</div>
          ) : (
            events.map((ev) => (
              <div key={ev.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div style={{ fontWeight: 900 }}>
                    {ev.event_type.toUpperCase()}{" "}
                    <span style={{ opacity: 0.7, fontWeight: 600 }}>
                      {ev.chain}{ev.dex ? ` / ${ev.dex}` : ""}
                    </span>
                  </div>
                  <div style={{ fontFamily: "monospace", opacity: 0.8 }}>
                    {shortAddr(ev.tx_hash)} {ev.block_number ? `@${ev.block_number}` : ""}
                  </div>
                </div>

                <div style={{ marginTop: 6, opacity: 0.8 }}>
                  When: {formatIso(ev.ts_iso)} {ev.owner ? ` | Actor: ${shortAddr(ev.owner)}` : ""}
                </div>

                {ev.event_type === "deposit" ? (
                  <div style={{ marginTop: 10, fontFamily: "monospace" }}>
                    token: {ev.token ? shortAddr(ev.token) : "-"}{" "}
                    | amount: {ev.amount_human ?? "-"} {ev.decimals !== undefined ? `(decimals ${ev.decimals})` : ""}
                    {ev.amount_raw ? <div style={{ marginTop: 4, opacity: 0.8 }}>raw: {ev.amount_raw}</div> : null}
                  </div>
                ) : (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontFamily: "monospace" }}>to: {ev.to ? shortAddr(ev.to) : "-"}</div>
                    {ev.transfers?.length ? (
                      <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                        {ev.transfers.map((t, idx) => (
                          <div key={`${ev.id}-${idx}`} style={{ fontFamily: "monospace", opacity: 0.9 }}>
                            {shortAddr(t.token)} | from {shortAddr(t.from)} → to {shortAddr(t.to)} | raw {t.amount_raw}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ marginTop: 8, opacity: 0.7 }}>No parsed transfers (receipt missing or allowlist empty).</div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </main>
  );
}
