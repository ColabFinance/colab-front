"use client";

import { useMemo, useState } from "react";
import {
  MOCK_ADAPTERS,
  MOCK_DEPOSITORS,
  MOCK_PROTOCOL_FEE,
  MOCK_REPORTERS,
  MOCK_ROUTERS,
  MOCK_VAULT_FACTORY,
  CHAINS,
} from "./mock";
import {
  AdapterAllowlistItem,
  DepositorItem,
  PendingTx,
  ProtocolFeeCollectorConfig,
  ReporterItem,
  RouterAllowlistItem,
  VaultFactoryConfig,
  OnchainTabId,
} from "./types";

function isAddressLike(v: string) {
  const s = v.trim();
  return /^0x[a-fA-F0-9]{8,}$/.test(s);
}

function parseManyAddresses(input: string): string[] {
  return input
    .split(/[\n,;\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .filter(isAddressLike);
}

export function useOnchainConfig() {
  const chainOptions = useMemo(() => CHAINS, []);
  const [chainId, setChainId] = useState<number>(1);

  const [activeTab, setActiveTab] = useState<OnchainTabId>("strategyRegistry");
  const [search, setSearch] = useState("");

  const [routers, setRouters] = useState<RouterAllowlistItem[]>(() => MOCK_ROUTERS);
  const [adapters, setAdapters] = useState<AdapterAllowlistItem[]>(() => MOCK_ADAPTERS);

  const [vaultFactory, setVaultFactory] = useState<VaultFactoryConfig>(() => MOCK_VAULT_FACTORY);
  const [vaultFactoryDraft, setVaultFactoryDraft] = useState<Partial<VaultFactoryConfig>>({});

  const [protocolFee, setProtocolFee] = useState<ProtocolFeeCollectorConfig>(() => MOCK_PROTOCOL_FEE);
  const [protocolFeeDraft, setProtocolFeeDraft] = useState<Partial<ProtocolFeeCollectorConfig>>({});

  const [reporters, setReporters] = useState<ReporterItem[]>(() => MOCK_REPORTERS);
  const [depositors, setDepositors] = useState<DepositorItem[]>(() => MOCK_DEPOSITORS);

  const [pendingTx, setPendingTx] = useState<PendingTx | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const filteredRouters = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return routers;
    return routers.filter((r) => `${r.name} ${r.address}`.toLowerCase().includes(q));
  }, [routers, search]);

  const filteredAdapters = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return adapters;
    return adapters.filter((a) => `${a.label} ${a.adapterType} ${a.address}`.toLowerCase().includes(q));
  }, [adapters, search]);

  function removeRouter(id: string) {
    setRouters((prev) => prev.filter((x) => x.id !== id));
  }

  function removeAdapter(id: string) {
    setAdapters((prev) => prev.filter((x) => x.id !== id));
  }

  function addRouter(name: string, address: string) {
    if (!name.trim() || !isAddressLike(address)) return;
    setRouters((prev) => [
      { id: `router_${crypto.randomUUID()}`, name: name.trim(), address: address.trim(), status: "active" },
      ...prev,
    ]);
  }

  function addAdapter(label: string, adapterType: string, address: string) {
    if (!label.trim() || !adapterType.trim() || !isAddressLike(address)) return;
    setAdapters((prev) => [
      {
        id: `adapter_${crypto.randomUUID()}`,
        label: label.trim(),
        adapterType: adapterType.trim(),
        address: address.trim(),
        status: "active",
      },
      ...prev,
    ]);
  }

  function bulkPasteRouters() {
    const input = window.prompt("Paste router addresses (space/newline/comma separated):", "");
    if (!input) return;
    const addrs = parseManyAddresses(input);
    if (!addrs.length) return;

    setRouters((prev) => {
      const next: RouterAllowlistItem[] = [...prev];
      for (const addr of addrs) {
        next.unshift({
          id: `router_${crypto.randomUUID()}`,
          name: `Router ${addr.slice(0, 6)}…${addr.slice(-4)}`,
          address: addr,
          status: "active",
        });
      }
      return next;
    });
  }

  function bulkPasteAdapters() {
    const input = window.prompt("Paste adapter addresses (space/newline/comma separated):", "");
    if (!input) return;
    const addrs = parseManyAddresses(input);
    if (!addrs.length) return;

    setAdapters((prev) => {
      const next: AdapterAllowlistItem[] = [...prev];
      for (const addr of addrs) {
        next.unshift({
          id: `adapter_${crypto.randomUUID()}`,
          label: `Adapter ${addr.slice(0, 6)}…${addr.slice(-4)}`,
          adapterType: "Unknown",
          address: addr,
          status: "active",
        });
      }
      return next;
    });
  }

  function addReporter(address: string) {
    if (!isAddressLike(address)) return;
    setReporters((prev) => [
      { id: `rep_${crypto.randomUUID()}`, address: address.trim(), addedAtLabel: "Added just now" },
      ...prev,
    ]);
  }

  function removeReporter(id: string) {
    setReporters((prev) => prev.filter((x) => x.id !== id));
  }

  function addDepositor(address: string, label: string) {
    if (!isAddressLike(address)) return;
    setDepositors((prev) => [
      { id: `dep_${crypto.randomUUID()}`, address: address.trim(), label: label.trim() || "Depositor" },
      ...prev,
    ]);
  }

  function revokeDepositor(id: string) {
    setDepositors((prev) => prev.filter((x) => x.id !== id));
  }

  function openConfirm(tx: PendingTx) {
    setPendingTx(tx);
    setConfirmOpen(true);
  }

  function closeConfirm() {
    setConfirmOpen(false);
    setPendingTx(null);
  }

  function buildVaultFactoryTxFromDraft(): PendingTx | null {
    const d = vaultFactoryDraft;
    const params: Array<{ k: string; v: string }> = [];

    if (d.executorAddress && d.executorAddress !== vaultFactory.executorAddress) {
      params.push({ k: "executor", v: d.executorAddress });
    }
    if (d.feeCollectorAddress && d.feeCollectorAddress !== vaultFactory.feeCollectorAddress) {
      params.push({ k: "feeCollector", v: d.feeCollectorAddress });
    }
    if (typeof d.cooldownSec === "number" && d.cooldownSec !== vaultFactory.cooldownSec) {
      params.push({ k: "cooldownSec", v: String(d.cooldownSec) });
    }
    if (typeof d.slippageBps === "number" && d.slippageBps !== vaultFactory.slippageBps) {
      params.push({ k: "slippageBps", v: String(d.slippageBps) });
    }
    if (typeof d.feeBps === "number" && d.feeBps !== vaultFactory.feeBps) {
      params.push({ k: "feeBps", v: String(d.feeBps) });
    }
    if (typeof d.compoundEnabled === "boolean" && d.compoundEnabled !== vaultFactory.compoundEnabled) {
      params.push({ k: "compoundEnabled", v: d.compoundEnabled ? "true" : "false" });
    }

    if (!params.length) return null;

    return {
      contractLabel: "VaultFactory",
      contractAddress: vaultFactory.contractAddress,
      functionLabel: "applyConfig(...)",
      description: "You are about to modify VaultFactory configuration. This action is irreversible.",
      params,
    };
  }

  function buildProtocolFeeTxFromDraft(): PendingTx | null {
    const d = protocolFeeDraft;
    const params: Array<{ k: string; v: string }> = [];

    if (d.treasuryAddress && d.treasuryAddress !== protocolFee.treasuryAddress) {
      params.push({ k: "treasury", v: d.treasuryAddress });
    }
    if (typeof d.feeBps === "number" && d.feeBps !== protocolFee.feeBps) {
      params.push({ k: "protocolFeeBps", v: String(d.feeBps) });
    }

    if (!params.length) return null;

    return {
      contractLabel: "ProtocolFeeCollector",
      contractAddress: protocolFee.contractAddress,
      functionLabel: "setParams(...)",
      description: "You are about to modify ProtocolFeeCollector configuration on-chain.",
      params,
    };
  }

  function requestApplyVaultFactory() {
    const tx = buildVaultFactoryTxFromDraft();
    if (!tx) return;
    openConfirm(tx);
  }

  function requestApplyProtocolFee() {
    const tx = buildProtocolFeeTxFromDraft();
    if (!tx) return;
    openConfirm(tx);
  }

  function executePendingTxMock() {
    // mock apply: merge draft into current config
    if (!pendingTx) return;

    if (pendingTx.contractLabel === "VaultFactory") {
      setVaultFactory((prev) => ({ ...prev, ...vaultFactoryDraft }));
      setVaultFactoryDraft({});
    }

    if (pendingTx.contractLabel === "ProtocolFeeCollector") {
      setProtocolFee((prev) => ({ ...prev, ...protocolFeeDraft }));
      setProtocolFeeDraft({});
    }

    closeConfirm();
  }

  return {
    chainOptions,
    chainId,
    setChainId,

    activeTab,
    setActiveTab,

    search,
    setSearch,

    routers: filteredRouters,
    adapters: filteredAdapters,

    removeRouter,
    removeAdapter,
    addRouter,
    addAdapter,
    bulkPasteRouters,
    bulkPasteAdapters,

    vaultFactory,
    vaultFactoryDraft,
    setVaultFactoryDraft,
    requestApplyVaultFactory,

    protocolFee,
    protocolFeeDraft,
    setProtocolFeeDraft,
    requestApplyProtocolFee,

    reporters,
    addReporter,
    removeReporter,

    depositors,
    addDepositor,
    revokeDepositor,

    confirmOpen,
    pendingTx,
    closeConfirm,
    executePendingTxMock,
  };
}