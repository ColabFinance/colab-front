"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { useToast } from "@/shared/ui/toast/useToast";

import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { useActiveWallet } from "@/hooks/useActiveWallet";

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

function useIsMobile(breakpointPx = 860) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpointPx);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpointPx]);

  return isMobile;
}

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const { ready, authenticated, login, logout, linkWallet, user } = usePrivy();
  const { ownerAddr, wallets, ensureWallet } = useOwnerAddress();
  const { activeWallet } = useActiveWallet();
  const { push } = useToast();

  const isMobile = useIsMobile(860);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeType = useMemo(() => walletLabel(activeWallet?.walletClientType), [activeWallet?.walletClientType]);

  const canGoBack = useMemo(() => {
    return pathname !== "/";
  }, [pathname]);

  useEffect(() => {
    // se mudar de rota, fecha drawer no mobile
    setDrawerOpen(false);
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

  const colors = {
    bg: "#0b1220",
    surface: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.12)",
    text: "rgba(255,255,255,0.92)",
    muted: "rgba(255,255,255,0.70)",
    link: "rgba(255,255,255,0.90)",
  };

  const navHeight = 64;

  function NavLinks({ compact }: { compact?: boolean }) {
    const linkStyle: React.CSSProperties = {
      textDecoration: "none",
      color: colors.link,
      fontWeight: 700,
      opacity: 0.92,
      padding: compact ? "10px 10px" : "8px 10px",
      borderRadius: 10,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      whiteSpace: "nowrap",
    };

    const activeStyle: React.CSSProperties = {
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      opacity: 1,
    };

    const isActive = (href: string) => pathname === href;

    return (
      <div style={{ display: "flex", flexDirection: compact ? "column" : "row", gap: compact ? 6 : 6 }}>
        <Link href="/" style={{ ...linkStyle, ...(isActive("/") ? activeStyle : undefined) }}>
          Colab
        </Link>
        <Link href="/strategies" style={{ ...linkStyle, ...(isActive("/strategies") ? activeStyle : undefined) }}>
          Strategies
        </Link>
        <Link href="/vaults" style={{ ...linkStyle, ...(isActive("/vaults") ? activeStyle : undefined) }}>
          Vaults
        </Link>
        <Link href="/admin" style={{ ...linkStyle, ...(isActive("/admin") ? activeStyle : undefined) }}>
          Admin
        </Link>
      </div>
    );
  }

  function WalletBlock({ compact }: { compact?: boolean }) {
    return (
      <Card
        style={{
          padding: compact ? 12 : "10px 12px",
          borderRadius: 14,
          border: `1px solid ${colors.border}`,
          background: colors.surface,
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontSize: 12, color: colors.muted, fontWeight: 700 }}>
              Signed by{" "}
              <span
                style={{
                  marginLeft: 6,
                  padding: "2px 8px",
                  borderRadius: 999,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {activeType}
              </span>
            </div>

            <div style={{ fontSize: 12, color: colors.muted, fontWeight: 700 }}>
              wallets: <span style={{ color: colors.text }}>{wallets.length}</span>
            </div>
          </div>

          <div style={{ fontFamily: "monospace", fontSize: 12, color: colors.text }}>
            {ownerAddr ? shortAddr(ownerAddr) : "-"}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button
              variant="ghost"
              onClick={() => ownerAddr && copy(ownerAddr)}
              disabled={!ownerAddr}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              Copy
            </Button>

            <Button
              variant="ghost"
              onClick={explainAddFunds}
              disabled={!ownerAddr}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              Add funds
            </Button>

            <Button
              variant="ghost"
              onClick={async () => {
                await ensureWallet();
                push({ title: "Wallet ready", description: "Embedded wallet exists (or was created on login)." });
              }}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              Ensure wallet
            </Button>

            <Button
              variant="ghost"
              onClick={linkWallet}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              Link MetaMask
            </Button>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
            <Button
              onClick={logout}
              style={{
                padding: "9px 12px",
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                background: "rgba(255,255,255,0.10)",
                color: colors.text,
              }}
            >
              Logout
            </Button>
          </div>

          <div style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
            user: <span style={{ color: colors.text }}>{user?.id ?? "-"}</span>
          </div>
        </div>
      </Card>
    );
  }

  // ===== Desktop layout =====
  if (!isMobile) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: navHeight,
          borderBottom: `1px solid ${colors.border}`,
          background: colors.bg,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            height: "100%",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* LEFT */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              disabled={!canGoBack}
              title="Go back"
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                borderColor: colors.border,
                color: colors.text,
                background: "transparent",
              }}
            >
              ← Back
            </Button>

            <NavLinks />
          </div>

          {/* RIGHT */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
            {!ready ? (
              <span style={{ opacity: 0.8, color: colors.muted }}>Loading…</span>
            ) : !authenticated ? (
              <Button
                onClick={login}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: `1px solid ${colors.border}`,
                  background: "rgba(255,255,255,0.10)",
                  color: colors.text,
                }}
              >
                Login
              </Button>
            ) : (
              <WalletBlock />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== Mobile layout (hamburger + drawer) =====
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: navHeight,
          borderBottom: `1px solid ${colors.border}`,
          background: colors.bg,
          zIndex: 60,
        }}
      >
        <div
          style={{
            height: "100%",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <Button
              variant="ghost"
              onClick={() => setDrawerOpen((v) => !v)}
              style={{
                padding: "8px 10px",
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: "rgba(255,255,255,0.06)",
                color: colors.text,
              }}
              aria-label="Open menu"
              title="Menu"
            >
              ☰
            </Button>

            <div style={{ minWidth: 0, display: "grid" }}>
              <div style={{ fontWeight: 900, color: colors.text, lineHeight: 1.1 }}>Colab</div>
              <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.1 }}>
                {ownerAddr ? shortAddr(ownerAddr) : "not connected"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!ready ? (
              <span style={{ color: colors.muted, fontSize: 13 }}>Loading…</span>
            ) : !authenticated ? (
              <Button
                onClick={login}
                style={{
                  padding: "9px 12px",
                  borderRadius: 12,
                  border: `1px solid ${colors.border}`,
                  background: "rgba(255,255,255,0.10)",
                  color: colors.text,
                  whiteSpace: "nowrap",
                }}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setDrawerOpen(true)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 12,
                  border: `1px solid ${colors.border}`,
                  background: "rgba(255,255,255,0.06)",
                  color: colors.text,
                  whiteSpace: "nowrap",
                }}
              >
                Wallet
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {drawerOpen ? (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed",
            top: navHeight,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 59,
          }}
        />
      ) : null}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: navHeight,
          left: 0,
          right: 0,
          zIndex: 61,
          transform: drawerOpen ? "translateY(0)" : "translateY(-8px)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 140ms ease, transform 140ms ease",
          padding: 12,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            background: colors.bg,
            overflow: "hidden",
            boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ color: colors.text, fontWeight: 900 }}>Menu</div>
            <Button
              variant="ghost"
              onClick={() => setDrawerOpen(false)}
              style={{
                padding: "8px 10px",
                borderRadius: 12,
                border: `1px solid ${colors.border}`,
                background: "rgba(255,255,255,0.06)",
                color: colors.text,
              }}
            >
              ✕
            </Button>
          </div>

          <div style={{ padding: 12, display: "grid", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: colors.muted, marginBottom: 8, fontWeight: 800 }}>Navigation</div>
              <NavLinks compact />
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={!canGoBack}
                  style={{
                    padding: "9px 12px",
                    borderRadius: 12,
                    borderColor: colors.border,
                    color: colors.text,
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  ← Back
                </Button>
              </div>
            </div>

            <div style={{ height: 1, background: colors.border, opacity: 0.9 }} />

            <div>
              <div style={{ fontSize: 12, color: colors.muted, marginBottom: 8, fontWeight: 800 }}>Session</div>

              {!ready ? (
                <div style={{ color: colors.muted }}>Loading…</div>
              ) : !authenticated ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button
                    onClick={login}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: `1px solid ${colors.border}`,
                      background: "rgba(255,255,255,0.10)",
                      color: colors.text,
                    }}
                  >
                    Login
                  </Button>
                </div>
              ) : (
                <WalletBlock compact />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
