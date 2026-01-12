"use client";

import { StablecoinSymbol } from "@/types/stablecoin";
import {
  getStablecoinConfig,
  getAvailableStablecoinsForNetwork,
} from "@/utils/stablecoin";
import { Badge } from "@/components/ui/badge";

interface StablecoinInfoProps {
  stablecoin: StablecoinSymbol;
  chainId: number;
}

export function StablecoinInfo({ stablecoin, chainId }: StablecoinInfoProps) {
  const config = getStablecoinConfig(stablecoin);
  const isAvailable = getAvailableStablecoinsForNetwork(chainId).includes(stablecoin);

  if (!isAvailable) {
    return (
      <div className="text-sm text-destructive font-medium">
        {stablecoin} is not available on this network
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border border-border bg-card/50 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground">{config.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
        </div>
        <Badge variant="secondary" className="text-xs font-medium">{config.symbol}</Badge>
      </div>
      <div className="text-xs text-muted-foreground">
        Decimals: {config.decimals}
      </div>
    </div>
  );
}
