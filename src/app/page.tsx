"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { useAuthToken } from "@/hooks/useAuthToken";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";

export default function Home() {
  const { ready, authenticated, user, login, logout, createWallet, linkWallet } = usePrivy();
  const { ownerAddr, activeWallet, wallets } = useOwnerAddress();
  const { tokenPreview } = useAuthToken();

  if (!ready) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Colab Front (Privy)</h1>

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <a href="/strategies">/strategies</a>
        <a href="/vaults">/vaults</a>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        {!authenticated ? (
          <Button onClick={login}>Login</Button>
        ) : (
          <Button onClick={logout}>Logout</Button>
        )}

        {authenticated ? (
          <>
            <Button onClick={createWallet}>Create embedded wallet</Button>
            <Button onClick={linkWallet}>Link MetaMask</Button>
          </>
        ) : null}
      </div>

      <Card style={{ marginTop: 18 }}>
        <div><b>Authenticated:</b> {String(authenticated)}</div>
        <div><b>User:</b> {user?.id ?? "-"}</div>
        <div><b>user.wallet:</b> {user?.wallet?.address ?? "-"}</div>
        <div><b>wallets.length:</b> {wallets.length}</div>
        <div><b>Wallet address:</b> {ownerAddr ?? "-"}</div>
        <div><b>Wallet type:</b> {activeWallet?.walletClientType ?? "-"}</div>
        <div><b>Privy token (preview):</b> {tokenPreview || "-"}</div>
      </Card>
    </main>
  );
}
