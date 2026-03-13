"use client";

import React from "react";
import type { VaultStatus } from "@/core/domain/vault/status";
import type { VaultFeeBufferBalances } from "@/core/domain/vault/feeBuffer";
import { ActionFeedback, DepositAssetOption, VaultDrawerKey, VaultHeaderView } from "../types";
import { DrawerShell } from "./DrawerShell";

type Props = {
  openDrawer: VaultDrawerKey;
  onClose: () => void;
  canManage: boolean;
  header: VaultHeaderView;
  status: VaultStatus | null;
  feeBuffer: VaultFeeBufferBalances | null;

  depositAssets: DepositAssetOption[];
  selectedDepositAsset: DepositAssetOption | null;
  depositAssetAddress: string;
  onChangeDepositAssetAddress: (next: string) => void;
  depositAmount: string;
  onChangeDepositAmount: (next: string) => void;
  onSubmitDeposit: () => void;

  onSubmitWithdrawAll: () => void;

  feedback: ActionFeedback;
};

function shortAddress(value?: string | null) {
  if (!value) return "—";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

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
        <div className="mt-2 break-all font-mono text-xs">{feedback.txHash}</div>
      ) : null}
    </div>
  );
}

function FooterButtons({
  primaryLabel,
  onCancel,
  onConfirm,
  disabled,
}: {
  primaryLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {primaryLabel}
      </button>
    </div>
  );
}

export function ActionDrawers({
  openDrawer,
  onClose,
  canManage,
  header,
  status,
  feeBuffer,
  depositAssets,
  selectedDepositAsset,
  depositAssetAddress,
  onChangeDepositAssetAddress,
  depositAmount,
  onChangeDepositAmount,
  onSubmitDeposit,
  onSubmitWithdrawAll,
  feedback,
}: Props) {
  const subtitle = `${header.pairLabel} • ${header.vaultAddress}`;

  return (
    <>
      <DrawerShell
        open={openDrawer === "deposit"}
        onClose={onClose}
        title="Deposit"
        subtitle={subtitle}
        footer={
          <FooterButtons
            primaryLabel={feedback.kind === "loading" ? "Submitting..." : "Confirm Deposit"}
            onCancel={onClose}
            onConfirm={onSubmitDeposit}
            disabled={!canManage || feedback.kind === "loading"}
          />
        }
      >
        <div className="space-y-6">
          <FeedbackBanner feedback={feedback} />

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <label className="block text-xs uppercase tracking-wide text-slate-500">
              Select token
            </label>

            <select
              value={depositAssetAddress}
              onChange={(event) => onChangeDepositAssetAddress(event.target.value)}
              className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-500"
            >
              {depositAssets.map((asset) => (
                <option key={asset.address} value={asset.address}>
                  {asset.symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <label className="block text-xs uppercase tracking-wide text-slate-500">
              Amount
            </label>

            <input
              type="number"
              value={depositAmount}
              onChange={(event) => onChangeDepositAmount(event.target.value)}
              placeholder="0.0"
              className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-lg font-mono text-white outline-none transition focus:border-cyan-500"
            />

            <div className="mt-2 text-xs text-slate-500">
              Direct ERC20 transfer into the vault address.
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="space-y-2">
              <Row label="Destination Vault" value={header.vaultAddress} mono />
              <Row label="Selected Token" value={selectedDepositAsset?.symbol || "—"} />
              <Row label="Current Pair" value={header.pairLabel} />
            </div>
          </div>
        </div>
      </DrawerShell>

      <DrawerShell
        open={openDrawer === "withdraw"}
        onClose={onClose}
        title="Withdraw All"
        subtitle={subtitle}
        footer={
          <FooterButtons
            primaryLabel={feedback.kind === "loading" ? "Submitting..." : "Exit Position & Withdraw All"}
            onCancel={onClose}
            onConfirm={onSubmitWithdrawAll}
            disabled={!canManage || feedback.kind === "loading"}
          />
        }
      >
        <div className="space-y-6">
          <FeedbackBanner feedback={feedback} />

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            The current contract does not expose partial withdrawals. This action exits the
            position and withdraws all vault balances back to the owner wallet.
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="space-y-2">
              <Row label="Vault" value={header.vaultAddress} mono />
              <Row label="Owner action" value="exitPositionAndWithdrawAll" mono />
              <Row label="Current token0" value={status?.token0.symbol || "—"} />
              <Row label="Current token1" value={status?.token1.symbol || "—"} />
            </div>
          </div>
        </div>
      </DrawerShell>

      <DrawerShell
        open={openDrawer === "compoundBuffer"}
        onClose={onClose}
        title="Compound Fee Buffer"
        subtitle={subtitle}
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-700"
            >
              Close
            </button>

            <button
              type="button"
              disabled
              className="flex-1 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-300 opacity-70"
            >
              Coming Soon
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
            This drawer previews what is currently available in the fee buffer to be compounded
            back into the vault. The action is not enabled yet.
          </div>

          {!canManage ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
              Only the vault owner will be able to run this action when it is enabled.
            </div>
          ) : null}

          {feeBuffer ? (
            <>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="space-y-2">
                  <Row label="Vault" value={feeBuffer.vault} mono />
                  <Row label="Fee Buffer" value={feeBuffer.feeBufferAddress} mono />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <BufferPreviewCard
                  symbol={feeBuffer.token0.symbol}
                  address={feeBuffer.token0.address}
                  formatted={feeBuffer.token0.formatted}
                />

                <BufferPreviewCard
                  symbol={feeBuffer.token1.symbol}
                  address={feeBuffer.token1.address}
                  formatted={feeBuffer.token1.formatted}
                />

                {feeBuffer.reward ? (
                  <BufferPreviewCard
                    symbol={feeBuffer.reward.symbol}
                    address={feeBuffer.reward.address}
                    formatted={feeBuffer.reward.formatted}
                    tone="cyan"
                  />
                ) : null}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-400">
              Fee buffer balances are unavailable for this vault.
            </div>
          )}
        </div>
      </DrawerShell>
    </>
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
      <span className={`text-sm text-slate-200 ${mono ? "break-all font-mono" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}

function BufferPreviewCard({
  symbol,
  address,
  formatted,
  tone = "slate",
}: {
  symbol: string;
  address: string;
  formatted: string;
  tone?: "slate" | "cyan";
}) {
  const palette =
    tone === "cyan"
      ? "border-cyan-500/20 bg-cyan-500/5"
      : "border-slate-800 bg-slate-950/60";

  return (
    <div className={`rounded-xl border p-4 ${palette}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">{symbol}</div>
          <div className="mt-1 text-xs text-slate-500">{shortAddress(address)}</div>
        </div>

        <div className="text-right">
          <div className="text-sm font-mono text-white">{formatted}</div>
          <div className="mt-1 text-[11px] text-slate-500">Will enter the vault</div>
        </div>
      </div>
    </div>
  );
}