import { z } from "zod";

/**
 * Input schema for get address from the address book action.
 */
export const GetAddressBookAddressSchema = z
  .object({
    name: z
      .string()
      .describe(
        "The name of a person or organization in the address book, e.g., 'Alice' or 'Kindness Network'"
      ),
  })
  .strip()
  .describe(
    "Instructions for getting an address of a person or organization from the address book"
  );

/**
 * Input schema for get ERC20 balance action.
 */
export const GetErc20BalanceSchema = z
  .object({
    contractAddress: z
      .string()
      .describe("The contract address of the token to get the balance for"),
  })
  .strip()
  .describe("Instructions for getting wallet balance");

/**
 * Input schema for transfer ERC20 action.
 */
export const TransferErc20Schema = z
  .object({
    amount: z.number().describe("The amount of the ERC20 asset to transfer"),
    contractAddress: z
      .string()
      .describe("The contract address of the ERC20 token to transfer"),
    recipientName: z
      .string()
      .describe(
        "The name of a person or organization to transfer the funds from the address book"
      ),
    tokenSymbol: z
      .string()
      .optional()
      .describe("The symbol of the token being transferred (e.g., MNEE, USDT, USDC)"),
  })
  .strip()
  .describe("Instructions for transferring ERC20 assets including stablecoins");

/**
 * Input schema for create ERC20 action.
 */
export const CreateErc20Schema = z
  .object({
    name: z.string().describe("The name for the ERC20 token to create"),
    symbol: z.string().describe("The symbol for the ERC20 token to create"),
    amount: z.number().describe("The amount of the ERC20 tokens to create"),
  })
  .strip()
  .describe("Instructions for transferring ERC20 assets");


export const ExecuteMneePaymentSchema = z.object({
  amount: z.number().describe("Amount of MNEE to send"),
  recipientName: z.string().describe(
    "Approved counterparty name from encrypted address book"
  ),
});

/**
 * Input schema for execute policy-constrained payment with any stablecoin.
 */
export const ExecuteStablecoinPaymentSchema = z.object({
  amount: z.number().describe("Amount of stablecoin to send"),
  recipientName: z.string().describe(
    "Approved counterparty name from encrypted address book"
  ),
  stablecoin: z
    .enum(["MNEE", "USDT", "USDC"])
    .describe("The stablecoin to use for payment (MNEE, USDT, or USDC)"),
});
