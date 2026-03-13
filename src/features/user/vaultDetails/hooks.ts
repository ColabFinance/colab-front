"use client";

import { useMemo, useState } from "react";
import { MOCK_VAULT_DETAILS } from "./mock";
import {
  VaultDetails,
  VaultDrawerKey,
  VaultEpisode,
  VaultEvent,
  VaultEventType,
  VaultTabKey,
} from "./types";

type EventTypeFilter = "all" | VaultEventType;

function normalizeAddress(value: string) {
  return value.trim().toLowerCase();
}

export function useVaultDetails(address: string) {
  const [tab, setTabState] = useState<VaultTabKey>("overview");
  const [actionDrawer, setActionDrawer] = useState<VaultDrawerKey>(null);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAssetSymbol, setDepositAssetSymbol] = useState("USDC");
  const [withdrawAssetSymbol, setWithdrawAssetSymbol] = useState("USDC");

  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>("all");
  const [eventSearch, setEventSearch] = useState("");
  const [eventTokenFilter, setEventTokenFilter] = useState<string>("all");
  const [eventFromDate, setEventFromDate] = useState("");
  const [eventToDate, setEventToDate] = useState("");

  const data: VaultDetails = useMemo(() => {
    void address;
    return MOCK_VAULT_DETAILS;
  }, [address]);

  const breadcrumbLabel = useMemo(() => data.header.pairLabel, [data.header.pairLabel]);

  const canManage = useMemo(() => {
    return (
      data.viewer.connected &&
      normalizeAddress(data.viewer.walletAddress) === normalizeAddress(data.ownerAddress)
    );
  }, [data.ownerAddress, data.viewer.connected, data.viewer.walletAddress]);

  const selectedDepositAsset = useMemo(() => {
    return (
      data.depositAssets.find((item) => item.symbol === depositAssetSymbol) ??
      data.depositAssets[0]
    );
  }, [data.depositAssets, depositAssetSymbol]);

  const selectedWithdrawAsset = useMemo(() => {
    return (
      data.withdrawAssets.find((item) => item.symbol === withdrawAssetSymbol) ??
      data.withdrawAssets[0]
    );
  }, [data.withdrawAssets, withdrawAssetSymbol]);

  const selectedEpisode: VaultEpisode | null = useMemo(() => {
    return data.episodes.find((episode) => episode.id === selectedEpisodeId) ?? null;
  }, [data.episodes, selectedEpisodeId]);

  const selectedEvent: VaultEvent | null = useMemo(() => {
    return data.events.find((event) => event.id === selectedEventId) ?? null;
  }, [data.events, selectedEventId]);

  const availableEventTokens = useMemo(() => {
    const values = new Set<string>();
    data.events.forEach((event) => {
      if (event.tokenSymbol) values.add(event.tokenSymbol);
      event.transfers.forEach((transfer) => values.add(transfer.tokenSymbol));
    });
    return ["all", ...Array.from(values)];
  }, [data.events]);

  const filteredEvents = useMemo(() => {
    return data.events.filter((event) => {
      if (eventTypeFilter !== "all" && event.type !== eventTypeFilter) return false;

      if (eventTokenFilter !== "all") {
        const matchesToken =
          event.tokenSymbol === eventTokenFilter ||
          event.transfers.some((transfer) => transfer.tokenSymbol === eventTokenFilter);
        if (!matchesToken) return false;
      }

      const search = eventSearch.trim().toLowerCase();
      if (search) {
        const haystack = [
          event.txHash,
          event.owner,
          event.vaultAddress,
          event.tokenSymbol ?? "",
          event.type,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(search)) return false;
      }

      const eventTime = new Date(event.tsIso).getTime();

      if (eventFromDate) {
        const fromTime = new Date(`${eventFromDate}T00:00:00`).getTime();
        if (eventTime < fromTime) return false;
      }

      if (eventToDate) {
        const toTime = new Date(`${eventToDate}T23:59:59`).getTime();
        if (eventTime > toTime) return false;
      }

      return true;
    });
  }, [
    data.events,
    eventFromDate,
    eventSearch,
    eventToDate,
    eventTokenFilter,
    eventTypeFilter,
  ]);

  function setTab(next: VaultTabKey) {
    setTabState(next);
    setSelectedEpisodeId(null);
    setSelectedEventId(null);
  }

  function openDrawer(kind: Exclude<VaultDrawerKey, null>) {
    if (!canManage) return;
    setActionDrawer(kind);
  }

  function closeDrawer() {
    setActionDrawer(null);
  }

  function setMaxDeposit() {
    setDepositAmount(selectedDepositAsset.maxAmount);
  }

  function setMaxWithdraw() {
    setWithdrawAmount(selectedWithdrawAsset.maxAmount);
  }

  function openEpisode(id: string) {
    setSelectedEpisodeId(id);
  }

  function closeEpisode() {
    setSelectedEpisodeId(null);
  }

  function openEvent(id: string) {
    setSelectedEventId(id);
  }

  function closeEvent() {
    setSelectedEventId(null);
  }

  return {
    tab,
    setTab,

    data,
    breadcrumbLabel,
    canManage,

    actionDrawer,
    openDrawer,
    closeDrawer,

    depositAmount,
    setDepositAmount,
    depositAssetSymbol,
    setDepositAssetSymbol,
    selectedDepositAsset,
    setMaxDeposit,

    withdrawAmount,
    setWithdrawAmount,
    withdrawAssetSymbol,
    setWithdrawAssetSymbol,
    selectedWithdrawAsset,
    setMaxWithdraw,

    selectedEpisode,
    openEpisode,
    closeEpisode,

    selectedEvent,
    openEvent,
    closeEvent,

    eventTypeFilter,
    setEventTypeFilter,
    eventSearch,
    setEventSearch,
    eventTokenFilter,
    setEventTokenFilter,
    eventFromDate,
    setEventFromDate,
    eventToDate,
    setEventToDate,
    availableEventTokens,
    filteredEvents,
  };
}