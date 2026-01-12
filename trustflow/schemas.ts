import { z } from "zod";

/**
 * Input schema for TrustflowAction's trustflow_action action.
 */
export const TrustflowActionSchema = z
  .object({
    payload: z.string().describe("The payload to send to the action provider"),
  })
  .strip()
  .describe("Instructions for trustflow_action");
