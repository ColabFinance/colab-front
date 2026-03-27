export const VaultFeeBufferAbi = [
  // --- reads ---
  "function balanceOf(address vault, address token) view returns (uint256)",
  "function authorizedDepositor(address depositor) view returns (bool)",
  "function owner() view returns (address)",

  // --- owner-only configuration ---
  "function setDepositor(address depositor, bool allowed)",

  // --- buffer operations (not needed for admin allowlist, but useful) ---
  "function depositFor(address vault, address token, uint256 amount)",
  "function withdrawTo(address token, uint256 amount, address to)",
  "function withdrawAllTo(address token, address to) returns (uint256)",

  // --- events ---
  "event DepositorAuthorizationUpdated(address indexed depositor, bool allowed)",
  "event Deposited(address indexed depositor, address indexed vault, address indexed token, uint256 amount)",
  "event Withdrawn(address indexed vault, address indexed token, address indexed to, uint256 amount)",
];
