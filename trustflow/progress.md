# TrustFlow Progress

## Built

- **Constants:** `constants.ts` — exported `MNEE_TOKEN_ADDRESS` and `MNEE_POLICY_EXECUTOR` (user-provided addresses).
- **Address Book:** `addressbook.json` — prototype addressbook with `designer` and `vendor` entries (signed flag present).
- **Policies:** `policies.json` — example agent policy containing `maxPerTx`, `dailyCap`, `weeklyCap`.
- **API:** `app/api/trustflow/execute/route.ts` — POST endpoint that validates recipient and policy and returns a deterministic simulated calldata payload.
- **UI:** `app/trustflow/page.tsx` — simple client UI to submit recipient name, amount, and agent address; displays simulation result.

## In Progress / Next Steps

- Add cryptographic verification of the encrypted address book (signature verification).
- Replace the simple JSON policy store with a persistent DB-backed service (MongoDB already exists in main app).
- Encode real calldata using `viem` or `ethers` so the simulation matches actual ABI-encoding.
- Add authentication and agent key management for signing or agent identity delegation.
- Integrate with the existing `AgentKit` flow (e.g., `prepareAgentkit.ts`) to demonstrate end-to-end agent-driven requests.

## Completed Next Steps (this update)

- **ABI Encoding:** API now uses `viem.encodeFunctionData` to produce production-correct calldata for `executePayment(address,uint256)` and returns the calldata as hex.
- **Address Book Integrity:** API requires the address book to include `signedMessage` and `signature` fields and verifies the signature using `ethers.utils.verifyMessage` against the `owner` address before resolving recipients.
- **Explicit Simulation Mode:** API responses now include `executionMode: "simulated"` and a clear explanation that MNEE is a real mainnet stablecoin and that settlement is intentionally not broadcast during the hackathon.
- **OpenAI Intent Parsing:** Added optional natural-language parsing via OpenAI; the LLM is used only to extract `{ intent, recipient, amount }` and NEVER to resolve addresses, sign data, or execute transactions.
- **Privy Representation:** Added `privy-stub.ts` documenting that Privy is used only for owner signing of the addressbook; Privy is not used for payments or broadcasting.

## How to try the prototype

1. Start the Next.js app from the `trustflow` folder (standard dev start for the repo).
2. Open `/trustflow` in the running app.
3. Use the form to simulate a payment to `designer` with the default agent address.

## Notes

- The current implementation returns a human-readable `calldata` simulation. No on-chain transaction is broadcast.
- The prototype focuses on wiring the platform pieces together quickly; security-hardening and full cryptographic verification are next.
