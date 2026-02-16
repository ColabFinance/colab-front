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

import { createStrategyRegistryUseCase } from "@/application/admin/api/createStrategyRegistry.usecase";
import { createVaultFactoryUseCase } from "@/application/admin/api/createVaultFactory.usecase";
import { listOwnersUseCase } from "@/application/admin/api/listOwners.usecase";
import { listUsersUseCase } from "@/application/admin/api/listUsers.usecase";

import { createAdapterUseCase } from "@/application/admin/api/createAdapter.usecase";
import { listAdaptersUseCase } from "@/application/admin/api/listAdapters.usecase";

import { listStrategiesOnchain } from "@/application/strategy/onchain/listStrategies.usecase";
import { listVaultsByOwner } from "@/application/vault/onchain/listVaultsByOwner.usecase";

import { getActiveChainRuntime } from "@/shared/config/chainRuntime";
import { useActiveWallet } from "@/hooks/useActiveWallet";
import { allowStrategyAdapterUseCase } from "@/application/admin/onchain/allowStrategyAdapter.usecase";
import { allowStrategyRouterUseCase } from "@/application/admin/onchain/allowStrategyRouter.usecase";
import { listDexesUseCase } from "@/application/admin/api/listDexes.usecase";
import { createDexPoolUseCase } from "@/application/admin/api/createDexPool.usecase";
import { listDexPoolsUseCase } from "@/application/admin/api/listDexPools.usecase";
import { createDexUseCase } from "@/application/admin/api/createDex.usecase";
import { createProtocolFeeCollectorUseCase } from "@/application/admin/api/createProtocolFeeCollector.usecase";
import { createVaultFeeBufferUseCase } from "@/application/admin/api/createVaultFeeBuffer.usecase";
import { setProtocolFeeCollectorTreasuryUseCase } from "@/application/admin/onchain/setProtocolFeeCollectorTreasury.usecase";
import { setProtocolFeeCollectorFeeBpsUseCase } from "@/application/admin/onchain/setProtocolFeeCollectorFeeBps.usecase";
import { allowProtocolFeeCollectorReporterUseCase } from "@/application/admin/onchain/allowProtocolFeeCollectorReporter.usecase";
import { allowVaultFeeBufferDepositorUseCase } from "@/application/admin/onchain/allowVaultFeeBufferDepositor.usecase";
import { setVaultFactoryExecutorUseCase } from "@/application/admin/onchain/setVaultFactoryExecutor.usecase";
import { setVaultFactoryFeeCollectorUseCase } from "@/application/admin/onchain/setVaultFactoryFeeCollector.usecase";
import { setVaultFactoryDefaultsUseCase } from "@/application/admin/onchain/setVaultFactoryDefaults.usecase";
import { withdrawProtocolFeeCollectorFeesUseCase } from "@/application/admin/onchain/withdrawProtocolFeeCollectorFees.usecase";
import { formatUnits, parseUnits } from "ethers";
import { getProtocolFeeCollectorTokenInfoUseCase } from "@/application/admin/onchain/getProtocolFeeCollectorTokenInfo.usecase";

const codeBlockStyle: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.90)",
  overflow: "auto",
  maxHeight: 520,
  fontSize: 12,
  lineHeight: 1.35,
};

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

type GasStrategy = "default" | "buffered" | "aggressive";

export default function AdminPage() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { ownerAddr } = useOwnerAddress();
  const { activeWallet } = useActiveWallet();
  const { token, ensureTokenOrLogin } = useAuthToken();
  const { isAdmin } = useIsAdmin();
  const { push } = useToast();

  const [gasStrategy, setGasStrategy] = useState<GasStrategy>("default");

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
    fee_buffer: "",
    token0: "",
    token1: "",
    pool_name: "WETH/USDC",
    fee_bps: "300",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [allowAdapterAddr, setAllowAdapterAddr] = useState<string>("");
  const [allowRouterAddr, setAllowRouterAddr] = useState<string>("");

  const [dexForm, setDexForm] = useState({
    dex: "pancake_v3",
    dex_router: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });
  const [dexesJson, setDexesJson] = useState<any>(null);

  const [poolForm, setPoolForm] = useState({
    dex: "pancake_v3",
    pool: "",
    nfpm: "",
    gauge: "0x0000000000000000000000000000000000000000",
    token0: "",
    token1: "",
    pair: "WETH-USDC",
    symbol: "ETHUSDT",
    fee_bps: 300,
    adapter: "",
    reward_token: "0x0000000000000000000000000000000000000000",
    reward_swap_pool: "0x0000000000000000000000000000000000000000",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });
  const [poolsJson, setPoolsJson] = useState<any>(null);

  const [prefillDex, setPrefillDex] = useState<string>("pancake_v3");
  const [prefillPools, setPrefillPools] = useState<any[]>([]);
  const [prefillPoolAddr, setPrefillPoolAddr] = useState<string>("");

  const [pfcOwner, setPfcOwner] = useState<string>("");
  const [pfcTreasury, setPfcTreasury] = useState<string>("");
  const [pfcFeeBps, setPfcFeeBps] = useState<number>(1000);

  const [vfbOwner, setVfbOwner] = useState<string>("");

  const [pfcReporterAddr, setPfcReporterAddr] = useState<string>("");
  const [vfbDepositorAddr, setVfbDepositorAddr] = useState<string>("");

  const [pfcTokenAddr, setPfcTokenAddr] = useState<string>("");
  const [pfcTokenInfo, setPfcTokenInfo] = useState<any>(null);

  const [pfcWithdrawTo, setPfcWithdrawTo] = useState<string>("");
  const [pfcWithdrawAmount, setPfcWithdrawAmount] = useState<string>(""); // human units

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
            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
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

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
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
                    body: { chain: (await getActiveChainRuntime()).chainKey, initial_owner: ownerAddr, gas_strategy: gasStrategy },
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
                      gas_strategy: gasStrategy,
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
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Protocol Fee Collector</div>

          <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Initial owner (optional)</div>
                <input
                  value={pfcOwner}
                  onChange={(e) => setPfcOwner(e.target.value)}
                  placeholder="0x... (leave empty to use your admin wallet)"
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>

              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Treasury</div>
                <input
                  value={pfcTreasury}
                  onChange={(e) => setPfcTreasury(e.target.value)}
                  placeholder="0x... (multisig/treasury)"
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Protocol fee (bps)</div>
                <input
                  type="number"
                  value={pfcFeeBps}
                  onChange={(e) => setPfcFeeBps(Number(e.target.value))}
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>

              <div style={{ opacity: 0.75, fontSize: 13, paddingTop: 22 }}>
                Stored as reference on-chain (max 5000 bps).
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              disabled={!!busy}
              onClick={async () => {
                const chain = (await getActiveChainRuntime()).chainKey as any;
                const res = await runAction("Create Protocol Fee Collector", async (t) =>
                  createProtocolFeeCollectorUseCase({
                    accessToken: t,
                    body: {
                      chain,
                      gas_strategy: gasStrategy,
                      initial_owner: (pfcOwner || ownerAddr || "").trim(),
                      treasury: (pfcTreasury || "").trim(),
                      protocol_fee_bps: Number(pfcFeeBps),
                    },
                  })
                );
                push({ title: "Result", description: res?.message || "OK" });
              }}
            >
              {busy === "Create Protocol Fee Collector" ? "Working..." : "Create Protocol Fee Collector"}
            </Button>
          </div>

          <div style={{ marginTop: 10, opacity: 0.8 }}>
            Backend rule should match factories: keep a single ACTIVE record per chain, and block creation unless the latest
            record is ARCHIVED_CAN_CREATE_NEW (or none exists).
          </div>
        </Card>
        
                <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Protocol Fees (balances & withdraw)</div>

          <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Token address</div>
                <input
                  value={pfcTokenAddr}
                  onChange={(e) => setPfcTokenAddr(e.target.value)}
                  placeholder="0x... (e.g. USDC)"
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>

              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Withdraw to</div>
                <input
                  value={pfcWithdrawTo}
                  onChange={(e) => setPfcWithdrawTo(e.target.value)}
                  placeholder={ownerAddr ? ownerAddr : "0x..."}
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Withdraw amount (human)</div>
                <input
                  value={pfcWithdrawAmount}
                  onChange={(e) => setPfcWithdrawAmount(e.target.value)}
                  placeholder="e.g. 12.34"
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>

              <div style={{ opacity: 0.8, fontSize: 13, paddingTop: 22 }}>
                Reads show: <b>ERC20.balanceOf(PFC)</b> and <b>PFC.totalByToken</b>.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              variant="ghost"
              disabled={!!busy}
              onClick={async () => {
                const res = await runAction("PFC: load token info", async () =>
                  getProtocolFeeCollectorTokenInfoUseCase({ token: (pfcTokenAddr || "").trim() })
                );
                setPfcTokenInfo(res);
              }}
            >
              {busy === "PFC: load token info" ? "Loading..." : "Load token balances"}
            </Button>

            <Button
              variant="ghost"
              disabled={!!busy || !pfcTokenInfo?.contractBalance}
              onClick={async () => {
                const dec = Number(pfcTokenInfo?.decimals ?? 18);
                const human = formatUnits(BigInt(pfcTokenInfo.contractBalance || "0"), dec);
                setPfcWithdrawAmount(human);
              }}
            >
              Use full balance
            </Button>

            <Button
              disabled={!!busy}
              onClick={async () => {
                if (!activeWallet) throw new Error("Missing activeWallet (Privy).");

                const to = (pfcWithdrawTo || ownerAddr || "").trim();
                if (!to) throw new Error("Missing withdraw recipient.");

                const token = (pfcTokenAddr || "").trim();
                if (!token) throw new Error("Missing token address.");

                const decimals = Number(pfcTokenInfo?.decimals ?? 18);
                const amountHuman = (pfcWithdrawAmount || "").trim();
                if (!amountHuman) throw new Error("Missing withdraw amount.");

                const amount = parseUnits(amountHuman, decimals);

                const res = await runAction("PFC: withdrawFees", async () =>
                  withdrawProtocolFeeCollectorFeesUseCase({
                    activeWallet,
                    token,
                    amount,
                    to,
                  })
                );

                push({ title: "Tx sent", description: res?.txHash || "ok" });
              }}
            >
              {busy === "PFC: withdrawFees" ? "Working..." : "Withdraw"}
            </Button>
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Token snapshot</div>

              {pfcTokenInfo ? (
                <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
                  <div><b>PFC:</b> {shortAddr(pfcTokenInfo?.pfc)}</div>
                  <div><b>Token:</b> {shortAddr(pfcTokenInfo?.token)} ({pfcTokenInfo?.symbol || "TOKEN"})</div>
                  <div>
                    <b>Contract balance:</b>{" "}
                    {formatUnits(BigInt(pfcTokenInfo?.contractBalance || "0"), Number(pfcTokenInfo?.decimals ?? 18))}
                  </div>
                  <div>
                    <b>TotalByToken:</b>{" "}
                    {formatUnits(BigInt(pfcTokenInfo?.totalByToken || "0"), Number(pfcTokenInfo?.decimals ?? 18))}
                  </div>

                  <pre style={{ ...codeBlockStyle, marginTop: 8 }}>
                    {JSON.stringify(pfcTokenInfo, null, 2)}
                  </pre>
                </div>
              ) : (
                <div style={{ opacity: 0.8 }}>—</div>
              )}
            </Card>

            <div style={{ opacity: 0.75, fontSize: 13 }}>
              Observação: <b>withdrawFees</b> é <b>onlyOwner</b> do ProtocolFeeCollector. A carteira admin conectada precisa ser o owner do PFC.
            </div>
          </div>
        </Card>

        
        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Vault Fee Buffer</div>

          <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Initial owner (optional)</div>
              <input
                value={vfbOwner}
                onChange={(e) => setVfbOwner(e.target.value)}
                placeholder="0x... (leave empty to use your admin wallet)"
                style={{ width: "100%", padding: 10, borderRadius: 10 }}
              />
            </div>

            <div style={{ opacity: 0.75, fontSize: 13 }}>
              VaultFeeBuffer isolates harvested fees/rewards from the vault idle balances.
              Deploy once per chain, then allowlist adapter contracts via <b>setDepositor</b> (on-chain).
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              disabled={!!busy}
              onClick={async () => {
                const chain = (await getActiveChainRuntime()).chainKey as any;
                const res = await runAction("Create Vault Fee Buffer", async (t) =>
                  createVaultFeeBufferUseCase({
                    accessToken: t,
                    body: {
                      chain,
                      gas_strategy: gasStrategy,
                      initial_owner: (vfbOwner || ownerAddr || "").trim(),
                    },
                  })
                );
                push({ title: "Result", description: res?.message || "OK" });
              }}
            >
              {busy === "Create Vault Fee Buffer" ? "Working..." : "Create Vault Fee Buffer"}
            </Button>
          </div>

          <div style={{ marginTop: 10, opacity: 0.8 }}>
            Backend rule matches PFC/factories: keep a single ACTIVE record per chain and block creation unless
            latest is ARCHIVED_CAN_CREATE_NEW (or none exists).
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>On-chain Sets (required)</div>

          <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 12 }}>
            These are <b>onlyOwner</b> calls. Your connected admin wallet must be the owner of the deployed contracts.
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>ProtocolFeeCollector</div>

              <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
                <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
                  <div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Treasury</div>
                    <input
                      value={pfcTreasury}
                      onChange={(e) => setPfcTreasury(e.target.value)}
                      placeholder="0x... (multisig/treasury)"
                      style={{ width: "100%", padding: 10, borderRadius: 10 }}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Protocol fee (bps)</div>
                    <input
                      type="number"
                      value={pfcFeeBps}
                      onChange={(e) => setPfcFeeBps(Number(e.target.value))}
                      style={{ width: "100%", padding: 10, borderRadius: 10 }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
                    Reporter (adapter address)
                  </div>
                  <input
                    value={pfcReporterAddr}
                    onChange={(e) => setPfcReporterAddr(e.target.value)}
                    placeholder="0x... (adapter that calls reportFees)"
                    style={{ width: "100%", padding: 10, borderRadius: 10 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
                  disabled={!!busy}
                  onClick={async () => {
                    if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                    const res = await runAction("PFC: setTreasury", async () =>
                      setProtocolFeeCollectorTreasuryUseCase({
                        activeWallet,
                        treasury: (pfcTreasury || "").trim(),
                      })
                    );
                    push({ title: "Tx sent", description: res?.txHash || "ok" });
                  }}
                >
                  {busy === "PFC: setTreasury" ? "Working..." : "PFC: setTreasury"}
                </Button>

                <Button
                  disabled={!!busy}
                  onClick={async () => {
                    if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                    const res = await runAction("PFC: setProtocolFeeBps", async () =>
                      setProtocolFeeCollectorFeeBpsUseCase({
                        activeWallet,
                        feeBps: Number(pfcFeeBps),
                      })
                    );
                    push({ title: "Tx sent", description: res?.txHash || "ok" });
                  }}
                >
                  {busy === "PFC: setProtocolFeeBps" ? "Working..." : "PFC: setProtocolFeeBps"}
                </Button>

                <Button
                  disabled={!!busy}
                  onClick={async () => {
                    if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                    const res = await runAction("PFC: allow reporter", async () =>
                      allowProtocolFeeCollectorReporterUseCase({
                        activeWallet,
                        reporter: (pfcReporterAddr || "").trim(),
                        allowed: true,
                      })
                    );
                    push({ title: "Tx sent", description: res?.txHash || "ok" });
                  }}
                >
                  {busy === "PFC: allow reporter" ? "Working..." : "PFC: allow reporter"}
                </Button>

                <Button
                  variant="ghost"
                  disabled={!!busy}
                  onClick={async () => {
                    if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                    const res = await runAction("PFC: disallow reporter", async () =>
                      allowProtocolFeeCollectorReporterUseCase({
                        activeWallet,
                        reporter: (pfcReporterAddr || "").trim(),
                        allowed: false,
                      })
                    );
                    push({ title: "Tx sent", description: res?.txHash || "ok" });
                  }}
                >
                  {busy === "PFC: disallow reporter" ? "Working..." : "PFC: disallow reporter"}
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75, fontSize: 13 }}>
                If the adapter is not allowlisted as reporter, <b>reportFees</b> can fail and your adapter may
                proceed fail-open (no protocol fee collected).
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>VaultFeeBuffer</div>

              <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
                    Depositor (adapter address)
                  </div>
                  <input
                    value={vfbDepositorAddr}
                    onChange={(e) => setVfbDepositorAddr(e.target.value)}
                    placeholder="0x... (adapter that calls depositFor)"
                    style={{ width: "100%", padding: 10, borderRadius: 10 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
                  disabled={!!busy}
                  onClick={async () => {
                    if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                    const res = await runAction("VFB: allow depositor", async () =>
                      allowVaultFeeBufferDepositorUseCase({
                        activeWallet,
                        depositor: (vfbDepositorAddr || "").trim(),
                        allowed: true,
                      })
                    );
                    push({ title: "Tx sent", description: res?.txHash || "ok" });
                  }}
                >
                  {busy === "VFB: allow depositor" ? "Working..." : "VFB: allow depositor"}
                </Button>

                <Button
                  variant="ghost"
                  disabled={!!busy}
                  onClick={async () => {
                    if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                    const res = await runAction("VFB: disallow depositor", async () =>
                      allowVaultFeeBufferDepositorUseCase({
                        activeWallet,
                        depositor: (vfbDepositorAddr || "").trim(),
                        allowed: false,
                      })
                    );
                    push({ title: "Tx sent", description: res?.txHash || "ok" });
                  }}
                >
                  {busy === "VFB: disallow depositor" ? "Working..." : "VFB: disallow depositor"}
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75, fontSize: 13 }}>
                If the adapter is not allowlisted as depositor, <b>depositFor</b> reverts with:
                <code style={{ marginLeft: 6 }}>VaultFeeBuffer: depositor not allowed</code>
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>VaultFactory</div>

              <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Executor (bot)</div>
                  <input
                    value={executorAddr}
                    onChange={(e) => setExecutorAddr(e.target.value)}
                    placeholder="0x..."
                    style={{ width: "100%", padding: 10, borderRadius: 10 }}
                  />
                </div>

                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
                    Fee collector (ProtocolFeeCollector)
                  </div>
                  <input
                    value={feeCollector}
                    onChange={(e) => setFeeCollector(e.target.value)}
                    placeholder="0x... (can be 0x0 to disable)"
                    style={{ width: "100%", padding: 10, borderRadius: 10 }}
                  />
                </div>

                <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                  <div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Default cooldown (sec)</div>
                    <input
                      type="number"
                      value={cooldownSec}
                      onChange={(e) => setCooldownSec(Number(e.target.value))}
                      style={{ width: "100%", padding: 10, borderRadius: 10 }}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Default max slippage (bps)</div>
                    <input
                      type="number"
                      value={maxSlippageBps}
                      onChange={(e) => setMaxSlippageBps(Number(e.target.value))}
                      style={{ width: "100%", padding: 10, borderRadius: 10 }}
                    />
                  </div>

                  <div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Default allow swap</div>
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
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button
                  disabled={!!busy}
                  onClick={async () => {
                    if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                    const res = await runAction("VF: setExecutor", async () =>
                      setVaultFactoryExecutorUseCase({
                        activeWallet,
                        executor: (executorAddr || "").trim(),
                      })
                    );
                    push({ title: "Tx sent", description: res?.txHash || "ok" });
                  }}
                >
                  {busy === "VF: setExecutor" ? "Working..." : "VF: setExecutor"}
                </Button>

                <Button
                  disabled={!!busy}
                  onClick={async () => {
                    if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                    const res = await runAction("VF: setFeeCollector", async () =>
                      setVaultFactoryFeeCollectorUseCase({
                        activeWallet,
                        feeCollector: (feeCollector || "").trim(),
                      })
                    );
                    push({ title: "Tx sent", description: res?.txHash || "ok" });
                  }}
                >
                  {busy === "VF: setFeeCollector" ? "Working..." : "VF: setFeeCollector"}
                </Button>

                <Button
                  disabled={!!busy}
                  onClick={async () => {
                    if (!activeWallet) throw new Error("Missing activeWallet (Privy).");
                    const res = await runAction("VF: setDefaults", async () =>
                      setVaultFactoryDefaultsUseCase({
                        activeWallet,
                        cooldownSec: Number(cooldownSec),
                        maxSlippageBps: Number(maxSlippageBps),
                        allowSwap: Boolean(allowSwap),
                      })
                    );
                    push({ title: "Tx sent", description: res?.txHash || "ok" });
                  }}
                >
                  {busy === "VF: setDefaults" ? "Working..." : "VF: setDefaults"}
                </Button>
              </div>

              <div style={{ marginTop: 10, opacity: 0.75, fontSize: 13 }}>
                Lembrete: mudar executor/feeCollector/defaults no factory só afeta <b>vaults novos</b>. Vault antigo fica com os imutáveis antigos.
              </div>
            </Card>

          </div>
        </Card>


        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>DEX Registry</div>

          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              <Input
                label="DEX key"
                placeholder="pancake_v3"
                value={dexForm.dex}
                onChange={(e) => setDexForm((s) => ({ ...s, dex: e.target.value }))}
              />
              <Input
                label="Status"
                placeholder="ACTIVE"
                value={dexForm.status}
                onChange={(e) =>
                  setDexForm((s) => ({
                    ...s,
                    status: (e.target.value || "ACTIVE").toUpperCase() as any,
                  }))
                }
              />
            </div>

            <Input
              label="DEX Router"
              placeholder="Dex Router 0x..."
              value={dexForm.dex_router}
              onChange={(e) => setDexForm((s) => ({ ...s, dex_router: e.target.value }))}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button
                disabled={!!busy}
                onClick={async () => {
                  const chain = (await getActiveChainRuntime()).chainKey as any;
                  const res = await runAction("Create DEX Registry", (t) =>
                    createDexUseCase({
                      accessToken: t,
                      body: {
                        chain,
                        dex: dexForm.dex.trim(),
                        dex_router: dexForm.dex_router.trim(),
                        status: dexForm.status,
                      },
                    })
                  );
                  push({ title: "Result", description: res?.message || "OK" });
                }}
              >
                {busy === "Create DEX Registry" ? "Working..." : "Create DEX Registry"}
              </Button>

              <Button
                variant="ghost"
                disabled={!!busy}
                onClick={async () => {
                  const chain = (await getActiveChainRuntime()).chainKey as any;
                  const res = await runAction("List DEX Registries", (t) =>
                    listDexesUseCase({ accessToken: t, chain })
                  );
                  setDexesJson(res);
                }}
              >
                {busy === "List DEX Registries" ? "Loading..." : "List DEX Registries"}
              </Button>
            </div>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>DEX Registries</div>
              <pre style={codeBlockStyle}>
                {dexesJson ? JSON.stringify(dexesJson, null, 2) : "—"}
              </pre>
            </Card>
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>DEX Pools</div>

          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              <Input
                label="DEX key (parent)"
                placeholder="pancake_v3"
                value={poolForm.dex}
                onChange={(e) => setPoolForm((s) => ({ ...s, dex: e.target.value }))}
              />
              <Input
                label="Status"
                placeholder="ACTIVE"
                value={poolForm.status}
                onChange={(e) =>
                  setPoolForm((s) => ({
                    ...s,
                    status: (e.target.value || "ACTIVE").toUpperCase() as any,
                  }))
                }
              />
            </div>

            <Input
              label="Pool"
              placeholder="Pool 0x..."
              value={poolForm.pool}
              onChange={(e) => setPoolForm((s) => ({ ...s, pool: e.target.value }))}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              <Input
                label="NFPM"
                placeholder="NFPM 0x..."
                value={poolForm.nfpm}
                onChange={(e) => setPoolForm((s) => ({ ...s, nfpm: e.target.value }))}
              />
              <Input
                label="Gauge (can be zero)"
                placeholder="Gauge 0x0000..."
                value={poolForm.gauge}
                onChange={(e) => setPoolForm((s) => ({ ...s, gauge: e.target.value }))}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              <Input
                label="Token0"
                placeholder="Token0 0x..."
                value={poolForm.token0}
                onChange={(e) => setPoolForm((s) => ({ ...s, token0: e.target.value }))}
              />
              <Input
                label="Token1"
                placeholder="Token1 0x..."
                value={poolForm.token1}
                onChange={(e) => setPoolForm((s) => ({ ...s, token1: e.target.value }))}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              <Input
                label="Pair label"
                placeholder="Pair WETH-USDC"
                value={poolForm.pair}
                onChange={(e) => setPoolForm((s) => ({ ...s, pair: e.target.value }))}
              />
              <Input
                label="Symbol"
                placeholder="Symbol ETHUSDT"
                value={poolForm.symbol}
                onChange={(e) => setPoolForm((s) => ({ ...s, symbol: e.target.value }))}
              />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              <Input
                label="Reward Token"
                placeholder="Reward token"
                value={poolForm.reward_token}
                onChange={(e) => setPoolForm((s) => ({ ...s, reward_token: e.target.value }))}
              />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              <Input
                label="Reward Swap Pool (can be zero)"
                placeholder="Reward swap pool (pool address)"
                value={poolForm.reward_swap_pool}
                onChange={(e) => setPoolForm((s) => ({ ...s, reward_swap_pool: e.target.value }))}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Fee (bps)</div>
                <input
                  type="number"
                  value={poolForm.fee_bps}
                  onChange={(e) => setPoolForm((s) => ({ ...s, fee_bps: Number(e.target.value) }))}
                  style={{ width: "100%", padding: 10, borderRadius: 10 }}
                />
              </div>

              <Input
                label="Adapter (optional)"
                placeholder="Adapter 0x... (deployed adapter)"
                value={poolForm.adapter}
                onChange={(e) => setPoolForm((s) => ({ ...s, adapter: e.target.value }))}
              />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button
                disabled={!!busy}
                onClick={async () => {
                  const chain = (await getActiveChainRuntime()).chainKey as any;
                  const res = await runAction("Create DEX Pool", (t) =>
                    createDexPoolUseCase({
                      accessToken: t,
                      body: {
                        chain,
                        dex: poolForm.dex.trim(),
                        pool: poolForm.pool.trim(),
                        nfpm: poolForm.nfpm.trim(),
                        gauge: poolForm.gauge.trim(),
                        token0: poolForm.token0.trim(),
                        token1: poolForm.token1.trim(),
                        pair: poolForm.pair.trim(),
                        symbol: poolForm.symbol.trim(),
                        fee_bps: Number(poolForm.fee_bps),
                        adapter: (poolForm.adapter || "").trim() || null,
                        reward_token: poolForm.reward_token.trim(),
                        reward_swap_pool: (poolForm.reward_swap_pool || "").trim() || "0x0000000000000000000000000000000000000000",
                        status: poolForm.status,
                      },
                    })
                  );
                  push({ title: "Result", description: res?.message || "OK" });
                }}
              >
                {busy === "Create DEX Pool" ? "Working..." : "Create DEX Pool"}
              </Button>

              <Button
                variant="ghost"
                disabled={!!busy}
                onClick={async () => {
                  const chain = (await getActiveChainRuntime()).chainKey as any;
                  const res = await runAction("List DEX Pools", (t) =>
                    listDexPoolsUseCase({ accessToken: t, chain, dex: poolForm.dex.trim(), limit: 500 })
                  );
                  setPoolsJson(res);
                }}
              >
                {busy === "List DEX Pools" ? "Loading..." : "List DEX Pools"}
              </Button>
            </div>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>DEX Pools</div>
              <pre style={codeBlockStyle}>
                {poolsJson ? JSON.stringify(poolsJson, null, 2) : "—"}
              </pre>
            </Card>
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Adapters</div>
          
          <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
              <Input
                label="Prefill pools from DEX"
                placeholder="pancake_v3"
                value={prefillDex}
                onChange={(e) => setPrefillDex(e.target.value)}
              />
              <Button
                variant="ghost"
                disabled={!!busy}
                onClick={async () => {
                  const chain = (await getActiveChainRuntime()).chainKey as any;
                  const res = await runAction("Load Pool Configs", (t) =>
                    listDexPoolsUseCase({ accessToken: t, chain, dex: prefillDex.trim(), limit: 500 })
                  );
                  const items = (res as any)?.data || [];
                  setPrefillPools(items);
                }}
              >
                {busy === "Load Pool Configs" ? "Loading..." : "Load Pool Configs"}
              </Button>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Select a pool to prefill Adapter form</div>
              <select
                value={prefillPoolAddr}
                onChange={(e) => {
                  const v = e.target.value;
                  setPrefillPoolAddr(v);
                  const found = prefillPools.find((p) => (p?.pool || "").toLowerCase() === v.toLowerCase());
                  if (found) {
                    setAdapterForm((s) => ({
                      ...s,
                      dex: found.dex || s.dex,
                      pool: found.pool || "",
                      nfpm: found.nfpm || "",
                      gauge: found.gauge || "0x0000000000000000000000000000000000000000",
                      token0: found.token0 || "",
                      token1: found.token1 || "",
                      pool_name: found.pair || found.symbol || s.pool_name,
                      fee_bps: String(found.fee_bps ?? s.fee_bps),
                    }));
                  }
                }}
                style={{ width: "100%", padding: 10, borderRadius: 10 }}
              >
                <option value="">— select —</option>
                {prefillPools.map((p, idx) => (
                  <option key={`${p?.pool || idx}`} value={p?.pool || ""}>
                    {(p?.pair || p?.symbol || p?.pool || "pool") + " | " + (p?.pool ? `${p.pool.slice(0, 6)}…${p.pool.slice(-4)}` : "")}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
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

            <Input
              label="Fee Buffer (constructor param)"
              placeholder="VaultFeeBuffer 0x..."
              value={adapterForm.fee_buffer}
              onChange={(e) => setAdapterForm((s) => ({ ...s, fee_buffer: e.target.value }))}
            />
            
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button
                disabled={!!busy}
                onClick={async () => {
                  const payload = {
                    chain: (await getActiveChainRuntime()).chainKey,
                    gas_strategy: gasStrategy,
                    dex: adapterForm.dex.trim(),
                    pool: adapterForm.pool.trim(),
                    nfpm: adapterForm.nfpm.trim(),
                    gauge: adapterForm.gauge.trim(),
                    fee_buffer: adapterForm.fee_buffer.trim(),
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
              <pre style={codeBlockStyle}>
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
                  return listStrategiesOnchain("");
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
              <pre style={codeBlockStyle}>
                {strategiesJson ? JSON.stringify(strategiesJson, null, 2) : "—"}
              </pre>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Vaults</div>
              <pre style={codeBlockStyle}>
                {vaultsJson ? JSON.stringify(vaultsJson, null, 2) : "—"}
              </pre>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Owners</div>
              <pre style={codeBlockStyle}>
                {ownersJson ? JSON.stringify(ownersJson, null, 2) : "—"}
              </pre>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Users</div>
              <pre style={codeBlockStyle}>
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
