"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { useToast } from "@/shared/ui/toast/useToast";

import { useAuthToken } from "@/hooks/useAuthToken";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { useIsAdmin } from "@/hooks/useIsAdmin";

import { createStrategyFactoryUseCase } from "@/application/admin/createStrategyFactory.usecase";
import { createVaultFactoryUseCase } from "@/application/admin/createVaultFactory.usecase";
import { listOwnersUseCase } from "@/application/admin/listOwners.usecase";
import { listUsersUseCase } from "@/application/admin/listUsers.usecase";

import { listStrategiesOnchain } from "@/application/strategy/listStrategies.usecase";
import { listVaultsByOwner } from "@/application/vault/api/listVaultsByOwner.usecase";

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export default function AdminPage() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { ownerAddr } = useOwnerAddress();
  const { token, ensureTokenOrLogin } = useAuthToken();
  const { isAdmin } = useIsAdmin();
  const { push } = useToast();

  const [busy, setBusy] = useState<string>("");
  const [strategiesJson, setStrategiesJson] = useState<any>(null);
  const [vaultsJson, setVaultsJson] = useState<any>(null);
  const [ownersJson, setOwnersJson] = useState<any>(null);
  const [usersJson, setUsersJson] = useState<any>(null);

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
            This area is restricted. Please authenticate with Privy to continue.
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

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              disabled={!!busy}
              onClick={async () => {
                const res = await runAction("Create Strategy Factory", (t) =>
                  createStrategyFactoryUseCase({ accessToken: t })
                );
                push({ title: "Result", description: res?.message || "OK" });
              }}
            >
              {busy === "Create Strategy Factory" ? "Working..." : "Create Strategy Factory"}
            </Button>

            <Button
              disabled={!!busy}
              onClick={async () => {
                const res = await runAction("Create Vault Factory", (t) =>
                  createVaultFactoryUseCase({ accessToken: t })
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
                const res = await runAction("List Vaults", async () => {
                  // Reusing your existing usecase (by owner). You can later add an admin endpoint for global listing.
                  return listVaultsByOwner({ owner: addr });
                });
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
      </div>
    </main>
  );
}
