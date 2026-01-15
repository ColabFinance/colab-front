"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { Input } from "@/shared/ui/Input";
import { useToast } from "@/shared/ui/toast/useToast";

import { useAuthToken } from "@/hooks/useAuthToken";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { useIsAdmin } from "@/hooks/useIsAdmin";

import { createStrategyRegistryUseCase } from "@/application/admin/createStrategyRegistry.usecase";
import { createVaultFactoryUseCase } from "@/application/admin/createVaultFactory.usecase";
import { listOwnersUseCase } from "@/application/admin/listOwners.usecase";
import { listUsersUseCase } from "@/application/admin/listUsers.usecase";

import { createAdapterUseCase } from "@/application/admin/createAdapter.usecase";
import { listAdaptersUseCase } from "@/application/admin/listAdapters.usecase";

import { listStrategiesOnchain } from "@/application/strategy/listStrategies.usecase";
import { listVaultsByOwner } from "@/application/vault/api/listVaultsByOwner.usecase";

import { getActiveChainRuntime } from "@/shared/config/chainRuntime";
import { useActiveWallet } from "@/hooks/useActiveWallet";
import { allowStrategyAdapterUseCase } from "@/application/admin/allowStrategyAdapter.usecase";
import { allowStrategyRouterUseCase } from "@/application/admin/allowStrategyRouter.usecase";

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export default function AdminPage() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { ownerAddr } = useOwnerAddress();
  const { activeWallet } = useActiveWallet();
  const { token, ensureTokenOrLogin } = useAuthToken();
  const { isAdmin } = useIsAdmin();
  const { push } = useToast();

  const [busy, setBusy] = useState<string>("");
  const [strategiesJson, setStrategiesJson] = useState<any>(null);
  const [vaultsJson, setVaultsJson] = useState<any>(null);
  const [ownersJson, setOwnersJson] = useState<any>(null);
  const [usersJson, setUsersJson] = useState<any>(null);

  const [strategyRegistryAddr, setStrategyRegistryAddr] = useState<string>("");
  const [executorAddr, setExecutorAddr] = useState<string>("");

  const [feeCollector, setFeeCollector] = useState<string>("0x0000000000000000000000000000000000000000");
  const [cooldownSec, setCooldownSec] = useState<number>(300);
  const [maxSlippageBps, setMaxSlippageBps] = useState<number>(50);
  const [allowSwap, setAllowSwap] = useState<boolean>(true);
  const [adaptersJson, setAdaptersJson] = useState<any>(null);

  const [adapterForm, setAdapterForm] = useState({
    dex: "pancake_v3",
    pool: "",
    nfpm: "",
    gauge: "0x0000000000000000000000000000000000000000",
    token0: "",
    token1: "",
    pool_name: "WETH/USDC",
    fee_bps: "300",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [allowAdapterAddr, setAllowAdapterAddr] = useState<string>("");
  const [allowRouterAddr, setAllowRouterAddr] = useState<string>("");

  const sessionLabel = useMemo(() => {
    return {
      ready,
      authenticated,
      owner: ownerAddr ? shortAddr(ownerAddr) : "-",
      isAdmin,
    };
  }, [ready, authenticated, ownerAddr, isAdmin]);

  if (!ready) return <div style={{ padding: 24 }}>Loading...</div>;

  // Hard guard: must be authenticated
  if (!authenticated) {
    return (
      <main style={{ padding: 24, maxWidth: 980 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>Admin</h1>
        <Card>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Login required</div>
          <div style={{ opacity: 0.85 }}>
            This area is restricted. Please authenticate to continue.
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button onClick={() => login()}>Login</Button>
            <Link href="/">
              <Button variant="ghost">Go back</Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  // Authorization guard: must be allowlisted
  if (!isAdmin) {
    return (
      <main style={{ padding: 24, maxWidth: 980 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>Admin</h1>
        <Card>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Not authorized</div>
          <div style={{ opacity: 0.85 }}>
            Your wallet is not allowlisted to access this page.
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button variant="ghost" onClick={() => logout()}>
              Logout
            </Button>
            <Link href="/">
              <Button variant="ghost">Go back</Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  async function runAction(name: string, fn: (accessToken: string) => Promise<any>) {
    setBusy(name);
    try {
      const t = token || (await ensureTokenOrLogin());
      if (!t) throw new Error("Missing access token.");
      const out = await fn(t);
      push({ title: "Success", description: name });
      return out;
    } catch (e: any) {
      push({ title: "Error", description: e?.message || String(e) });
      throw e;
    } finally {
      setBusy("");
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 980 }}>
      <h1 style={{ fontSize: 22, fontWeight: 900 }}>Admin</h1>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Session</div>
          <div>
            <b>Authenticated:</b> {String(sessionLabel.authenticated)}
          </div>
          <div>
            <b>Wallet:</b> {sessionLabel.owner}
          </div>
          <div>
            <b>Is admin:</b> {String(sessionLabel.isAdmin)}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button variant="ghost" onClick={() => logout()}>
              Logout
            </Button>
          </div>

          <div style={{ marginTop: 10, opacity: 0.75 }}>
            Security note: this UI guard is convenience-only. api-lp must enforce the same rules server-side.
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Factories</div>

          <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>StrategyRegistry (for VaultFactory)</div>
                <input
                  value={strategyRegistryAddr}
                  onChange={(e) => setStrategyRegistryAddr(e.target.value)}
                  placeholder="0x..."
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>

              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Executor (bot)</div>
                <input
                  value={executorAddr}
                  onChange={(e) => setExecutorAddr(e.target.value)}
                  placeholder="0x..."
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Cooldown (sec)</div>
                <input
                  type="number"
                  value={cooldownSec}
                  onChange={(e) => setCooldownSec(Number(e.target.value))}
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>

              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Max slippage (bps)</div>
                <input
                  type="number"
                  value={maxSlippageBps}
                  onChange={(e) => setMaxSlippageBps(Number(e.target.value))}
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>

              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Allow swap</div>
                <label style={{ display: "flex", gap: 8, alignItems: "center", padding: 10 }}>
                  <input
                    type="checkbox"
                    checked={allowSwap}
                    onChange={(e) => setAllowSwap(e.target.checked)}
                  />
                  <span style={{ opacity: 0.9 }}>{String(allowSwap)}</span>
                </label>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Fee collector (optional)</div>
              <input
                value={feeCollector}
                onChange={(e) => setFeeCollector(e.target.value)}
                placeholder="0x0000..."
                style={{ width: "100%", padding: 10, borderRadius: 10 }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              disabled={!!busy}
              onClick={async () => {
                const res = await runAction("Create Strategy Factory", async (t) =>
                  createStrategyRegistryUseCase({
                    accessToken: t,
                    body: { chain: (await getActiveChainRuntime()).chainKey, initial_owner: ownerAddr, gas_strategy: "buffered" },
                  })
                );
                push({ title: "Result", description: res?.message || "OK" });
              }}
            >
              {busy === "Create Strategy Factory" ? "Working..." : "Create Strategy Factory"}
            </Button>

            <Button
              disabled={!!busy}
              onClick={async () => {
                const res = await runAction("Create Vault Factory", async (t) =>
                  createVaultFactoryUseCase({
                    accessToken: t,
                    body: {
                      chain: (await getActiveChainRuntime()).chainKey,
                      initial_owner: ownerAddr,
                      strategy_registry: strategyRegistryAddr,
                      executor: executorAddr,
                      fee_collector: feeCollector,
                      default_cooldown_sec: cooldownSec,
                      default_max_slippage_bps: maxSlippageBps,
                      default_allow_swap: allowSwap,
                      gas_strategy: "buffered",
                    },
                  })
                );
                push({ title: "Result", description: res?.message || "OK" });
              }}
            >
              {busy === "Create Vault Factory" ? "Working..." : "Create Vault Factory"}
            </Button>
          </div>

          <div style={{ marginTop: 10, opacity: 0.8 }}>
            Factories are persisted via api-lp (MongoDB). The backend must:
            (1) keep a single active factory, (2) block creation if an active one exists,
            (3) allow creation only when the existing factory is in a status that enables replacement.
          </div>
        </Card>
        
        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Adapters</div>

          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input
                label="DEX"
                placeholder="pancake_v3"
                value={adapterForm.dex}
                onChange={(e) => setAdapterForm((s) => ({ ...s, dex: e.target.value }))}
              />
              <Input
                label="Status"
                placeholder="ACTIVE"
                value={adapterForm.status}
                onChange={(e) =>
                  setAdapterForm((s) => ({
                    ...s,
                    status: (e.target.value || "ACTIVE").toUpperCase() as any,
                  }))
                }
              />
            </div>

            <Input
              label="Pool (constructor param)"
              placeholder="Pool address 0x..."
              value={adapterForm.pool}
              onChange={(e) => setAdapterForm((s) => ({ ...s, pool: e.target.value }))}
            />

            <Input
              label="NFPM (constructor param)"
              placeholder="NonfungiblePositionManager 0x..."
              value={adapterForm.nfpm}
              onChange={(e) => setAdapterForm((s) => ({ ...s, nfpm: e.target.value }))}
            />

            <Input
              label="Gauge (constructor param, can be zero)"
              placeholder="MasterChef/Gauge 0x0000... allowed"
              value={adapterForm.gauge}
              onChange={(e) => setAdapterForm((s) => ({ ...s, gauge: e.target.value }))}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Input
                label="Token0"
                placeholder="Token0 0x..."
                value={adapterForm.token0}
                onChange={(e) => setAdapterForm((s) => ({ ...s, token0: e.target.value }))}
              />
              <Input
                label="Token1"
                placeholder="Token1 0x..."
                value={adapterForm.token1}
                onChange={(e) => setAdapterForm((s) => ({ ...s, token1: e.target.value }))}
              />
            </div>

            <Input
              label="Pool name"
              placeholder="WETH/USDC"
              value={adapterForm.pool_name}
              onChange={(e) => setAdapterForm((s) => ({ ...s, pool_name: e.target.value }))}
            />

            <Input
              label="Fee (bps as string)"
              placeholder="Fee bps 300"
              value={adapterForm.fee_bps}
              onChange={(e) => setAdapterForm((s) => ({ ...s, fee_bps: e.target.value }))}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button
                disabled={!!busy}
                onClick={async () => {
                  const payload = {
                    chain: (await getActiveChainRuntime()).chainKey,
                    gas_strategy: "buffered",
                    dex: adapterForm.dex.trim(),
                    pool: adapterForm.pool.trim(),
                    nfpm: adapterForm.nfpm.trim(),
                    gauge: adapterForm.gauge.trim(),
                    token0: adapterForm.token0.trim(),
                    token1: adapterForm.token1.trim(),
                    pool_name: adapterForm.pool_name.trim(),
                    fee_bps: adapterForm.fee_bps.trim(), // string
                    status: adapterForm.status,
                  };

                  const res = await runAction("Create Adapter", (t) =>
                    createAdapterUseCase({ accessToken: t, payload })
                  );

                  push({ title: "Result", description: res?.message || "OK" });
                }}
              >
                {busy === "Create Adapter" ? "Working..." : "Create Adapter"}
              </Button>

              <Button
                variant="ghost"
                disabled={!!busy}
                onClick={async () => {
                  const res = await runAction("List Adapters", async (t) =>
                    listAdaptersUseCase({ accessToken: t, chain: (await getActiveChainRuntime()).chainKey })
                  );
                  setAdaptersJson(res);
                }}
              >
                {busy === "List Adapters" ? "Loading..." : "List Adapters"}
              </Button>
            </div>

            <div style={{ marginTop: 10, opacity: 0.75 }}>
              Rule: cannot create if a record already exists for the same (dex, pool).{" "}
              pool/nfpm must be non-zero addresses. gauge may be zero.
              fee_bps must be a numeric string (e.g. "100", "300").
            </div>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Adapters</div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.9 }}>
                {adaptersJson ? JSON.stringify(adaptersJson, null, 2) : "—"}
              </pre>
            </Card>
          </div>
        </Card>


        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Lists</div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              disabled={!!busy}
              onClick={async () => {
                const res = await runAction("List Strategies", async () => {
                  // Onchain read or api-lp – reusing your existing usecase
                  return listStrategiesOnchain();
                });
                setStrategiesJson(res);
              }}
            >
              {busy === "List Strategies" ? "Loading..." : "List Strategies"}
            </Button>

            <Button
              disabled={!!busy}
              onClick={async () => {
                const addr = ownerAddr || "";
                if (!addr) throw new Error("Missing owner address.");
                const res = await runAction("List Vaults", async () => listVaultsByOwner(addr));
                setVaultsJson(res);
              }}
            >
              {busy === "List Vaults" ? "Loading..." : "List Vaults (by owner)"}
            </Button>

            <Button
              disabled={!!busy}
              onClick={async () => {
                const res = await runAction("List Owners", (t) => listOwnersUseCase({ accessToken: t }));
                setOwnersJson(res);
              }}
            >
              {busy === "List Owners" ? "Loading..." : "List Owners"}
            </Button>

            <Button
              disabled={!!busy}
              onClick={async () => {
                const res = await runAction("List Users", (t) => listUsersUseCase({ accessToken: t }));
                setUsersJson(res);
              }}
            >
              {busy === "List Users" ? "Loading..." : "List Users"}
            </Button>
          </div>

          <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Strategies</div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.9 }}>
                {strategiesJson ? JSON.stringify(strategiesJson, null, 2) : "—"}
              </pre>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Vaults</div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.9 }}>
                {vaultsJson ? JSON.stringify(vaultsJson, null, 2) : "—"}
              </pre>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Owners</div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.9 }}>
                {ownersJson ? JSON.stringify(ownersJson, null, 2) : "—"}
              </pre>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Users</div>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.9 }}>
                {usersJson ? JSON.stringify(usersJson, null, 2) : "—"}
              </pre>
            </Card>
          </div>

          <div style={{ marginTop: 10, opacity: 0.75 }}>
            Note: Global vault/strategy listing should ultimately be served by api-lp for consistency.
            The current "vaults by owner" is reused as a temporary admin read.
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>StrategyRegistry Allowlist (on-chain)</div>

          <div style={{ display: "grid", gap: 10 }}>
            <Input
              label="Adapter address"
              placeholder="0x..."
              value={allowAdapterAddr}
              onChange={(e) => setAllowAdapterAddr(e.target.value)}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button
                disabled={!!busy}
                onClick={async () => {
                  if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                  const res = await runAction("Allow Adapter", async () =>
                    allowStrategyAdapterUseCase({
                      activeWallet,
                      adapter: allowAdapterAddr,
                      allowed: true,
                    })
                  );
                  push({ title: "Adapter allowlisted", description: res?.txHash || "tx sent" });
                }}
              >
                {busy === "Allow Adapter" ? "Working..." : "Allow adapter"}
              </Button>

              <Button
                variant="ghost"
                disabled={!!busy}
                onClick={async () => {
                  if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                  const res = await runAction("Disallow Adapter", async () =>
                    allowStrategyAdapterUseCase({
                      activeWallet,
                      adapter: allowAdapterAddr,
                      allowed: false,
                    })
                  );
                  push({ title: "Adapter disallowed", description: res?.txHash || "tx sent" });
                }}
              >
                {busy === "Disallow Adapter" ? "Working..." : "Disallow adapter"}
              </Button>
            </div>

            <Input
              label="Router address"
              placeholder="0x..."
              value={allowRouterAddr}
              onChange={(e) => setAllowRouterAddr(e.target.value)}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button
                disabled={!!busy}
                onClick={async () => {
                  if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                  const res = await runAction("Allow Router", async () =>
                    allowStrategyRouterUseCase({
                      activeWallet,
                      router: allowRouterAddr,
                      allowed: true,
                    })
                  );
                  push({ title: "Router allowlisted", description: res?.txHash || "tx sent" });
                }}
              >
                {busy === "Allow Router" ? "Working..." : "Allow router"}
              </Button>

              <Button
                variant="ghost"
                disabled={!!busy}
                onClick={async () => {
                  if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                  const res = await runAction("Disallow Router", async () =>
                    allowStrategyRouterUseCase({
                      activeWallet,
                      router: allowRouterAddr,
                      allowed: false,
                    })
                  );
                  push({ title: "Router disallowed", description: res?.txHash || "tx sent" });
                }}
              >
                {busy === "Disallow Router" ? "Working..." : "Disallow router"}
              </Button>
            </div>

            <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>
              Note: these functions are <b>onlyOwner</b>. The connected admin wallet must be the StrategyRegistry owner (or
              the multisig owner) to succeed.
            </div>
          </div>
        </Card>


      </div>
    </main>
  );
}
