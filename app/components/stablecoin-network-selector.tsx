"use client";

import { useState } from "react";
import { StablecoinSymbol } from "@/types/stablecoin";
import {
  getSupportedNetworks,
  getAvailableStablecoinsForNetwork,
  getStablecoinConfig,
} from "@/utils/stablecoin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StablecoinNetworkSelectorProps {
  onNetworkChange: (chainId: number) => void;
  onStablecoinChange: (stablecoin: StablecoinSymbol) => void;
  selectedNetwork: number;
  selectedStablecoin: StablecoinSymbol;
}

export function StablecoinNetworkSelector({
  onNetworkChange,
  onStablecoinChange,
  selectedNetwork,
  selectedStablecoin,
}: StablecoinNetworkSelectorProps) {
  const networks = getSupportedNetworks();
  const availableStablecoins = getAvailableStablecoinsForNetwork(selectedNetwork);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="network">Blockchain Network</Label>
        <Select
          value={selectedNetwork.toString()}
          onValueChange={(value) => {
            const chainId = parseInt(value);
            onNetworkChange(chainId);
            // Reset stablecoin if not available on new network
            if (!getAvailableStablecoinsForNetwork(chainId).includes(selectedStablecoin)) {
              onStablecoinChange(getAvailableStablecoinsForNetwork(chainId)[0] as StablecoinSymbol);
            }
          }}
        >
          <SelectTrigger id="network">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            {networks.map((network) => (
              <SelectItem key={network.chainId} value={network.chainId.toString()}>
                {network.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stablecoin">Stablecoin</Label>
        <Select
          value={selectedStablecoin}
          onValueChange={(value) => onStablecoinChange(value as StablecoinSymbol)}
        >
          <SelectTrigger id="stablecoin">
            <SelectValue placeholder="Select stablecoin" />
          </SelectTrigger>
          <SelectContent>
            {availableStablecoins.map((coin) => {
              const config = getStablecoinConfig(coin);
              return (
                <SelectItem key={coin} value={coin}>
                  {config.symbol} - {config.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
