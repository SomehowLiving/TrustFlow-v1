export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "TrustFlow",
  description:
    "Guard-railed AI agents with policy-constrained programmable money. Safe autonomous payments using MNEE, USDT, and other stablecoins across multiple networks",
  links: {
    github: "https://github.com/SomehowLiving/TrustFlow-v1",
    twitter: "https://twitter.com",
  },
};

// Supported stablecoins configuration
export const stablecoinsConfig = {
  MNEE: {
    name: "MNEE",
    symbol: "MNEE",
    description: "USD-backed stablecoin",
    decimals: 18,
  },
  USDT: {
    name: "Tether USD",
    symbol: "USDT",
    description: "USDT Stablecoin",
    decimals: 6,
  },
  USDC: {
    name: "USD Coin",
    symbol: "USDC",
    description: "USDC Stablecoin",
    decimals: 6,
  },
};

// Re-export chains config for convenience
export { chainsConfig, getNetworkConfig } from "./chains";
