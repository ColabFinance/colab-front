import React from "react";
import { PageHeader } from "@/presentation/shell/PageHeader";
import { Button } from "@/presentation/components/Button";
import { Icon } from "@/presentation/icons/Icon";

import { CoreContractsCard } from "./ui/CoreContractsCard";
import { RegistryCountsCard } from "./ui/RegistryCountsCard";
import { ProtocolFeesCard } from "./ui/ProtocolFeesCard";
import { HealthAlertsCard } from "./ui/HealthAlertsCard";
import { RecentActivityTable } from "./ui/RecentActivityTable";
import { QuickActionsGrid } from "./ui/QuickActionsGrid";

export default function AdminOverviewScreen() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Overview"
        subtitle="Global protocol health and configuration summary."
        badge={{ label: "Ethereum Mainnet", tone: "cyan" }}
        right={
          <>
            <Button
              href="/admin/protocol-fees"
              variant="secondary"
              leftIcon={<Icon name="fees" className="h-4 w-4 text-cyan-300" />}
            >
              Withdraw Fees
            </Button>
            <Button
              href="/admin/onchain-config"
              variant="secondary"
              leftIcon={<Icon name="sliders" className="h-4 w-4 text-cyan-300" />}
            >
              On-chain Config
            </Button>
            <Button
              href="/admin/contracts"
              variant="primary"
              leftIcon={<Icon name="rocket" className="h-4 w-4" />}
            >
              Deploy / Registry
            </Button>
          </>
        }
      />

      {/* Row 1 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 lg:gap-6">
        <CoreContractsCard />
        <RegistryCountsCard />
        <ProtocolFeesCard className="md:col-span-2" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <HealthAlertsCard />
        <div className="lg:col-span-2">
          <RecentActivityTable />
        </div>
      </div>

      {/* Row 3 */}
      <QuickActionsGrid />

      <div className="mt-8 border-t border-slate-800/50 pt-8 pb-4 text-center text-xs text-slate-600">
        <p>&copy; 2024 Protocol Admin Dashboard. All actions are recorded on-chain.</p>
      </div>
    </div>
  );
}