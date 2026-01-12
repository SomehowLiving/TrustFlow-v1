/**
 * Supported stablecoins for TrustFlow payments
 */
export type StablecoinSymbol = "MNEE" | "USDT" | "USDC";

export interface Stablecoin {
    name: string;
    symbol: StablecoinSymbol;
    description: string;
    decimals: number;
}

export interface StablecoinBalance {
    symbol: StablecoinSymbol;
    balance: bigint;
    decimals: number;
    formattedBalance: string;
}

export interface PaymentRequest {
    stablecoin: StablecoinSymbol;
    amount: string;
    recipientName: string;
    networkId?: number;
}

export interface PaymentResult {
    success: boolean;
    stablecoin: StablecoinSymbol;
    amount: string;
    recipient: string;
    transactionHash?: string;
    error?: string;
}
