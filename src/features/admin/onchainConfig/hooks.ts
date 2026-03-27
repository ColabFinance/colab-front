"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useActiveWallet } from "@/hooks/useActiveWallet";
import { useAuthToken } from "@/hooks/useAuthToken";

import { listChainsUseCase } from "@/core/usecases/admin/chains/listChains.usecase";

import { allowProtocolFeeCollectorReporterUseCase } from "@/core/application/admin/onchain/allowProtocolFeeCollectorReporter.usecase";
import { allowStrategyAdapterUseCase } from "@/core/application/admin/onchain/allowStrategyAdapter.usecase";
import { allowStrategyRouterUseCase } from "@/core/application/admin/onchain/allowStrategyRouter.usecase";
import { allowVaultFeeBufferDepositorUseCase } from "@/core/application/admin/onchain/allowVaultFeeBufferDepositor.usecase";
import { checkStrategyAllowlistUseCase } from "@/core/application/admin/onchain/checkStrategyAllowlist.usecase";
import { checkProtocolFeeCollectorReporterUseCase } from "@/core/application/admin/onchain/checkProtocolFeeCollectorReporter.usecase";
import { checkVaultFeeBufferDepositorUseCase } from "@/core/application/admin/onchain/checkVaultFeeBufferDepositor.usecase";
import { getProtocolFeeCollectorConfigUseCase } from "@/core/application/admin/onchain/getProtocolFeeCollectorConfig.usecase";
import { getVaultFactoryConfigUseCase } from "@/core/application/admin/onchain/getVaultFactoryConfig.usecase";
import { setProtocolFeeCollectorFeeBpsUseCase } from "@/core/application/admin/onchain/setProtocolFeeCollectorFeeBps.usecase";
import { setProtocolFeeCollectorTreasuryUseCase } from "@/core/application/admin/onchain/setProtocolFeeCollectorTreasury.usecase";
import { setVaultFactoryDefaultsUseCase } from "@/core/application/admin/onchain/setVaultFactoryDefaults.usecase";
import { setVaultFactoryExecutorUseCase } from "@/core/application/admin/onchain/setVaultFactoryExecutor.usecase";
import { setVaultFactoryFeeCollectorUseCase } from "@/core/application/admin/onchain/setVaultFactoryFeeCollector.usecase";

import { listOnchainProtocolFeeCollectorStateUseCase } from "@/core/usecases/admin/onchainConfig/listOnchainProtocolFeeCollectorState.usecase";
import { listOnchainStrategyRegistryStateUseCase } from "@/core/usecases/admin/onchainConfig/listOnchainStrategyRegistryState.usecase";
import { listOnchainVaultFactoryStateUseCase } from "@/core/usecases/admin/onchainConfig/listOnchainVaultFactoryState.usecase";
import { listOnchainVaultFeeBufferStateUseCase } from "@/core/usecases/admin/onchainConfig/listOnchainVaultFeeBufferState.usecase";
import { saveProtocolFeeCollectorStateUseCase } from "@/core/usecases/admin/onchainConfig/saveProtocolFeeCollectorState.usecase";
import { saveProtocolFeeReporterStateUseCase } from "@/core/usecases/admin/onchainConfig/saveProtocolFeeReporterState.usecase";
import { saveStrategyAdapterStateUseCase } from "@/core/usecases/admin/onchainConfig/saveStrategyAdapterState.usecase";
import { saveStrategyRouterStateUseCase } from "@/core/usecases/admin/onchainConfig/saveStrategyRouterState.usecase";
import { saveVaultFactoryStateUseCase } from "@/core/usecases/admin/onchainConfig/saveVaultFactoryState.usecase";
import { saveVaultFeeBufferDepositorStateUseCase } from "@/core/usecases/admin/onchainConfig/saveVaultFeeBufferDepositorState.usecase";

import {
  AdapterAllowlistItem,
  ChainOption,
  DepositorItem,
  OnchainTabId,
  PendingTx,
  ProtocolFeeCollectorConfig,
  ReporterItem,
  RouterAllowlistItem,
  VaultFactoryConfig,
} from "./types";

function isAddressLike(v: string) {
  const s = v.trim();
  return /^0x[a-fA-F0-9]{40}$/.test(s);
}

function parseManyAddresses(input: string): string[] {
  return input
    .split(/[\n,;\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean)
    .filter(isAddressLike);
}

function shortDate(v?: string | null) {
  return v || "—";
}

export function useOnchainConfig() {
  const activeWallet = useActiveWallet();
  const { token, ensureTokenOrLogin, ready } = useAuthToken();

  const [chainOptions, setChainOptions] = useState<ChainOption[]>([]);
  const [chainId, setChainId] = useState<number>(1);

  const [activeTab, setActiveTab] = useState<OnchainTabId>("strategyRegistry");
  const [search, setSearch] = useState("");

  const [routers, setRouters] = useState<RouterAllowlistItem[]>([]);
  const [adapters, setAdapters] = useState<AdapterAllowlistItem[]>([]);

  const [strategyRegistryAddress, setStrategyRegistryAddress] = useState("");
  const [strategyRegistryOwner, setStrategyRegistryOwner] = useState("");

  const [vaultFactory, setVaultFactory] = useState<VaultFactoryConfig>({
    contractAddress: "",
    ownerAddress: "",
    executorAddress: "",
    feeCollectorAddress: "",
    cooldownSec: 0,
    maxSlippageBps: 0,
    allowSwap: false,
  });
  const [vaultFactoryDraft, setVaultFactoryDraft] = useState<Partial<VaultFactoryConfig>>({});
  const [vaultFactorySavedAtLabel, setVaultFactorySavedAtLabel] = useState<string>("");

  const [protocolFee, setProtocolFee] = useState<ProtocolFeeCollectorConfig>({
    contractAddress: "",
    ownerAddress: "",
    treasuryAddress: "",
    feeBps: 0,
  });
  const [protocolFeeDraft, setProtocolFeeDraft] = useState<Partial<ProtocolFeeCollectorConfig>>({});
  const [protocolFeeSavedAtLabel, setProtocolFeeSavedAtLabel] = useState<string>("");

  const [reporters, setReporters] = useState<ReporterItem[]>([]);
  const [vaultFeeBufferAddress, setVaultFeeBufferAddress] = useState("");
  const [vaultFeeBufferOwner, setVaultFeeBufferOwner] = useState("");
  const [depositors, setDepositors] = useState<DepositorItem[]>([]);

  const [pendingTx, setPendingTx] = useState<PendingTx | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingActionKind, setPendingActionKind] = useState<"vaultFactory" | "protocolFeeCollector" | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const currentChain = useMemo(
    () => chainOptions.find((c) => c.chainId === chainId) ?? null,
    [chainId, chainOptions]
  );

  const chainKey = currentChain?.key ?? "";

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

  const activeContractAddress = useMemo(() => {
    if (activeTab === "strategyRegistry") return strategyRegistryAddress;
    if (activeTab === "vaultFactory") return vaultFactory.contractAddress;
    if (activeTab === "protocolFeeCollector") return protocolFee.contractAddress;
    return vaultFeeBufferAddress;
  }, [
    activeTab,
    strategyRegistryAddress,
    vaultFactory.contractAddress,
    protocolFee.contractAddress,
    vaultFeeBufferAddress,
  ]);

  const activeContractLabel = useMemo(() => {
    if (activeTab === "strategyRegistry") return "Active StrategyRegistry";
    if (activeTab === "vaultFactory") return "Active VaultFactory";
    if (activeTab === "protocolFeeCollector") return "Active ProtocolFeeCollector";
    return "Active VaultFeeBuffer";
  }, [activeTab]);

  async function resolveAccessToken() {
    const accessToken = token || (await ensureTokenOrLogin());
    if (!accessToken) throw new Error("Admin access token not available.");
    return accessToken;
  }

  function resolveActiveWallet() {
    if (!activeWallet) throw new Error("Connect the admin wallet first.");
    return activeWallet;
  }

  const loadChains = useCallback(async () => {
    if (!token) return;

    const out = await listChainsUseCase({ accessToken: token, limit: 500 });
    const next = (out.data ?? []).map((item: any) => ({
      chainId: Number(item.chain_id),
      name: String(item.name),
      key: String(item.key),
    }));

    setChainOptions(next);

    if (next.length > 0) {
      setChainId((prev) => (next.some((x) => x.chainId === prev) ? prev : next[0].chainId));
    }
  }, [token]);

  const loadStrategyRegistry = useCallback(
    async (accessToken: string, selectedChain: string) => {
      const res = await listOnchainStrategyRegistryStateUseCase({
        accessToken,
        chain: selectedChain,
      });

      const contract = res.data?.contract ?? null;
      setStrategyRegistryAddress(contract?.address ?? "");
      setStrategyRegistryOwner(contract?.owner ?? "");

      const dbRouters = res.data?.routers ?? [];
      const dbAdapters = res.data?.adapters ?? [];

      const routerChecks = await Promise.all(
        dbRouters.map(async (item) => {
          try {
            const out = await checkStrategyAllowlistUseCase({ router: item.address });
            return Boolean(out.routerAllowed);
          } catch {
            return false;
          }
        })
      );

      const adapterChecks = await Promise.all(
        dbAdapters.map(async (item) => {
          try {
            const out = await checkStrategyAllowlistUseCase({ adapter: item.address });
            return Boolean(out.adapterAllowed);
          } catch {
            return false;
          }
        })
      );

      setRouters(
        dbRouters.map((item, idx) => ({
          id: item.id || `router_${item.address}`,
          name: item.label,
          address: item.address,
          status: routerChecks[idx] ? "active" : "disabled",
          desiredAllowed: Boolean(item.desired_allowed),
          onchainAllowed: routerChecks[idx],
          updatedAtLabel: shortDate(item.updated_at_iso),
          txHash: item.tx_hash ?? null,
        }))
      );

      setAdapters(
        dbAdapters.map((item, idx) => ({
          id: item.id || `adapter_${item.address}`,
          label: item.label,
          adapterType: item.adapter_type || "Unknown",
          address: item.address,
          status: adapterChecks[idx] ? "active" : "disabled",
          desiredAllowed: Boolean(item.desired_allowed),
          onchainAllowed: adapterChecks[idx],
          updatedAtLabel: shortDate(item.updated_at_iso),
          txHash: item.tx_hash ?? null,
        }))
      );
    },
    []
  );

  const loadVaultFactory = useCallback(
    async (accessToken: string, selectedChain: string) => {
      const [dbRes, onchain] = await Promise.all([
        listOnchainVaultFactoryStateUseCase({
          accessToken,
          chain: selectedChain,
        }),
        getVaultFactoryConfigUseCase().catch(() => null),
      ]);

      const contract = dbRes.data?.contract ?? null;
      const saved = dbRes.data?.saved_config ?? null;

      setVaultFactory({
        contractAddress: onchain?.contractAddress || contract?.address || "",
        ownerAddress: onchain?.ownerAddress || contract?.owner || "",
        executorAddress: onchain?.executorAddress || saved?.executor || "",
        feeCollectorAddress: onchain?.feeCollectorAddress || saved?.fee_collector || "",
        cooldownSec: onchain?.cooldownSec ?? saved?.default_cooldown_sec ?? 0,
        maxSlippageBps: onchain?.maxSlippageBps ?? saved?.default_max_slippage_bps ?? 0,
        allowSwap: onchain?.allowSwap ?? saved?.default_allow_swap ?? false,
      });

      setVaultFactorySavedAtLabel(saved?.updated_at_iso || "");
    },
    []
  );

  const loadProtocolFeeCollector = useCallback(
    async (accessToken: string, selectedChain: string) => {
      const [dbRes, onchain] = await Promise.all([
        listOnchainProtocolFeeCollectorStateUseCase({
          accessToken,
          chain: selectedChain,
        }),
        getProtocolFeeCollectorConfigUseCase().catch(() => null),
      ]);

      const contract = dbRes.data?.contract ?? null;
      const saved = dbRes.data?.saved_config ?? null;
      const dbReporters = dbRes.data?.reporters ?? [];

      setProtocolFee({
        contractAddress: onchain?.contractAddress || contract?.address || "",
        ownerAddress: onchain?.ownerAddress || contract?.owner || "",
        treasuryAddress: onchain?.treasuryAddress || saved?.treasury || "",
        feeBps: onchain?.feeBps ?? saved?.protocol_fee_bps ?? 0,
      });

      setProtocolFeeSavedAtLabel(saved?.updated_at_iso || "");

      const reporterChecks = await Promise.all(
        dbReporters.map(async (item) => {
          try {
            const out = await checkProtocolFeeCollectorReporterUseCase({ reporter: item.reporter });
            return Boolean(out.allowed);
          } catch {
            return false;
          }
        })
      );

      setReporters(
        dbReporters.map((item, idx) => ({
          id: item.id || `rep_${item.reporter}`,
          address: item.reporter,
          desiredAllowed: Boolean(item.desired_allowed),
          onchainAllowed: reporterChecks[idx],
          addedAtLabel: shortDate(item.updated_at_iso || item.created_at_iso),
        }))
      );
    },
    []
  );

  const loadVaultFeeBuffer = useCallback(
    async (accessToken: string, selectedChain: string) => {
      const dbRes = await listOnchainVaultFeeBufferStateUseCase({
        accessToken,
        chain: selectedChain,
      });

      const contract = dbRes.data?.contract ?? null;
      const dbDepositors = dbRes.data?.depositors ?? [];

      setVaultFeeBufferAddress(contract?.address ?? "");
      setVaultFeeBufferOwner(contract?.owner ?? "");

      const depositorChecks = await Promise.all(
        dbDepositors.map(async (item) => {
          try {
            const out = await checkVaultFeeBufferDepositorUseCase({ depositor: item.depositor });
            return Boolean(out.allowed);
          } catch {
            return false;
          }
        })
      );

      setDepositors(
        dbDepositors.map((item, idx) => ({
          id: item.id || `dep_${item.depositor}`,
          address: item.depositor,
          label: item.label || "Depositor",
          desiredAllowed: Boolean(item.desired_allowed),
          onchainAllowed: depositorChecks[idx],
          addedAtLabel: shortDate(item.updated_at_iso || item.created_at_iso),
        }))
      );
    },
    []
  );

  const reloadAll = useCallback(async () => {
    if (!token || !chainKey) return;

    setLoading(true);
    try {
      await Promise.all([
        loadStrategyRegistry(token, chainKey),
        loadVaultFactory(token, chainKey),
        loadProtocolFeeCollector(token, chainKey),
        loadVaultFeeBuffer(token, chainKey),
      ]);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to load on-chain admin configuration.");
    } finally {
      setLoading(false);
    }
  }, [token, chainKey, loadStrategyRegistry, loadVaultFactory, loadProtocolFeeCollector, loadVaultFeeBuffer]);

  useEffect(() => {
    if (!ready) return;
    void loadChains();
  }, [ready, loadChains]);

  useEffect(() => {
    if (!ready || !token || !chainKey) return;
    void reloadAll();
  }, [ready, token, chainKey, reloadAll]);

  async function removeRouter(id: string) {
    const row = routers.find((x) => x.id === id);
    if (!row) return;

    try {
      const wallet = resolveActiveWallet();
      const accessToken = await resolveAccessToken();

      const tx = await allowStrategyRouterUseCase({
        activeWallet: wallet,
        router: row.address,
        allowed: false,
      });

      await saveStrategyRouterStateUseCase({
        accessToken,
        body: {
          chain: chainKey,
          address: row.address,
          name: row.name,
          allowed: false,
          tx_hash: tx.txHash,
        },
      });

      await loadStrategyRegistry(accessToken, chainKey);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to remove router.");
    }
  }

  async function removeAdapter(id: string) {
    const row = adapters.find((x) => x.id === id);
    if (!row) return;

    try {
      const wallet = resolveActiveWallet();
      const accessToken = await resolveAccessToken();

      const tx = await allowStrategyAdapterUseCase({
        activeWallet: wallet,
        adapter: row.address,
        allowed: false,
      });

      await saveStrategyAdapterStateUseCase({
        accessToken,
        body: {
          chain: chainKey,
          address: row.address,
          label: row.label,
          adapter_type: row.adapterType,
          allowed: false,
          tx_hash: tx.txHash,
        },
      });

      await loadStrategyRegistry(accessToken, chainKey);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to remove adapter.");
    }
  }

  async function addRouter(name: string, address: string) {
    if (!name.trim() || !isAddressLike(address)) return;

    try {
      const wallet = resolveActiveWallet();
      const accessToken = await resolveAccessToken();

      const tx = await allowStrategyRouterUseCase({
        activeWallet: wallet,
        router: address,
        allowed: true,
      });

      await saveStrategyRouterStateUseCase({
        accessToken,
        body: {
          chain: chainKey,
          address: address.trim(),
          name: name.trim(),
          allowed: true,
          tx_hash: tx.txHash,
        },
      });

      await loadStrategyRegistry(accessToken, chainKey);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to add router.");
    }
  }

  async function addAdapter(label: string, adapterType: string, address: string) {
    if (!label.trim() || !adapterType.trim() || !isAddressLike(address)) return;

    try {
      const wallet = resolveActiveWallet();
      const accessToken = await resolveAccessToken();

      const tx = await allowStrategyAdapterUseCase({
        activeWallet: wallet,
        adapter: address,
        allowed: true,
      });

      await saveStrategyAdapterStateUseCase({
        accessToken,
        body: {
          chain: chainKey,
          address: address.trim(),
          label: label.trim(),
          adapter_type: adapterType.trim(),
          allowed: true,
          tx_hash: tx.txHash,
        },
      });

      await loadStrategyRegistry(accessToken, chainKey);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to add adapter.");
    }
  }

  async function bulkPasteRouters() {
    const input = window.prompt(
      "Paste router addresses (space/newline/comma separated). One on-chain tx will be requested per address:",
      ""
    );
    if (!input) return;

    const addrs = parseManyAddresses(input);
    for (const addr of addrs) {
      await addRouter(`Router ${addr.slice(0, 6)}…${addr.slice(-4)}`, addr);
    }
  }

  async function bulkPasteAdapters() {
    const input = window.prompt(
      "Paste adapter addresses (space/newline/comma separated). One on-chain tx will be requested per address:",
      ""
    );
    if (!input) return;

    const addrs = parseManyAddresses(input);
    for (const addr of addrs) {
      await addAdapter(`Adapter ${addr.slice(0, 6)}…${addr.slice(-4)}`, "Unknown", addr);
    }
  }

  async function addReporter(address: string) {
    if (!isAddressLike(address)) return;

    try {
      const wallet = resolveActiveWallet();
      const accessToken = await resolveAccessToken();

      const tx = await allowProtocolFeeCollectorReporterUseCase({
        activeWallet: wallet,
        reporter: address,
        allowed: true,
      });

      await saveProtocolFeeReporterStateUseCase({
        accessToken,
        body: {
          chain: chainKey,
          reporter: address.trim(),
          allowed: true,
          tx_hash: tx.txHash,
        },
      });

      await loadProtocolFeeCollector(accessToken, chainKey);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to add reporter.");
    }
  }

  async function removeReporter(id: string) {
    const row = reporters.find((x) => x.id === id);
    if (!row) return;

    try {
      const wallet = resolveActiveWallet();
      const accessToken = await resolveAccessToken();

      const tx = await allowProtocolFeeCollectorReporterUseCase({
        activeWallet: wallet,
        reporter: row.address,
        allowed: false,
      });

      await saveProtocolFeeReporterStateUseCase({
        accessToken,
        body: {
          chain: chainKey,
          reporter: row.address,
          allowed: false,
          tx_hash: tx.txHash,
        },
      });

      await loadProtocolFeeCollector(accessToken, chainKey);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to revoke reporter.");
    }
  }

  async function addDepositor(address: string, label: string) {
    if (!isAddressLike(address)) return;

    try {
      const wallet = resolveActiveWallet();
      const accessToken = await resolveAccessToken();

      const tx = await allowVaultFeeBufferDepositorUseCase({
        activeWallet: wallet,
        depositor: address,
        allowed: true,
      });

      await saveVaultFeeBufferDepositorStateUseCase({
        accessToken,
        body: {
          chain: chainKey,
          depositor: address.trim(),
          label: label.trim() || "Depositor",
          allowed: true,
          tx_hash: tx.txHash,
        },
      });

      await loadVaultFeeBuffer(accessToken, chainKey);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to add depositor.");
    }
  }

  async function revokeDepositor(id: string) {
    const row = depositors.find((x) => x.id === id);
    if (!row) return;

    try {
      const wallet = resolveActiveWallet();
      const accessToken = await resolveAccessToken();

      const tx = await allowVaultFeeBufferDepositorUseCase({
        activeWallet: wallet,
        depositor: row.address,
        allowed: false,
      });

      await saveVaultFeeBufferDepositorStateUseCase({
        accessToken,
        body: {
          chain: chainKey,
          depositor: row.address,
          label: row.label,
          allowed: false,
          tx_hash: tx.txHash,
        },
      });

      await loadVaultFeeBuffer(accessToken, chainKey);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to revoke depositor.");
    }
  }

  function openConfirm(tx: PendingTx, kind: "vaultFactory" | "protocolFeeCollector") {
    setPendingTx(tx);
    setPendingActionKind(kind);
    setConfirmOpen(true);
  }

  function closeConfirm() {
    setConfirmOpen(false);
    setPendingTx(null);
    setPendingActionKind(null);
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
      params.push({ k: "defaultCooldownSec", v: String(d.cooldownSec) });
    }

    if (typeof d.maxSlippageBps === "number" && d.maxSlippageBps !== vaultFactory.maxSlippageBps) {
      params.push({ k: "defaultMaxSlippageBps", v: String(d.maxSlippageBps) });
    }

    if (typeof d.allowSwap === "boolean" && d.allowSwap !== vaultFactory.allowSwap) {
      params.push({ k: "defaultAllowSwap", v: d.allowSwap ? "true" : "false" });
    }

    if (!params.length) return null;

    return {
      contractLabel: "VaultFactory",
      contractAddress: vaultFactory.contractAddress,
      functionLabel: "setExecutor / setFeeCollector / setDefaults",
      description:
        "You are about to modify VaultFactory on-chain configuration. Depending on the changed fields, more than one transaction may be submitted.",
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
      functionLabel: "setTreasury / setProtocolFeeBps",
      description:
        "You are about to modify ProtocolFeeCollector on-chain configuration. Depending on the changed fields, more than one transaction may be submitted.",
      params,
    };
  }

  function requestApplyVaultFactory() {
    const tx = buildVaultFactoryTxFromDraft();
    if (!tx) return;
    openConfirm(tx, "vaultFactory");
  }

  function requestApplyProtocolFee() {
    const tx = buildProtocolFeeTxFromDraft();
    if (!tx) return;
    openConfirm(tx, "protocolFeeCollector");
  }

  async function executePendingTxMock() {
    if (!pendingTx || !pendingActionKind) return;

    try {
      const wallet = resolveActiveWallet();
      const accessToken = await resolveAccessToken();

      if (pendingActionKind === "vaultFactory") {
        const next: VaultFactoryConfig = {
          ...vaultFactory,
          ...vaultFactoryDraft,
        };

        const txHashes: string[] = [];

        if (
          vaultFactoryDraft.executorAddress &&
          vaultFactoryDraft.executorAddress !== vaultFactory.executorAddress
        ) {
          const tx = await setVaultFactoryExecutorUseCase({
            activeWallet: wallet,
            executor: vaultFactoryDraft.executorAddress,
          });
          txHashes.push(tx.txHash);
        }

        if (
          vaultFactoryDraft.feeCollectorAddress &&
          vaultFactoryDraft.feeCollectorAddress !== vaultFactory.feeCollectorAddress
        ) {
          const tx = await setVaultFactoryFeeCollectorUseCase({
            activeWallet: wallet,
            feeCollector: vaultFactoryDraft.feeCollectorAddress,
          });
          txHashes.push(tx.txHash);
        }

        const defaultsChanged =
          typeof vaultFactoryDraft.cooldownSec === "number" ||
          typeof vaultFactoryDraft.maxSlippageBps === "number" ||
          typeof vaultFactoryDraft.allowSwap === "boolean";

        if (defaultsChanged) {
          const tx = await setVaultFactoryDefaultsUseCase({
            activeWallet: wallet,
            cooldownSec: next.cooldownSec,
            maxSlippageBps: next.maxSlippageBps,
            allowSwap: next.allowSwap,
          });
          txHashes.push(tx.txHash);
        }

        await saveVaultFactoryStateUseCase({
          accessToken,
          body: {
            chain: chainKey,
            executor: next.executorAddress,
            fee_collector: next.feeCollectorAddress,
            default_cooldown_sec: next.cooldownSec,
            default_max_slippage_bps: next.maxSlippageBps,
            default_allow_swap: next.allowSwap,
            tx_hash: txHashes[txHashes.length - 1] || null,
          },
        });

        setVaultFactoryDraft({});
        await loadVaultFactory(accessToken, chainKey);
      }

      if (pendingActionKind === "protocolFeeCollector") {
        const next: ProtocolFeeCollectorConfig = {
          ...protocolFee,
          ...protocolFeeDraft,
        };

        const txHashes: string[] = [];

        if (
          protocolFeeDraft.treasuryAddress &&
          protocolFeeDraft.treasuryAddress !== protocolFee.treasuryAddress
        ) {
          const tx = await setProtocolFeeCollectorTreasuryUseCase({
            activeWallet: wallet,
            treasury: protocolFeeDraft.treasuryAddress,
          });
          txHashes.push(tx.txHash);
        }

        if (typeof protocolFeeDraft.feeBps === "number" && protocolFeeDraft.feeBps !== protocolFee.feeBps) {
          const tx = await setProtocolFeeCollectorFeeBpsUseCase({
            activeWallet: wallet,
            feeBps: protocolFeeDraft.feeBps,
          });
          txHashes.push(tx.txHash);
        }

        await saveProtocolFeeCollectorStateUseCase({
          accessToken,
          body: {
            chain: chainKey,
            treasury: next.treasuryAddress,
            protocol_fee_bps: next.feeBps,
            tx_hash: txHashes[txHashes.length - 1] || null,
          },
        });

        setProtocolFeeDraft({});
        await loadProtocolFeeCollector(accessToken, chainKey);
      }

      setError("");
    } catch (e: any) {
      setError(e?.message || "Failed to execute the pending on-chain update.");
    } finally {
      closeConfirm();
    }
  }

  return {
    chainOptions,
    chainId,
    setChainId,

    activeTab,
    setActiveTab,

    search,
    setSearch,

    loading,
    error,

    routers: filteredRouters,
    adapters: filteredAdapters,

    addRouter,
    removeRouter,
    addAdapter,
    removeAdapter,
    bulkPasteRouters,
    bulkPasteAdapters,

    strategyRegistryAddress,
    strategyRegistryOwner,

    vaultFactory,
    vaultFactoryDraft,
    setVaultFactoryDraft,
    vaultFactorySavedAtLabel,
    requestApplyVaultFactory,

    protocolFee,
    protocolFeeDraft,
    setProtocolFeeDraft,
    protocolFeeSavedAtLabel,
    requestApplyProtocolFee,

    reporters,
    addReporter,
    removeReporter,

    vaultFeeBufferAddress,
    vaultFeeBufferOwner,
    depositors,
    addDepositor,
    revokeDepositor,

    activeContractAddress,
    activeContractLabel,

    confirmOpen,
    pendingTx,
    closeConfirm,
    executePendingTxMock,
  };
}