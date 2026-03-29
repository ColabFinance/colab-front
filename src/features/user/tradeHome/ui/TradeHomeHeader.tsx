type Props = {
  selectedAccount: string;
  selectedStatus: string;
  accounts: string[];
  onChangeAccount: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onRefresh: () => void;
};

export function TradeHomeHeader({
  selectedAccount,
  selectedStatus,
  accounts,
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
            className="pl-3 pr-10 py-2 text-sm border border-slate-700 bg-slate-900 text-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
            className="pl-3 pr-10 py-2 text-sm border border-slate-700 bg-slate-900 text-slate-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="failed">Failed</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <i className="fa-solid fa-chevron-down text-xs" />
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-rotate" />
          Refresh
        </button>
      </div>
    </div>
  );
}