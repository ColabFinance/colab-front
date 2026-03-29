type Props = {
  selectedAccount: string;
  selectedStatus: string;
  accounts: string[];
  statusOptions: string[];
  onChangeAccount: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onRefresh: () => void;
};

function formatStatusLabel(value: string) {
  const raw = String(value || "").trim().toUpperCase();
  if (raw === "ACTIVE") return "Active";
  if (raw === "INACTIVE") return "Inactive";
  if (raw === "PAUSED") return "Paused";
  if (raw === "FAILED") return "Failed";
  if (!raw) return "-";
  return raw.charAt(0) + raw.slice(1).toLowerCase();
}

export function TradeHomeHeader({
  selectedAccount,
  selectedStatus,
  accounts,
  statusOptions,
  onChangeAccount,
  onChangeStatus,
  onRefresh,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
          Trade Home
        </h1>
        <p className="text-slate-400 text-xs md:text-sm mt-1">
          Operational overview of the trade module
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
        <div className="relative">
          <select
            value={selectedAccount}
            onChange={(e) => onChangeAccount(e.target.value)}
            className="pl-3 pr-10 py-2 text-sm border border-slate-700 bg-slate-900 text-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Accounts</option>
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <i className="fa-solid fa-chevron-down text-xs" />
          </div>
        </div>

        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onChangeStatus(e.target.value)}
            className="pl-3 pr-10 py-2 text-sm border border-slate-700 bg-slate-900 text-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatStatusLabel(status)}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <i className="fa-solid fa-chevron-down text-xs" />
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-rotate" />
          Refresh
        </button>
      </div>
    </div>
  );
}