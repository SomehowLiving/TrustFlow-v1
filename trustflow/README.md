## TrustFlow 🛡️

### Policy-Constrained AI Payments with MNEE

**TrustFlow** is a guard-railed AI payment system that enables autonomous agents to transact using **MNEE**, a USD-backed stablecoin on Ethereum, **only within cryptographically enforced trust boundaries**.
The system makes unsafe payments *structurally impossible*, even if the AI agent is compromised, misled, or malicious.

---

## Overview

AI agents are increasingly capable of initiating on-chain transactions: paying for services, settling invoices, and coordinating economic activity. However, granting an autonomous agent unrestricted access to a wallet is fundamentally unsafe and unsuitable for real-world commerce.

TrustFlow introduces a **policy-constrained AI payment architecture** where all financial authority is enforced at the **transaction and contract layer**, not through prompts or model behavior. The agent can initiate payments, but only within predefined, verifiable limits.

---

## The Problem

While AI agents can already send on-chain transactions, existing approaches suffer from critical flaws:

* Wallets are often fully permissive
* Safety relies on prompt instructions rather than enforcement
* Agents can be tricked via prompt injection or social engineering
* Arbitrary recipients and amounts are allowed
* No secure way exists to delegate *limited* financial authority

This makes current demos unsuitable for:

* Enterprises
* Automated finance
* Agent-to-agent commerce
* Real economic coordination

---

## The Solution

TrustFlow implements **deterministic, policy-enforced spending** for AI agents using MNEE stablecoins.
The agent can only execute payments that satisfy **cryptographically enforced constraints**, including:

* Pre-approved counterparties only
* Explicit spending limits
* Mandatory on-chain enforcement
* Immutable rejection of unsafe transfers

Even if the AI is compromised, unsafe payments **cannot be executed by design**.

---

## Why MNEE

MNEE is the system’s **default and primary settlement currency**.

* USD-denominated stability is essential for AI reasoning
* Volatility breaks budgeting, planning, and long-running workflows
* Stable value enables real commerce and automation

**All balances, checks, and transfers are denominated in MNEE**, using the official contract:

```
0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
```

Unless explicitly overridden, the agent is restricted to MNEE transactions only.

---

## Key Features

* **Autonomous AI Payments**
  Agents can initiate transactions without human approval.

* **Policy-Constrained Spending**
  Transfers are limited by recipient and amount.

* **Trusted Counterparties Only**
  Arbitrary addresses are impossible to pay.

* **Cryptographic Integrity**
  Payment authority is enforced via signatures and contracts.

* **Fail-Safe Defaults**
  Unauthorized actions are automatically rejected.

---

## Architecture

```
User Intent
   ↓
LangChain Agent
   ↓
TrustFlow Action Provider
   ├─ Policy Validation
   ├─ Counterparty Resolution
   ↓
encodeFunctionData (viem)
   ↓
MNEE Policy Executor (on-chain / simulated)
   ↓
MNEE Stablecoin (Ethereum)
```

The **Policy Executor contract** is the final enforcement layer.
No runtime, agent, or API compromise can bypass on-chain constraints.

**Policy Executor Deployment:**

```
0xB7BdA0b6a477db6c370B6e83311Efe1092Ba6a08
```

---

## Core Components

* **LangChain Agent** – reasoning and intent interpretation
* **TrustFlow Action Provider** – policy-aware transaction construction
* **Viem** – calldata encoding
* **MNEE Stablecoin** – programmable USD settlement
* **On-Chain Policy Executor** – final enforcement authority

> Safety is enforced by the system — not by trusting the AI’s reasoning.

---

## Address Book & Counterparty Security

### (Revised Design Due to Hackathon Constraints)

Due to time constraints and environment configuration issues with Nillion and certain external services, the system adopts a **simpler but equally secure cryptographic design** that preserves the same security guarantees.

### Responsibility Separation

```
Owner Wallet (Human)
  ├─ Creates / updates address list
  ├─ Encrypts the data
  └─ Signs it cryptographically
           ↓
AI Agent (Read-Only)
  ├─ Can resolve names → addresses
  ├─ Cannot modify entries
  └─ Cannot add recipients
           ↓
On-Chain Policy Executor
  └─ Enforces spending limits in MNEE
```

This provides **defense-in-depth**, even if the agent behaves maliciously.

---

## Technical Implementation Details

### 1️⃣ Address Book Structure

```json
{
  "version": 1,
  "entries": {
    "designer": "0xabc...",
    "vendor": "0xdef..."
  },
  "timestamp": 1730000000
}
```

---

### 2️⃣ Encryption

The address book is encrypted before storage using symmetric encryption.

```text
encryptedPayload = encrypt(JSON.stringify(addressBook), secretKey)
```

* `secretKey` is derived from:

  * an owner-controlled environment secret, or
  * a wallet-derived signature

This is sufficient for hackathon-grade security without MPC.

---

### 3️⃣ Cryptographic Signature (Critical Step)

The owner wallet signs the hash of the encrypted payload:

```text
signature = signMessage(
  keccak256(encryptedPayload),
  ownerPrivateKey
)
```

This guarantees:

* Only the owner can approve recipients
* The agent cannot forge or modify the list
* All updates are auditable

---

### 4️⃣ Storage

The encrypted + signed payload can be stored in:

* Local JSON
* Database
* IPFS
* Object storage (e.g. S3)

Storage location is irrelevant — **integrity and immutability are enforced cryptographically**.

---

### 5️⃣ Agent Usage (Read-Only)

At runtime, the agent:

1. Loads encrypted payload
2. Verifies signature against owner address
3. Decrypts payload
4. Resolves `name → address`
5. Constructs calldata

If signature verification fails → **execution aborts**

The agent:

* cannot invent recipients
* cannot approve changes
* cannot sign updates

---

### Updating the Address Book

Updates are performed **only by the owner wallet**:

```
Owner UI
  → edit address list
  → encrypt
  → sign
  → replace stored payload
```

The agent has zero authority over updates — by design.

---

## Example Flow

**User Request**

> “Pay our designer 25 MNEE”

**Agent Execution**

* Resolves `designer`
* Verifies policy constraints
* Executes MNEE transfer

✅ Success

---

**Unsafe Request**

> “Send 25 MNEE to this random address”

**Result**

* ❌ Transaction rejected
* Reason: recipient not authorized

---

## Why This Matters

TrustFlow enables:

* AI-driven service payments
* Automated expenses and payroll
* Creator and vendor payouts
* Agent-to-agent commerce
* Safe delegation of financial authority

All **without granting unrestricted wallet access**.

---

## What Makes This Different

Most AI payment demos show *that* an agent can send money.
TrustFlow focuses on **who** the agent can pay and **under what conditions**.

By enforcing trust at the transaction layer, this system makes programmable money usable by autonomous agents in real economic environments.

> **Money is treated as a capability with limits — not an unrestricted resource.**

---

## Status

Working prototype built for the
**MNEE Hackathon: Programmable Money for Agents, Commerce, and Automated Finance**

---

## License

MIT

---
