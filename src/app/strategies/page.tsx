"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

import { listStrategiesOnchain } from "@/application/strategy/listStrategies.usecase";
import { registerStrategyOnchain } from "@/application/strategy/registerStrategy.usecase";
import { getStrategyParamsUseCase } from "@/application/strategy/getStrategyParams.usecase";
import { upsertStrategyParamsUseCase } from "@/application/strategy/upsertStrategyParams.usecase";

import { createVault } from "@/application/vault/api/createVault.usecase";
import { Strategy } from "@/domain/strategy/types";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { useAuthToken } from "@/hooks/useAuthToken";
import { useToast } from "@/shared/ui/toast/useToast";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { useActiveWallet } from "@/hooks/useActiveWallet";

function safeJsonParse(raw: string): { ok: true; value: any } | { ok: false; error: string } {
  try {
    const v = JSON.parse(raw || "{}");
    if (v === null || typeof v !== "object" || Array.isArray(v)) {
      return { ok: false, error: "params must be a JSON object" };
    }
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

  // --- params modal state ---
  const [paramsOpen, setParamsOpen] = useState(false);
  const [paramsStrategyId, setParamsStrategyId] = useState<number | null>(null);
  const [paramsRaw, setParamsRaw] = useState<string>("{}");
  const [paramsLoading, setParamsLoading] = useState(false);

  const chainKey = useMemo<"base">(() => "base", []); // ajuste se você já tem chain runtime

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      if (!ownerAddr) {
        setStrategies([]);
        setErr("Connect with an wallet to continue.");
        return;
      }
      setStrategies(await listStrategiesOnchain(ownerAddr));
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
        setErr("Ainda sem wallet. Faça login novamente ou link MetaMask.");
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

      const res = await registerStrategyOnchain({
        activeWallet,
        payload: {
          adapter: cAdapter.trim(),
          dexRouter: cRouter.trim(),
          token0: cToken0.trim(),
          token1: cToken1.trim(),
          name: cName.trim(),
          description: cDesc.trim(),
        },
      });

      setLastTx(res);
      push({ title: "Strategy created on-chain", description: res?.txHash || "tx sent" });

      setCreateOpen(false);
      setCAdapter("");
      setCRouter("");
      setCToken0("");
      setCToken1("");
      setCName("");
      setCDesc("");

      await refresh();
    } catch (e: any) {
      setErr(e?.message || String(e));
      push({ title: "Create strategy failed", description: e?.message || String(e) });
    } finally {
      setLoading(false);
    }
  }

  async function onOpenParams(strategyId: number) {
    setErr("");
    setParamsStrategyId(strategyId);
    setParamsRaw("{}");
    setParamsOpen(true);

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

      if (res?.ok && res?.data?.params) {
        setParamsRaw(JSON.stringify(res.data.params, null, 2));
      } else {
        // first time -> empty object
        setParamsRaw("{}");
      }
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

      const parsed = safeJsonParse(paramsRaw);
      if (!parsed.ok) {
        setErr(parsed.error);
        return;
      }

      setParamsLoading(true);
      const token = await ensureTokenOrLogin();
      if (!token) {
        setErr("Missing access token. Please login again.");
        return;
      }

      const res = await upsertStrategyParamsUseCase({
        accessToken: token,
        payload: {
          chain: chainKey,
          owner: ownerAddr,
          strategy_id: paramsStrategyId,
          params: parsed.value,
        },
      });

      push({ title: "Params saved", description: res?.message || "ok" });
      setParamsOpen(false);
      setParamsStrategyId(null);
    } catch (e: any) {
      setErr(e?.message || String(e));
      push({ title: "Save params failed", description: e?.message || String(e) });
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
            <Input placeholder="adapter (0x...)" value={cAdapter} onChange={(e) => setCAdapter(e.target.value)} />
            <Input placeholder="dexRouter (0x...)" value={cRouter} onChange={(e) => setCRouter(e.target.value)} />
            <Input placeholder="token0 (0x...)" value={cToken0} onChange={(e) => setCToken0(e.target.value)} />
            <Input placeholder="token1 (0x...)" value={cToken1} onChange={(e) => setCToken1(e.target.value)} />
            <Input placeholder="name" value={cName} onChange={(e) => setCName(e.target.value)} />
            <Input placeholder="description" value={cDesc} onChange={(e) => setCDesc(e.target.value)} />

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

      {/* Params modal */}
      {paramsOpen ? (
        <Card style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontWeight: 800 }}>
              Strategy params (Mongo) — #{paramsStrategyId ?? "-"}
            </div>
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

          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Put your off-chain config here. Must be a JSON object.
            </div>

            <textarea
              value={paramsRaw}
              onChange={(e) => setParamsRaw(e.target.value)}
              style={{
                marginTop: 8,
                width: "100%",
                minHeight: 220,
                fontFamily: "monospace",
                fontSize: 13,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #eee",
              }}
              disabled={paramsLoading}
            />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
              <Button onClick={onSaveParams} disabled={paramsLoading}>
                {paramsLoading ? "Saving..." : "Save params"}
              </Button>
            </div>
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

                  <Button onClick={() => onCreateVault(s.strategyId)} disabled={loading || !s.active}>
                    {loading ? "Creating..." : "Create vault"}
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
