"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { listVaultsByOwner } from "@/application/vault/api/listVaultsByOwner.usecase";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

export default function VaultsPage() {
  const { ready, authenticated, login } = usePrivy();
  const { ownerAddr, ensureWallet, activeWallet } = useOwnerAddress();

  const [vaults, setVaults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function refresh() {
    setErr("");
    if (!ownerAddr) return;
    setLoading(true);
    try {
      setVaults(await listVaultsByOwner(ownerAddr));
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) return;
    (async () => {
      await ensureWallet();
      await refresh();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated, ownerAddr]);

  if (!ready) return <div style={{ padding: 24 }}>Loading...</div>;

  if (!authenticated) {
    return (
      <main style={{ padding: 24, maxWidth: 900 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>My Vaults</h1>
        <Button onClick={login}>Login to view</Button>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>My Vaults</h1>

      <div style={{ marginTop: 8, opacity: 0.85 }}>
        Owner: <b>{ownerAddr || "-"}</b>{" "}
        <span style={{ opacity: 0.75 }}>({activeWallet?.walletClientType || "unknown"})</span>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button onClick={refresh} disabled={loading || !ownerAddr}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {err ? <div style={{ marginTop: 12, color: "crimson" }}>{err}</div> : null}

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {vaults.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No vaults yet.</div>
        ) : (
          vaults.map((v) => (
            <Link key={v} href={`/vaults/${v}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Card style={{ fontFamily: "monospace", cursor: "pointer" }}>{v}</Card>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
