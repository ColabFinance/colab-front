"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";

import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { useAuthToken } from "@/hooks/useAuthToken";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { useToast } from "@/shared/ui/toast/useToast";

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export default function Home() {
  const { ready, authenticated, user, login, logout, linkWallet } = usePrivy();
  const { ownerAddr, activeWallet, wallets, ensureWallet } = useOwnerAddress();
  const { tokenPreview } = useAuthToken();
  const { push } = useToast();

  if (!ready) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Colab Front</h1>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Session</div>
          <div>
            <b>Authenticated:</b> {String(authenticated)}
          </div>
          <div>
            <b>User:</b> {user?.id ?? "-"}
          </div>
          <div>
            <b>Wallet (active):</b> {ownerAddr ? shortAddr(ownerAddr) : "-"}{" "}
            <span style={{ opacity: 0.75 }}>
              ({activeWallet?.walletClientType || "unknown"})
            </span>
          </div>
          <div>
            <b>wallets:</b> {wallets.length}
          </div>
          <div>
            <b>Privy token (preview):</b> {tokenPreview || "-"}
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 900, marginBottom: 8 }}>How to add funds (Privy or MetaMask)</div>

          <div style={{ opacity: 0.9 }}>
            A Privy embedded wallet é uma wallet normal onchain. Para adicionar saldo:
          </div>

          <ol style={{ marginTop: 10, lineHeight: 1.6 }}>
            <li>Copie o address da sua wallet (acima).</li>
            <li>
              Envie <b>ETH (gas)</b> para esse address (transfer onchain).
            </li>
            <li>
              Se você estiver em <b>Anvil/local</b>, use uma conta pré-fundada do dev-env (cast/hardhat/anvil) e transfira.
            </li>
            <li>
              Se for <b>testnet</b>, pegue ETH no faucet da rede e envie para esse address.
            </li>
          </ol>

          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button
              variant="ghost"
              disabled={!ownerAddr}
              onClick={async () => {
                if (!ownerAddr) return;
                await navigator.clipboard.writeText(ownerAddr);
                push({ title: "Copied", description: ownerAddr });
              }}
            >
              Copy my address
            </Button>
          </div>

          <div style={{ marginTop: 10, opacity: 0.75 }}>
            Importante: “saldo” que importa pro app é:
            <b> (1) saldo na wallet pra pagar gas e (2) saldo dentro do vault</b>.
            Se quiser, você pode mostrar saldo da wallet também — mas não é obrigatório pra operar vaults.
          </div>
        </Card>
      </div>
    </main>
  );
}
