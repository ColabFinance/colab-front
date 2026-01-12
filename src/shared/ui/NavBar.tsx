"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { useToast } from "@/shared/ui/toast/useToast";

import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { useActiveWallet } from "@/hooks/useActiveWallet";
import { CONFIG } from "@/shared/config/env";

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function walletLabel(t?: string) {
  const x = (t || "").toLowerCase();
  if (!x) return "unknown";
  if (x.includes("metamask")) return "metamask";
  if (x.includes("privy")) return "privy";
  if (x.includes("embedded")) return "privy";
  if (x.includes("walletconnect")) return "walletconnect";
  return t!;
}

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const { ready, authenticated, login, logout, linkWallet, user } = usePrivy();
  const { ownerAddr, wallets, ensureWallet } = useOwnerAddress();
  const { activeWallet } = useActiveWallet();
  const { push } = useToast();

  const activeType = useMemo(() => walletLabel(activeWallet?.walletClientType), [activeWallet?.walletClientType]);

  const canGoBack = useMemo(() => {
    // home não precisa back
    return pathname !== "/";
  }, [pathname]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      push({ title: "Copied", description: text });
    } catch {
      push({ title: "Copy failed", description: "Clipboard permission denied." });
    }
  }

  function explainAddFunds() {
    // Sem popover lib, usamos toast com instrução curta + cópia do endereço.
    if (!ownerAddr) {
      push({ title: "No wallet", description: "Login first to get a wallet address." });
      return;
    }

    const msg =
      `Send native ETH (gas) to: ${ownerAddr}. ` +
      `If this is Anvil/local: fund it from a pre-funded dev account (cast/hardhat/anvil). ` +
      `If testnet: use the chain faucet then transfer to this address.`;

    push({ title: "How to add funds", description: msg });
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        borderBottom: "1px solid #eee",
        background: "white",
        zIndex: 50,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", height: "100%", padding: "0 16px", display: "flex", alignItems: "center", gap: 12 }}>
        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            disabled={!canGoBack}
            title="Go back"
          >
            ← Back
          </Button>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <b style={{ color: "black" }}>Colab</b>
            </Link>
            <Link href="/strategies" style={{ textDecoration: "none" }}>
              Strategies
            </Link>
            <Link href="/vaults" style={{ textDecoration: "none" }}>
              Vaults
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {!ready ? (
            <span style={{ opacity: 0.8 }}>Loading…</span>
          ) : !authenticated ? (
            <Button onClick={login}>Login</Button>
          ) : (
            <>
              {/* Wallet chip */}
              <Card style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "grid", gap: 2 }}>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>
                    Signed by:{" "}
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 999,
                        border: "1px solid #ddd",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {activeType}
                    </span>
                  </div>

                  <div style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {ownerAddr ? shortAddr(ownerAddr) : "-"}
                  </div>

                  <div style={{ fontSize: 11, opacity: 0.7 }}>
                    wallets: {wallets.length}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="ghost" onClick={() => ownerAddr && copy(ownerAddr)} disabled={!ownerAddr}>
                    Copy
                  </Button>
                  <Button variant="ghost" onClick={explainAddFunds} disabled={!ownerAddr}>
                    Add funds
                  </Button>
                </div>
              </Card>

              {/* Actions */}
              <Button
                variant="ghost"
                onClick={async () => {
                  await ensureWallet();
                  push({ title: "Wallet ready", description: "Embedded wallet exists (or was created on login)." });
                }}
              >
                Ensure wallet
              </Button>

              <Button variant="ghost" onClick={linkWallet}>
                Link MetaMask
              </Button>

              <Button onClick={logout}>Logout</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
