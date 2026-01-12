import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { TrustflowActionSchema } from "./schemas";
import { z } from "zod";

/**
 * Creates a TrustflowActionProvider action provider.
 * To create multiple actions, pass in an array of actions to createActionProvider.
 */
export const trustflowActionProvider = () =>
  customActionProvider<EvmWalletProvider>({
    name: "trustflow_action",
    description: `This tool will perform a TrustflowActionProvider operation.`,
    schema: TrustflowActionSchema,
    invoke: async (wallet: EvmWalletProvider, args: z.infer<typeof TrustflowActionSchema>) => {
      try {
        // Do work here
        return `Successfully performed trustflow_action and returned the response`;
      } catch (error) {
          return `Error performing trustflow_action: Error: ${error}`;
        }
      },
  });
