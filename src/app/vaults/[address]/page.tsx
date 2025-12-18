"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/toast/useToast";
import { useOwnerAddress } from "@/hooks/useOwnerAddress";
import { getVaultDetails } from "@/application/vault/getVaultDetails.usecase";
import type { VaultDetails } from "@/domain/vault/types";

function shortAddr(a?: string) {
  if (!a) return "-";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function formatTs(ts?: number) {
  if (!ts || ts <= 0) return "-";
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}

export default function VaultDetailsPage() {
  const params = useParams<{ address: string }>();
  const vaultAddress = useMemo(() => (params?.address ? String(params.address) : ""), [params]);

  const { push } = useToast();
  const { ownerAddr } = useOwnerAddress();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState<VaultDetails | null>(null);

  const isOwner = !!data?.owner && !!ownerAddr && data.owner.toLowerCase() === ownerAddr.toLowerCase();

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      const d = await getVaultDetails(vaultAddress);
      setData(d);
    } catch (e: any) {
      setErr(e?.message || String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      push({ title: "Copied", description: text });
    } catch {
      push({ title: "Copy failed", description: "Clipboard permission denied." });
    }
  }

  useEffect(() => {
    if (!vaultAddress) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultAddress]);

  return (
    <main style={{ padding: 24, maxWidth: 1100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Vault</h1>
          <div style={{ marginTop: 6, opacity: 0.85, fontFamily: "monospace" }}>{vaultAddress}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button onClick={() => copy(vaultAddress)} variant="ghost">
            Copy address
          </Button>
          <Button onClick={refresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {err ? <div style={{ marginTop: 12, color: "crimson" }}>{err}</div> : null}

      {!data ? (
        <Card style={{ marginTop: 14 }}>
          <div style={{ opacity: 0.85 }}>
            {loading ? "Loading vault details..." : "No data."}
          </div>
        </Card>
      ) : (
        <>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Wiring</div>

              <Row label="Owner" value={data.owner} right={`You: ${ownerAddr ? shortAddr(ownerAddr) : "-"}`} />
              <Row label="Executor" value={data.executor} />
              <Row label="Adapter" value={data.adapter} />
              <Row label="DEX Router" value={data.dexRouter} />
              <Row label="Fee Collector" value={data.feeCollector} />
              <Row label="Strategy ID" value={String(data.strategyId)} />

              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button onClick={() => copy(data.owner)} variant="ghost">Copy owner</Button>
                <Button onClick={() => copy(data.adapter)} variant="ghost">Copy adapter</Button>
                <Button onClick={() => copy(data.dexRouter)} variant="ghost">Copy router</Button>
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>State</div>

              <Row label="token0" value={data.token0} />
              <Row label="token1" value={data.token1} />
              <Row label="positionTokenId" value={data.positionTokenId} />
              <Row label="lastRebalanceTs" value={String(data.lastRebalanceTs)} right={formatTs(data.lastRebalanceTs)} />
            </Card>
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Automation</div>

              <Row label="automationEnabled" value={String(data.automationEnabled)} />
              <Row label="cooldownSec" value={String(data.cooldownSec)} />
              <Row label="maxSlippageBps" value={String(data.maxSlippageBps)} />
              <Row label="allowSwap" value={String(data.allowSwap)} />

              <div style={{ marginTop: 10, opacity: 0.85 }}>
                {isOwner ? "You are the owner (actions will be enabled in next step)." : "Not owner (read-only)."}
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 800, marginBottom: 10 }}>Next</div>
              <div style={{ opacity: 0.85, lineHeight: 1.5 }}>
                Próximo passo (ainda na Fase 2): adicionar ações básicas (owner only) via api-lp:
                <div style={{ marginTop: 8, fontFamily: "monospace" }}>
                  setAutomationEnabled / setAutomationConfig / collect / exit / exitWithdraw / stake / unstake / claim
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </main>
  );
}

function Row(props: { label: string; value: string; right?: string }) {
  const { label, value, right } = props;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 10, marginTop: 8 }}>
      <div style={{ opacity: 0.7 }}>{label}</div>
      <div style={{ fontFamily: label.includes("ID") || label.includes("token") ? "monospace" : "monospace" }}>
        <div>{value || "-"}</div>
        {right ? <div style={{ opacity: 0.7, marginTop: 2 }}>{right}</div> : null}
      </div>
    </div>
  );
}
