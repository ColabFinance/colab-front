"use client";

import * as React from "react";
import type {
  AdminChainItem,
  AdminContractListResult,
  AdminContractRecord,
  AdminResult,
  ChainKey,
  CreateProtocolFeeCollectorBody,
  CreateStrategyRegistryBody,
  CreateVaultFactoryBody,
  CreateVaultFeeBufferBody,
} from "@/core/infra/api/api-lp/admin";
import { listChainsUseCase } from "@/core/usecases/admin/chains/listChains.usecase";
import { createProtocolFeeCollectorUseCase } from "@/core/usecases/admin/contracts/createProtocolFeeCollector.usecase";
import { createStrategyRegistryUseCase } from "@/core/usecases/admin/contracts/createStrategyRegistry.usecase";
import { createVaultFactoryUseCase } from "@/core/usecases/admin/contracts/createVaultFactory.usecase";
import { createVaultFeeBufferUseCase } from "@/core/usecases/admin/contracts/createVaultFeeBuffer.usecase";
import { listProtocolFeeCollectorsUseCase } from "@/core/usecases/admin/contracts/listProtocolFeeCollectors.usecase";
import { listStrategyRegistriesUseCase } from "@/core/usecases/admin/contracts/listStrategyRegistries.usecase";
import { listVaultFactoriesUseCase } from "@/core/usecases/admin/contracts/listVaultFactories.usecase";
import { listVaultFeeBuffersUseCase } from "@/core/usecases/admin/contracts/listVaultFeeBuffers.usecase";
import { useAuthToken } from "@/hooks/useAuthToken";
import type {
  ChainOption,
  ContractApiState,
  ContractFormValues,
  ContractTabKey,
  RuntimeContractRecord,
  RuntimeContractStatus,
} from "./types";

type ContractStateMap = Record<string, ContractApiState>;

function stateKey(chain: string, tab: ContractTabKey) {
  return `${chain}:${tab}`;
}

function emptyContractState(): ContractApiState {
  return {
    active: undefined,
    history: [],
  };
}

function formatDateShort(value?: string | null) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateFull(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function normalizeChains(items?: AdminChainItem[]): ChainOption[] {
  if (!items?.length) return [];

  return items
    .filter((item) => item.key === "base" || item.key === "bnb")
    .map((item) => ({
      value: item.key as ChainKey,
      label: item.name,
      status: item.status,
    }));
}

function normalizeError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unexpected error while executing this operation.";
}

function mapStatus(status?: string | null): RuntimeContractStatus {
  const value = (status || "").toLowerCase();

  if (value === "active") return "active";
  if (value.includes("archived") || value.includes("deprecated")) return "deprecated";
  return "inactive";
}

function normalizeRecord(record?: AdminContractRecord | null): RuntimeContractRecord | undefined {
  if (!record?.address) return undefined;

  const extra: Record<string, unknown> = {
    treasury: record.treasury,
    protocol_fee_bps: record.protocol_fee_bps,
    strategy_registry: record.strategy_registry,
    executor: record.executor,
    fee_collector: record.fee_collector,
    default_cooldown_sec: record.default_cooldown_sec,
    default_max_slippage_bps: record.default_max_slippage_bps,
    default_allow_swap: record.default_allow_swap,
  };

  Object.keys(extra).forEach((key) => {
    if (extra[key] === undefined || extra[key] === null) {
      delete extra[key];
    }
  });

  return {
    chain: record.chain,
    address: record.address,
    owner: record.owner || undefined,
    ownerTag: record.owner ? "Admin" : undefined,
    txHash: record.tx_hash || undefined,
    status: mapStatus(record.status),
    createdAtLabel: formatDateShort(record.created_at_iso),
    createdAtFullLabel: formatDateFull(record.created_at_iso),
    updatedAtLabel: record.updated_at_iso ? formatDateShort(record.updated_at_iso) : "Unknown",
    extra,
  };
}

function normalizeContractListResponse(response?: AdminContractListResult): ContractApiState {
  const payload = response?.result;

  const active = normalizeRecord(payload?.active || undefined);
  const history = (payload?.history || [])
    .map((item) => normalizeRecord(item))
    .filter(Boolean) as RuntimeContractRecord[];

  return {
    active,
    history,
  };
}

export function useContractsData() {
  const { token, ready, authenticated, ensureTokenOrLogin } = useAuthToken();

  const [chainsLoading, setChainsLoading] = React.useState(false);
  const [contractsLoading, setContractsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [chainOptions, setChainOptions] = React.useState<ChainOption[]>([]);
  const [selectedChain, setSelectedChain] = React.useState<ChainKey | "">("");
  const [submittingKey, setSubmittingKey] = React.useState<ContractTabKey | null>(null);
  const [contractStateMap, setContractStateMap] = React.useState<ContractStateMap>({});

  const fetchContractsForChain = React.useCallback(
    async (accessToken: string, chain: ChainKey) => {
      setContractsLoading(true);

      const settled = await Promise.allSettled([
        listStrategyRegistriesUseCase({ accessToken, chain, limit: 50 }),
        listVaultFactoriesUseCase({ accessToken, chain, limit: 50 }),
        listProtocolFeeCollectorsUseCase({ accessToken, chain, limit: 50 }),
        listVaultFeeBuffersUseCase({ accessToken, chain, limit: 50 }),
      ]);

      const tabs: ContractTabKey[] = [
        "strategy-registry",
        "vault-factory",
        "protocol-fee-collector",
        "vault-fee-buffer",
      ];

      const labels = [
        "StrategyRegistry",
        "VaultFactory",
        "ProtocolFeeCollector",
        "VaultFeeBuffer",
      ];

      const nextState: ContractStateMap = {};
      const errors: string[] = [];

      settled.forEach((result, index) => {
        const tab = tabs[index];
        const label = labels[index];

        if (result.status === "fulfilled") {
          nextState[stateKey(chain, tab)] = normalizeContractListResponse(result.value);
        } else {
          nextState[stateKey(chain, tab)] = emptyContractState();
          errors.push(`${label}: ${normalizeError(result.reason)}`);
        }
      });

      setContractStateMap((prev) => ({
        ...prev,
        ...nextState,
      }));

      if (errors.length) {
        setErrorMessage(errors.join(" | "));
      } else {
        setErrorMessage("");
      }

      setContractsLoading(false);
    },
    []
  );

  React.useEffect(() => {
    let mounted = true;

    async function loadChains() {
      if (!ready || !authenticated || !token) return;

      setChainsLoading(true);

      try {
        const result = await listChainsUseCase({
          accessToken: token,
          limit: 500,
        });

        if (!mounted) return;

        const options = normalizeChains(result.data);
        setChainOptions(options);

        if (!selectedChain && options.length) {
          setSelectedChain(options[0].value);
        }
      } catch (error) {
        if (!mounted) return;
        setErrorMessage(normalizeError(error));
      } finally {
        if (mounted) setChainsLoading(false);
      }
    }

    loadChains();

    return () => {
      mounted = false;
    };
  }, [authenticated, ready, selectedChain, token]);

  React.useEffect(() => {
    let mounted = true;

    async function loadContracts() {
      if (!ready || !authenticated || !token || !selectedChain) return;

      try {
        await fetchContractsForChain(token, selectedChain);
      } catch (error) {
        if (!mounted) return;
        setErrorMessage(normalizeError(error));
      }
    }

    loadContracts();

    return () => {
      mounted = false;
    };
  }, [authenticated, fetchContractsForChain, ready, selectedChain, token]);

  const createContract = React.useCallback(
    async (tab: ContractTabKey, values: ContractFormValues) => {
      setErrorMessage("");
      setSubmittingKey(tab);

      try {
        const accessToken = token || (await ensureTokenOrLogin());
        if (!accessToken) {
          throw new Error("Authentication is required to continue.");
        }

        if (!selectedChain) {
          throw new Error("Select a chain before deploying.");
        }

        let response: AdminResult;

        if (tab === "strategy-registry") {
          const body: CreateStrategyRegistryBody = {
            chain: selectedChain,
            gas_strategy: (values.gas_strategy as "default" | "buffered" | "aggressive") || "buffered",
            initial_owner: values.initial_owner,
          };

          response = await createStrategyRegistryUseCase({ accessToken, body });
        } else if (tab === "vault-factory") {
          const body: CreateVaultFactoryBody = {
            chain: selectedChain,
            gas_strategy: (values.gas_strategy as "default" | "buffered" | "aggressive") || "buffered",
            initial_owner: values.initial_owner,
            strategy_registry: values.strategy_registry,
            executor: values.executor,
            fee_collector:
              values.fee_collector || "0x0000000000000000000000000000000000000000",
            default_cooldown_sec: Number(values.default_cooldown_sec || 1),
            default_max_slippage_bps: Number(values.default_max_slippage_bps || 50),
            default_allow_swap: values.default_allow_swap === "true",
          };

          response = await createVaultFactoryUseCase({ accessToken, body });
        } else if (tab === "protocol-fee-collector") {
          const body: CreateProtocolFeeCollectorBody = {
            chain: selectedChain,
            gas_strategy: (values.gas_strategy as "default" | "buffered" | "aggressive") || "buffered",
            initial_owner: values.initial_owner,
            treasury: values.treasury,
            protocol_fee_bps: Number(values.protocol_fee_bps || 0),
          };

          response = await createProtocolFeeCollectorUseCase({ accessToken, body });
        } else {
          const body: CreateVaultFeeBufferBody = {
            chain: selectedChain,
            gas_strategy: (values.gas_strategy as "default" | "buffered" | "aggressive") || "buffered",
            initial_owner: values.initial_owner,
          };

          response = await createVaultFeeBufferUseCase({ accessToken, body });
        }

        await fetchContractsForChain(accessToken, selectedChain);
        return response;
      } catch (error) {
        setErrorMessage(normalizeError(error));
        throw error;
      } finally {
        setSubmittingKey(null);
      }
    },
    [ensureTokenOrLogin, fetchContractsForChain, selectedChain, token]
  );

  const getActiveRecord = React.useCallback(
    (tab: ContractTabKey) => {
      if (!selectedChain) return undefined;
      return contractStateMap[stateKey(selectedChain, tab)]?.active;
    },
    [contractStateMap, selectedChain]
  );

  const getHistory = React.useCallback(
    (tab: ContractTabKey) => {
      if (!selectedChain) return [];
      return contractStateMap[stateKey(selectedChain, tab)]?.history || [];
    },
    [contractStateMap, selectedChain]
  );

  const currentChain = React.useMemo(
    () => chainOptions.find((item) => item.value === selectedChain),
    [chainOptions, selectedChain]
  );

  return {
    ready,
    authenticated,
    chainsLoading,
    contractsLoading,
    errorMessage,
    setErrorMessage,
    chainOptions,
    selectedChain,
    setSelectedChain,
    currentChain,
    submittingKey,
    createContract,
    getActiveRecord,
    getHistory,
  };
}