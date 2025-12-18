"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { listVaultsByOwner } from "@/application/vault/listVaultsByOwner.usecase";

export default function VaultsPage() {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();

  const [vaults, setVaults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const activeWallet = useMemo(() => {
    const embedded = wallets.find((w) => w.walletClientType === "privy");
    return embedded ?? wallets[0];
  }, [wallets]);

  const ownerAddr = activeWallet?.address;

  async function refresh() {
    setErr("");
    if (!ownerAddr) return;
    setLoading(true);
    try {
      const v = await listVaultsByOwner(ownerAddr);
      setVaults(v);
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    if (!ownerAddr) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ownerAddr]);

  if (!ready) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>My Vaults</h1>

      {!authenticated ? (
        <button style={btn} onClick={login}>
          Login to view
        </button>
      ) : (
        <>
          <div style={{ marginTop: 8 }}>
            Owner: <b>{ownerAddr || "-"}</b>
          </div>

          <div style={{ marginTop: 12 }}>
            <button style={btn} onClick={refresh} disabled={loading || !ownerAddr}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {err ? <div style={{ marginTop: 12, color: "crimson" }}>{err}</div> : null}

          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            {vaults.length === 0 ? (
              <div style={{ opacity: 0.8 }}>No vaults yet.</div>
            ) : (
              vaults.map((v) => (
                <div key={v} style={card}>
                  {v}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </main>
  );
}

const btn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
};

const card: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #eee",
  fontFamily: "monospace",
};
