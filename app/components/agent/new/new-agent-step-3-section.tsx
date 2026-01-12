"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useError from "@/hooks/use-error";
import { NewAgentRequestData } from "@/types/new-agent-request-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, Loader2Icon, NetworkIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getSupportedNetworks, getAvailableStablecoinsForNetwork } from "@/utils/stablecoin";
import { stablecoinsConfig, chainsConfig } from "@/config/site";

export function NewAgentStep3Section(props: {
  newAgentRequestData: NewAgentRequestData;
  onNewAgentRequestDataUpdate: (
    newAgentRequestData: NewAgentRequestData
  ) => void;
}) {
  const { handleError } = useError();
  const [isProsessing, setIsProsessing] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  
  const networks = getSupportedNetworks();
  const availableStablecoins = selectedChainId 
    ? getAvailableStablecoinsForNetwork(selectedChainId)
    : [];

  const formSchema = z.object({
    chainId: z.string().min(1),
    stablecoin: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chainId: networks[0]?.chainId.toString() || "",
      stablecoin: "MNEE",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsProsessing(true);
      const chainId = Number(values.chainId);
      const networkConfig = chainsConfig.find((c) => c.chain.id === chainId);
      const tokenAddress = networkConfig?.contracts.tokens[values.stablecoin as keyof typeof networkConfig.contracts.tokens];
      
      props.onNewAgentRequestDataUpdate({
        ...props.newAgentRequestData,
        chain: {
          id: chainId,
          stablecoin: values.stablecoin,
          tokenAddress: tokenAddress || "",
        },
      });
    } catch (error) {
      handleError(error, "Failed to submit the form, try again later");
    } finally {
      setIsProsessing(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 border border-accent/20">
            <NetworkIcon className="w-6 h-6 text-accent" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Network & Stablecoin</h1>
            <p className="text-sm text-muted-foreground">Step 3 of 5 — Select where to deploy and which stablecoin to use</p>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="chainId"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">Blockchain Network *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedChainId(Number(value));
                      const newAvailable = getAvailableStablecoinsForNetwork(Number(value));
                      if (newAvailable.length > 0) {
                        form.setValue("stablecoin", newAvailable[0]);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a network" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {networks.map((network) => (
                        <SelectItem key={network.chainId} value={network.chainId.toString()}>
                          {network.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stablecoin"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium">Settlement Currency *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={availableStablecoins.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a stablecoin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableStablecoins.map((coin) => {
                        const config = stablecoinsConfig[coin as keyof typeof stablecoinsConfig];
                        return (
                          <SelectItem key={coin} value={coin}>
                            {config.symbol} — {config.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isProsessing || availableStablecoins.length === 0}
              className="w-full h-10"
            >
              {isProsessing ? (
                <>
                  <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                  Configuring...
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Progress */}
        <div className="flex gap-1 pt-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-1 flex-1 rounded-full ${
                step === 3
                  ? "bg-accent"
                  : step < 3
                  ? "bg-accent/30"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
