"use client";

import React from "react";
import type { VaultStatus } from "@/core/domain/vault/status";
import type { VaultDetails } from "@/core/domain/vault/types";
import { ActionFeedback, OwnerConfigFormState, VaultHeaderView } from "../types";
import { DrawerShell } from "./DrawerShell";

type Props = {
  open: boolean;
  onClose: () => void;
  canManage: boolean;
  header: VaultHeaderView;
  status: VaultStatus | null;
  details: VaultDetails | null;
  form: OwnerConfigFormState;
  onChangeField: (field: keyof OwnerConfigFormState, value: string | number | boolean) => void;
  feedback: ActionFeedback;
  onSaveAutomationToggle: () => void;
  onSaveAutomationConfig: () => void;
  onSaveDailyHarvestConfig: () => void;
  onSaveCompoundConfig: () => void;
  onSaveRewardSwapConfig: () => void;
};

function FeedbackBanner({ feedback }: { feedback: ActionFeedback }) {
  if (feedback.kind === "idle") return null;

  const tone =
    feedback.kind === "success"
      ? "border-green-500/20 bg-green-500/10 text-green-200"
      : feedback.kind === "error"
        ? "border-red-500/20 bg-red-500/10 text-red-200"
        : "border-cyan-500/20 bg-cyan-500/10 text-cyan-200";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tone}`}>
      <div>{feedback.message}</div>
      {feedback.txHash ? (
        <div className="mt-2 font-mono text-xs break-all">{feedback.txHash}</div>
      ) : null}
    </div>
  );
}

function SectionCard({
  title,
  children,
  actionLabel,
  onAction,
  disabled,
}: {
  title: string;
  children: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-white">{title}</div>
        <button
          type="button"
          onClick={onAction}
          disabled={disabled}
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {actionLabel}
        </button>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
      />
    </label>
  );
}

function InputRow({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (next: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-wide text-slate-500">{label}</label>
      <input
        type={type}
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500"
      />
    </div>
  );
}

export function VaultConfigDrawer({
  open,
  onClose,
  canManage,
  header,
  status,
  details,
  form,
  onChangeField,
  feedback,
  onSaveAutomationToggle,
  onSaveAutomationConfig,
  onSaveDailyHarvestConfig,
  onSaveCompoundConfig,
  onSaveRewardSwapConfig,
}: Props) {
  return (
    <DrawerShell
      open={open}
      onClose={onClose}
      title="Vault configuration"
      subtitle={`${header.title} • ${header.vaultAddress}`}
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <FeedbackBanner feedback={feedback} />

        {!canManage ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
            Only the vault owner can change onchain configuration.
          </div>
        ) : null}

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="space-y-2 text-sm">
            <Row label="Owner" value={details?.owner || "—"} mono />
            <Row label="Strategy ID" value={String(details?.strategyId || 0)} />
            <Row label="Reward token" value={status?.gauge_rewards.reward_token || "—"} mono />
          </div>
        </div>

        <SectionCard
          title="Automation toggle"
          actionLabel={feedback.kind === "loading" ? "Saving..." : "Save Toggle"}
          onAction={onSaveAutomationToggle}
          disabled={!canManage || feedback.kind === "loading"}
        >
          <ToggleRow
            label="Automation enabled"
            checked={form.automationEnabled}
            onChange={(next) => onChangeField("automationEnabled", next)}
          />
        </SectionCard>

        <SectionCard
          title="Automation config"
          actionLabel={feedback.kind === "loading" ? "Saving..." : "Save Automation"}
          onAction={onSaveAutomationConfig}
          disabled={!canManage || feedback.kind === "loading"}
        >
          <InputRow
            label="Cooldown (seconds)"
            type="number"
            value={form.cooldownSec}
            onChange={(next) => onChangeField("cooldownSec", Number(next || 0))}
          />
          <InputRow
            label="Max slippage (bps)"
            type="number"
            value={form.maxSlippageBps}
            onChange={(next) => onChangeField("maxSlippageBps", Number(next || 0))}
          />
          <ToggleRow
            label="Allow swap"
            checked={form.allowSwap}
            onChange={(next) => onChangeField("allowSwap", next)}
          />
        </SectionCard>

        <SectionCard
          title="Daily harvest"
          actionLabel={feedback.kind === "loading" ? "Saving..." : "Save Daily Harvest"}
          onAction={onSaveDailyHarvestConfig}
          disabled={!canManage || feedback.kind === "loading"}
        >
          <ToggleRow
            label="Daily harvest enabled"
            checked={form.dailyHarvestEnabled}
            onChange={(next) => onChangeField("dailyHarvestEnabled", next)}
          />
          <InputRow
            label="Cooldown (seconds)"
            type="number"
            value={form.dailyHarvestCooldownSec}
            onChange={(next) => onChangeField("dailyHarvestCooldownSec", Number(next || 0))}
          />
        </SectionCard>

        <SectionCard
          title="Compound"
          actionLabel={feedback.kind === "loading" ? "Saving..." : "Save Compound"}
          onAction={onSaveCompoundConfig}
          disabled={!canManage || feedback.kind === "loading"}
        >
          <ToggleRow
            label="Compound enabled"
            checked={form.compoundEnabled}
            onChange={(next) => onChangeField("compoundEnabled", next)}
          />
          <InputRow
            label="Cooldown (seconds)"
            type="number"
            value={form.compoundCooldownSec}
            onChange={(next) => onChangeField("compoundCooldownSec", Number(next || 0))}
          />
        </SectionCard>

        <SectionCard
          title="Reward swap"
          actionLabel={feedback.kind === "loading" ? "Saving..." : "Save Reward Swap"}
          onAction={onSaveRewardSwapConfig}
          disabled={!canManage || feedback.kind === "loading"}
        >
          <ToggleRow
            label="Reward swap enabled"
            checked={form.rewardSwapEnabled}
            onChange={(next) => onChangeField("rewardSwapEnabled", next)}
          />
          <InputRow
            label="tokenIn"
            value={form.rewardSwapTokenIn}
            onChange={(next) => onChangeField("rewardSwapTokenIn", next)}
          />
          <InputRow
            label="tokenOut"
            value={form.rewardSwapTokenOut}
            onChange={(next) => onChangeField("rewardSwapTokenOut", next)}
          />
          <InputRow
            label="Fee"
            type="number"
            value={form.rewardSwapFee}
            onChange={(next) => onChangeField("rewardSwapFee", Number(next || 0))}
          />
          <InputRow
            label="sqrtPriceLimitX96"
            value={form.rewardSwapSqrtPriceLimitX96}
            onChange={(next) => onChangeField("rewardSwapSqrtPriceLimitX96", next)}
            placeholder="0"
          />
        </SectionCard>
      </div>
    </DrawerShell>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm text-slate-200 ${mono ? "font-mono break-all" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}