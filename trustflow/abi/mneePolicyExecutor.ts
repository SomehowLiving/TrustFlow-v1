export const mneePolicyExecutorAbi = [
  {
    type: "function",
    name: "executePayment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getSpendState",
    stateMutability: "view",
    inputs: [{ name: "agent", type: "address" }],
    outputs: [
      { name: "spentToday", type: "uint256" },
      { name: "spentThisWeek", type: "uint256" },
      { name: "lastDay", type: "uint64" },
      { name: "lastWeek", type: "uint64" },
    ],
  },
] as const;
