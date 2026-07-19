import type { Chain } from "viem";

/**
 * Arc Testnet — network parameters per https://docs.arc.io/arc/references/connect-to-arc
 * Chain ID 5042002 (0x4cef52). USDC is the native gas token (18 decimals on the native/gas
 * side; the optional ERC-20 interface at 0x3600...0000 reports 6 decimals — always read
 * `decimals()` from the contract instead of hardcoding it in production code).
 */
export const arcTestnet = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { name: "USD Coin", symbol: "USDC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
    public: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: "https://testnet.arcscan.app" },
  },
  testnet: true,
} as const satisfies Chain;

/** Ethereum Sepolia — common bridge counterpart used in the Arc/App Kit quickstarts. */
export const ethereumSepolia = {
  id: 11155111,
  name: "Ethereum Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://ethereum-sepolia-rpc.publicnode.com"] },
    public: { http: ["https://ethereum-sepolia-rpc.publicnode.com"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
  },
  testnet: true,
} as const satisfies Chain;

export const baseSepolia = {
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.base.org"] },
    public: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: { default: { name: "Basescan", url: "https://sepolia.basescan.org" } },
  testnet: true,
} as const satisfies Chain;

export const SUPPORTED_CHAINS = [arcTestnet, ethereumSepolia, baseSepolia] as const;

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]["id"];

/** Known token contract references on Arc Testnet — verify against
 *  https://docs.arc.io/arc/references/contract-addresses before mainnet use. */
export const ARC_TOKENS = {
  USDC: {
    address: "0x3600000000000000000000000000000000000000" as const,
    symbol: "USDC",
    decimals: 6,
    name: "USD Coin",
  },
  EURC: {
    address: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a" as const,
    symbol: "EURC",
    decimals: 6,
    name: "Euro Coin",
  },
} as const;

export const FAUCET_URL = "https://faucet.circle.com";
export const ARC_DOCS_URL = "https://docs.arc.io";
export const CIRCLE_CONSOLE_URL = "https://console.circle.com";

export const APP_NAME = "ArcWay";
