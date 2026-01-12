# TrustFlow Migration Guide for Developers

## Overview
This guide explains the changes made during the pivot from "Agent 4 Your Mom" to "TrustFlow" and how to use the new multi-network, multi-stablecoin features.

## Core Concept Change

### Before (Agent 4 Your Mom)
- Single network (Base Sepolia)
- Single USD token contract address
- Fixed to specific USDT token

### After (TrustFlow)
- Multiple networks (Base Sepolia, Ethereum Sepolia, Sepolia)
- Dynamic stablecoin support (MNEE, USDT, USDC)
- Network-aware token resolution
- Policy-constrained payment enforcement

## Configuration Files

### Using the Stablecoins Config

```typescript
import { stablecoinsConfig } from "@/config/site";

// Get config for a specific stablecoin
const mneeConfig = stablecoinsConfig.MNEE;
console.log(mneeConfig.decimals); // 18
```

### Using the Network Config

```typescript
import { chainsConfig, getNetworkConfig } from "@/config/site";

// Get config for Ethereum Sepolia
const ethSepoliaConfig = getNetworkConfig(11155111);
console.log(ethSepoliaConfig?.contracts.tokens.MNEE); // Token address
```

## Utility Functions

### Get Available Stablecoins for a Network

```typescript
import { getAvailableStablecoinsForNetwork } from "@/utils/stablecoin";

const available = getAvailableStablecoinsForNetwork(84532); // Base Sepolia
// Returns: ["MNEE", "USDT", "USDC"]
```

### Get Token Address

```typescript
import { getTokenAddressForNetwork } from "@/utils/stablecoin";

const address = getTokenAddressForNetwork("MNEE", 11155111);
// Returns: 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
```

### Handle Decimal Conversions

```typescript
import { formatStablecoinAmount, parseStablecoinAmount } from "@/utils/stablecoin";

// Format: bigint → string
const amount = BigInt("1000000000000000000");
const formatted = formatStablecoinAmount(amount, 18); // "1"

// Parse: string → bigint
const parsed = parseStablecoinAmount("1.5", 6); // BigInt("1500000")
```

## Agent Action Provider

### Using the New Stablecoin Payment Action

The agent can now call:

```typescript
// Multi-stablecoin payment
await agent.executeStablecoinPayment({
  amount: 100,
  recipientName: "Alice",
  stablecoin: "MNEE" // or "USDT", "USDC"
});

// Traditional ERC20 transfer (still works)
await agent.transferErc20({
  amount: 100,
  contractAddress: "0x...",
  recipientName: "Alice",
  tokenSymbol: "MNEE"
});
```

### Provider Schema Updates

```typescript
import { ExecuteStablecoinPaymentSchema } from "@/action-providers/agent/schemas";

// Validates:
// - amount: number
// - recipientName: string
// - stablecoin: "MNEE" | "USDT" | "USDC"
```

## Component Usage

### Stablecoin Network Selector

```tsx
import { StablecoinNetworkSelector } from "@/components/stablecoin-network-selector";
import { useState } from "react";

export function MyComponent() {
  const [network, setNetwork] = useState(84532); // Base Sepolia
  const [stablecoin, setStablecoin] = useState("MNEE");

  return (
    <StablecoinNetworkSelector
      selectedNetwork={network}
      selectedStablecoin={stablecoin}
      onNetworkChange={setNetwork}
      onStablecoinChange={setStablecoin}
    />
  );
}
```

### Stablecoin Info Display

```tsx
import { StablecoinInfo } from "@/components/stablecoin-info";

export function MyComponent() {
  return (
    <StablecoinInfo stablecoin="MNEE" chainId={11155111} />
  );
}
```

## Type System

### New Types

```typescript
import { 
  StablecoinSymbol,
  Stablecoin,
  StablecoinBalance,
  PaymentRequest,
  PaymentResult
} from "@/types/stablecoin";

// Use in your components
function MyPayment(request: PaymentRequest) {
  // request.stablecoin: "MNEE" | "USDT" | "USDC"
  // request.amount: string
  // request.recipientName: string
}
```

## API Route Updates

If you have API routes that handled payments:

### Before
```typescript
// Old: Fixed USDT address
const tokenAddress = "0x1b21550f42e993d1b692d18d79bcd783638633f2";
```

### After
```typescript
// New: Dynamic resolution
import { getTokenAddressForNetwork } from "@/utils/stablecoin";

const tokenAddress = getTokenAddressForNetwork(stablecoin, chainId);
if (!tokenAddress) {
  return { error: "Stablecoin not available on this network" };
}
```

## Database Model Updates

If using MongoDB models, consider adding:

```typescript
// In Agent model
interface AgentConfig {
  supportedNetworks: number[];
  preferredStablecoin: StablecoinSymbol;
  allowedStablecoins: StablecoinSymbol[];
}
```

## Testing Stablecoins

### Test on Different Networks

```typescript
// Get all available test networks and their stablecoins
import { getSupportedNetworks } from "@/utils/stablecoin";
import { getAvailableStablecoinsForNetwork } from "@/utils/stablecoin";

const networks = getSupportedNetworks();
networks.forEach(network => {
  const coins = getAvailableStablecoinsForNetwork(network.chainId);
  console.log(`${network.name}: ${coins.join(", ")}`);
});
```

## Adding New Networks

To add a new network:

1. Update `app/config/chains.ts`:

```typescript
import { myChain } from "viem/chains";

export const chainsConfig: NetworkConfig[] = [
  // ... existing configs
  {
    chain: myChain,
    contracts: {
      erc20Factory: "0x...",
      tokens: {
        MNEE: "0x...",
        USDT: "0x...",
        USDC: "0x...",
      },
    },
  },
];
```

2. Tokens automatically appear in UI selectors

## Adding New Stablecoins

To add a new stablecoin:

1. Update `app/config/site.ts`:

```typescript
export const stablecoinsConfig = {
  // ... existing
  DAI: {
    name: "Dai Stablecoin",
    symbol: "DAI",
    description: "Decentralized stablecoin",
    decimals: 18,
  },
};
```

2. Update `app/types/stablecoin.ts` union type:

```typescript
export type StablecoinSymbol = "MNEE" | "USDT" | "USDC" | "DAI";
```

3. Update each network's token mapping in `chains.ts`

4. Update action schema in `schemas.ts`:

```typescript
export const ExecuteStablecoinPaymentSchema = z.object({
  // ...
  stablecoin: z.enum(["MNEE", "USDT", "USDC", "DAI"]),
});
```

## Troubleshooting

### Stablecoin Not Showing in Dropdown

- Check if token address is configured for the selected network in `chains.ts`
- Verify token address is not `0x0000000000000000000000000000000000000000`
- Check `getAvailableStablecoinsForNetwork()` returns the coin

### Network Not Showing

- Verify chain is added to `chainsConfig` in `chains.ts`
- Ensure `chain.id` is unique

### Decimal Conversion Issues

- Always use `getStablecoinConfig().decimals` for correct decimals
- Use utility functions `formatStablecoinAmount()` and `parseStablecoinAmount()`
- Don't hardcode decimals

## Summary

The TrustFlow pivot enables:
- ✅ Flexible multi-network deployment
- ✅ Multiple stablecoin support
- ✅ Policy-constrained payments
- ✅ Better type safety
- ✅ Easier to extend in future
