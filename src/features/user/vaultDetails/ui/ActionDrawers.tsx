"use client";

import React from "react";
import { ClaimSummary, DrawerAssetOption, VaultDrawerKey } from "../types";
import { DrawerShell } from "./DrawerShell";

type Props = {
  openDrawer: VaultDrawerKey;
  onClose: () => void;

  vaultName: string;
  vaultAddress: string;
  viewerWallet: string;

  depositAssets: DrawerAssetOption[];
  selectedDepositAssetSymbol: string;
  onChangeDepositAssetSymbol: (next: string) => void;
  selectedDepositAsset: DrawerAssetOption;
  depositAmount: string;
  onChangeDepositAmount: (next: string) => void;
  onMaxDeposit: () => void;

  withdrawAssets: DrawerAssetOption[];
  selectedWithdrawAssetSymbol: string;
  onChangeWithdrawAssetSymbol: (next: string) => void;
  selectedWithdrawAsset: DrawerAssetOption;
  withdrawAmount: string;
  onChangeWithdrawAmount: (next: string) => void;
  onMaxWithdraw: () => void;

  claim: ClaimSummary;
};

export function ActionDrawers({
  openDrawer,
  onClose,
  vaultName,
  vaultAddress,
  viewerWallet,

  depositAssets,
  selectedDepositAssetSymbol,
  onChangeDepositAssetSymbol,
  selectedDepositAsset,
  depositAmount,
  onChangeDepositAmount,
  onMaxDeposit,

  withdrawAssets,
  selectedWithdrawAssetSymbol,
  onChangeWithdrawAssetSymbol,
  selectedWithdrawAsset,
  withdrawAmount,
  onChangeWithdrawAmount,
  onMaxWithdraw,

  claim,
}: Props) {
  const subtitle = `${vaultName} • ${shortHash(vaultAddress)}`;

  return (
    <>
      <DrawerShell
        open={openDrawer === "deposit"}
        onClose={onClose}
        title="Deposit"
        subtitle={subtitle}
        footer={
          <FooterButtons
            primaryLabel="Review Deposit"
            onCancel={onClose}
            onConfirm={onClose}
          />
        }
      >
        <div className="space-y-6">
          <AssetSelector
            label="Select token"
            assets={depositAssets}
            value={selectedDepositAssetSymbol}
            onChange={onChangeDepositAssetSymbol}
          />

          <AmountInput
            label="Amount"
            value={depositAmount}
            onChange={onChangeDepositAmount}
            onMax={onMaxDeposit}
            balanceLabel={selectedDepositAsset.balanceLabel}
            usdLabel={selectedDepositAsset.usdLabel}
          />

          <SummaryCard
            items={[
              ["Destination", shortHash(vaultAddress)],
              ["Connected wallet", shortHash(viewerWallet)],
              ["Selected token", selectedDepositAsset.label],
            ]}
          />

          <InfoBox>
            Deposited funds go into this vault contract and remain managed under the vault
            strategy lifecycle.
          </InfoBox>
        </div>
      </DrawerShell>

      <DrawerShell
        open={openDrawer === "withdraw"}
        onClose={onClose}
        title="Withdraw"
        subtitle={subtitle}
        footer={
          <FooterButtons
            primaryLabel="Review Withdraw"
            onCancel={onClose}
            onConfirm={onClose}
          />
        }
      >
        <div className="space-y-6">
          <AssetSelector
            label="Select token"
            assets={withdrawAssets}
            value={selectedWithdrawAssetSymbol}
            onChange={onChangeWithdrawAssetSymbol}
          />

          <AmountInput
            label="Amount"
            value={withdrawAmount}
            onChange={onChangeWithdrawAmount}
            onMax={onMaxWithdraw}
            balanceLabel={selectedWithdrawAsset.balanceLabel}
            usdLabel={selectedWithdrawAsset.usdLabel}
          />

          <SummaryCard
            items={[
              ["Source vault", shortHash(vaultAddress)],
              ["Receiving wallet", shortHash(viewerWallet)],
              ["Selected token", selectedWithdrawAsset.label],
            ]}
          />

          <InfoBox>
            Withdrawn assets return to the owner wallet from this vault contract.
          </InfoBox>
        </div>
      </DrawerShell>

      <DrawerShell
        open={openDrawer === "claim"}
        onClose={onClose}
        title="Claim Rewards"
        subtitle={subtitle}
        footer={
          <FooterButtons
            primaryLabel="Review Claim"
            onCancel={onClose}
            onConfirm={onClose}
          />
        }
      >
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Pending reward</div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {claim.pendingAmountLabel}
            </div>
            <div className="mt-1 text-sm text-cyan-300">{claim.pendingUsdLabel}</div>
          </div>

          <SummaryCard
            items={[
              ["Reward token", claim.rewardSymbol],
              ["Destination wallet", shortHash(claim.destinationWallet)],
              ["In vault balance", claim.inVaultAmountLabel],
            ]}
          />

          <InfoBox>
            Rewards are claimed from the vault reward flow and sent to the owner wallet.
          </InfoBox>
        </div>
      </DrawerShell>
    </>
  );
}

function AssetSelector({
  label,
  assets,
  value,
  onChange,
}: {
  label: string;
  assets: DrawerAssetOption[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <label className="block text-xs uppercase tracking-wide text-slate-500">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-500"
      >
        {assets.map((asset) => (
          <option key={asset.symbol} value={asset.symbol}>
            {asset.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function AmountInput({
  label,
  value,
  onChange,
  onMax,
  balanceLabel,
  usdLabel,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  onMax: () => void;
  balanceLabel: string;
  usdLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs uppercase tracking-wide text-slate-500">{label}</label>
        <button
          type="button"
          onClick={onMax}
          className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-cyan-300 transition hover:border-slate-600 hover:bg-slate-800"
        >
          MAX
        </button>
      </div>

      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="0.0"
        className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-lg font-mono text-white outline-none transition focus:border-cyan-500"
      />

      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>{balanceLabel}</span>
        {usdLabel ? <span>{usdLabel}</span> : null}
      </div>
    </div>
  );
}

function SummaryCard({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="space-y-2">
        {items.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-200">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 px-4 py-4 text-sm text-cyan-100">
      {children}
    </div>
  );
}

function FooterButtons({
  primaryLabel,
  onCancel,
  onConfirm,
}: {
  primaryLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
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
        className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-cyan-500"
      >
        {primaryLabel}
      </button>
    </div>
  );
}

function shortHash(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}