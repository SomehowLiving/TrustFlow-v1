import { Address } from "viem";
import { stablecoinsConfig, chainsConfig } from "@/config/site";
import { StablecoinSymbol } from "@/types/stablecoin";

/**
 * Get stablecoin configuration by symbol
 */
export const getStablecoinConfig = (symbol: StablecoinSymbol) => {
    return stablecoinsConfig[symbol];
};

/**
 * Get available stablecoins for a specific network
 */
export const getAvailableStablecoinsForNetwork = (
    chainId: number
): StablecoinSymbol[] => {
    const networkConfig = chainsConfig.find(
        (config) => config.chain.id === chainId
    );
    if (!networkConfig) return [];

    return Object.entries(networkConfig.contracts.tokens)
        .filter(([, address]) => address !== "0x0000000000000000000000000000000000000000")
        .map(([symbol]) => symbol as StablecoinSymbol);
};

/**
 * Get token address for a stablecoin on a specific network
 */
export const getTokenAddressForNetwork = (
    stablecoin: StablecoinSymbol,
    chainId: number
): Address | null => {
    const networkConfig = chainsConfig.find(
        (config) => config.chain.id === chainId
    );
    if (!networkConfig) return null;

    const address = networkConfig.contracts.tokens[stablecoin];
    if (!address || address === "0x0000000000000000000000000000000000000000") {
        return null;
    }

    return address as Address;
};

/**
 * Get all supported networks
 */
export const getSupportedNetworks = () => {
    return chainsConfig.map((config) => ({
        chainId: config.chain.id,
        name: config.chain.name,
        chain: config.chain,
    }));
};

/**
 * Format stablecoin amount based on decimals
 */
export const formatStablecoinAmount = (
    amount: bigint,
    decimals: number
): string => {
    const divisor = BigInt(10) ** BigInt(decimals);
    const wholePart = amount / divisor;
    const fractionalPart = amount % divisor;

    if (fractionalPart === 0n) {
        return wholePart.toString();
    }

    const fractionalStr = fractionalPart
        .toString()
        .padStart(decimals, "0")
        .replace(/0+$/, "");
    return `${wholePart}.${fractionalStr}`;
};

/**
 * Parse stablecoin amount string to bigint
 */
export const parseStablecoinAmount = (
    amount: string,
    decimals: number
): bigint => {
    const [wholePart, fractionalPart = ""] = amount.split(".");
    const fractionalStr = fractionalPart.padEnd(decimals, "0").slice(0, decimals);
    return BigInt(wholePart + fractionalStr);
};
