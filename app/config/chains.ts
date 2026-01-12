import { Address } from "viem";
import { baseSepolia, sepolia } from "viem/chains";

export interface NetworkConfig {
  chain: any;
  contracts: {
    erc20Factory: Address;
    mneePolicy?: Address;
    tokens: Record<string, Address>;
  };
}

export const chainsConfig: NetworkConfig[] = [
  {
    chain: baseSepolia,
    contracts: {
      erc20Factory: "0x4f316c6536ce3ee94de802a9efdb20484ec4bdf9" as Address,
      tokens: {
        MNEE: "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" as Address,
        USDT: "0x0000000000000000000000000000000000000000" as Address,
        USDC: "0x0000000000000000000000000000000000000000" as Address,
      },
    },
  },
  {
    chain: sepolia,
    contracts: {
      erc20Factory: "0x0000000000000000000000000000000000000000" as Address,
      mneePolicy: "0xB7BdA0b6a477db6c370B6e83311Efe1092Ba6a08" as Address,
      tokens: {
        MNEE: "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" as Address,
        USDT: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0" as Address,
        USDC: "0x0000000000000000000000000000000000000000" as Address,
      },
    },
  },
  {
    chain: sepolia,
    contracts: {
      erc20Factory: "0x0000000000000000000000000000000000000000" as Address,
      tokens: {
        MNEE: "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" as Address,
        USDT: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0" as Address,
        USDC: "0x0000000000000000000000000000000000000000" as Address,
      },
    },
  },
];

// Helper function to get network config by chain ID
export const getNetworkConfig = (chainId: number): NetworkConfig | undefined => {
  return chainsConfig.find((config) => config.chain.id === chainId);
};
