"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { listStrategiesOnchain } from "@/application/strategy/listStrategies.usecase";
import { createVault } from "@/application/vault/createVault.usecase";
import { Strategy } from "@/domain/strategy/types";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useToast } from "@/shared/ui/toast/useToast";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

export default function StrategiesPage() {
  const { ready, authenticated, login } = usePrivy();
  const { ownerAddr, ensureWallet, linkExternal } = useOwnerAddress();
  const { ensureTokenOrLogin } = useAuthToken();
  const { push } = useToast();

  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [err, setErr] = useState("");
  const [lastTx, setLastTx] = useState<any>(null);

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      setStrategies(await listStrategiesOnchain());
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  async function onCreateVault(strategyId: number) {
    setErr("");
    setLastTx(null);

    try {
      if (!authenticated) {
        login();
        return;
      }

      if (!ownerAddr) {
        await ensureWallet();
      }

      if (!ownerAddr) {
        setErr("Ainda sem wallet. Use 'Create embedded wallet' ou 'Link MetaMask'.");
        return;
      }

      setLoading(true);
      const token = await ensureTokenOrLogin();
      
      if (!token) {
        setErr("Missing access token. Please login again.");
        return;
      }

      const res = await createVault({
        strategyId,
        ownerOverride: ownerAddr,
        gasStrategy: "auto",
        accessToken: token,
      });

      setLastTx(res);
      push({ title: "Vault created", description: res?.tx_hash || "tx sent" });
    } catch (e: any) {
      setErr(e?.message || String(e));
      push({ title: "Create vault failed", description: e?.message || String(e) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (!ready) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <main style={{ padding: 24, maxWidth: 1100 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Strategies</h1>

      <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
        <Button onClick={refresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
        <div style={{ opacity: 0.85 }}>
          Owner: <b>{ownerAddr || "-"}</b>
        </div>

        {authenticated && !ownerAddr ? (
          <>
            <Button onClick={ensureWallet} disabled={loading}>Create embedded wallet</Button>
            <Button onClick={linkExternal} disabled={loading}>Link MetaMask</Button>
          </>
        ) : null}
      </div>

      {err ? <div style={{ marginTop: 12, color: "crimson" }}>{err}</div> : null}

      {lastTx ? (
        <Card style={{ marginTop: 12 }}>
          <div><b>Last createClientVault tx:</b></div>
          <pre style={{ marginTop: 8, background: "#fafafa", padding: 10, borderRadius: 10, overflow: "auto" }}>
            {JSON.stringify(lastTx, null, 2)}
          </pre>
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
                <div>Active: <b>{String(s.active)}</b></div>
                <Button
                  onClick={() => onCreateVault(s.strategyId)}
                  disabled={loading || !s.active}
                  style={{ marginTop: 8 }}
                >
                  {loading ? "Creating..." : "Create vault"}
                </Button>
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
