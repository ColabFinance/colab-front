export const ProtocolFeeCollectorAbi = [
  // --- reads ---
  "function treasury() view returns (address)",
  "function protocolFeeBps() view returns (uint16)",
  "function authorizedReporter(address reporter) view returns (bool)",
  "function totalByToken(address token) view returns (uint256)",
  "function strategyByToken(uint256 strategyId, address token) view returns (uint256)",
  "function owner() view returns (address)",

  // --- owner-only configuration ---
  "function setTreasury(address newTreasury)",
  "function setProtocolFeeBps(uint16 newBps)",
  "function setReporter(address reporter, bool authorized)",

  // --- fee reporting ---
  "function reportFees(uint256 strategyId, address token, uint256 amount)",

  // --- withdrawals ---
  "function withdrawFees(address token, uint256 amount, address to)",

  // --- events (optional for UI logs, not required to call) ---
  "event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury)",
  "event ProtocolFeeBpsUpdated(uint16 oldBps, uint16 newBps)",
  "event ReporterAuthorizationUpdated(address indexed reporter, bool authorized)",
  "event FeesReported(address indexed reporter, uint256 indexed strategyId, address indexed token, uint256 amount)",
  "event FeesWithdrawn(address indexed token, address indexed to, uint256 amount)",
];
