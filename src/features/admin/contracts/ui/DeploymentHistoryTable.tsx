import type { RuntimeContractRecord } from "../types";
import { CopyIcon, ExternalLinkIcon, FolderOpenIcon } from "./icons";

type Props = {
  contractName: string;
  chainLabel: string;
  history: RuntimeContractRecord[];
};

function copyText(value: string) {
  if (typeof navigator === "undefined") return;
  navigator.clipboard.writeText(value).catch(() => {});
}

function statusClass(status: RuntimeContractRecord["status"]) {
  if (status === "active") {
    return "border border-green-500/20 bg-green-500/10 text-green-400";
  }

  if (status === "deprecated") {
    return "border border-slate-500/20 bg-slate-500/10 text-slate-400";
  }

  return "border border-amber-500/20 bg-amber-500/10 text-amber-300";
}

function statusDot(status: RuntimeContractRecord["status"]) {
  if (status === "active") return "bg-green-500";
  if (status === "deprecated") return "bg-slate-500";
  return "bg-amber-400";
}

function statusLabel(status: RuntimeContractRecord["status"]) {
  if (status === "active") return "Active";
  if (status === "deprecated") return "Deprecated";
  return "Inactive";
}

export default function DeploymentHistoryTable({
  contractName,
  chainLabel,
  history,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 bg-slate-950/30 px-6 py-4">
        <h3 className="text-sm font-bold text-white">Deployment History</h3>
        <p className="mt-0.5 text-xs text-slate-400">
          Runtime records for {contractName} on {chainLabel}
        </p>
      </div>

      {history.length === 0 ? (
        <div className="p-12 text-center">
          <FolderOpenIcon size={38} className="mx-auto mb-4 text-slate-600" />
          <p className="text-sm text-slate-400">No deployment history available</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Tx Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Updated
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {history.map((record) => (
                <tr
                  key={`${record.address}-${record.txHash || "no-tx"}`}
                  className="transition-colors hover:bg-slate-800/40"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "font-mono text-sm",
                          record.status === "active" ? "text-cyan-400" : "text-slate-400",
                        ].join(" ")}
                      >
                        {record.address}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyText(record.address)}
                        className="text-slate-500 hover:text-white"
                      >
                        <CopyIcon size={14} />
                      </button>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={[
                        "inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium",
                        statusClass(record.status),
                      ].join(" ")}
                    >
                      <span className={["h-2 w-2 rounded-full", statusDot(record.status)].join(" ")} />
                      {statusLabel(record.status)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-slate-300">
                        {record.txHash || "Not available"}
                      </span>
                      <a
                        href={record.txExplorerUrl || "#"}
                        className="text-slate-500 hover:text-cyan-400"
                      >
                        <ExternalLinkIcon size={14} />
                      </a>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                    {record.createdAtLabel}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                    {record.updatedAtLabel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}