# TrustFlow🛡️ : Policy-Constrained AI Payments with MNEE

A guard-railed AI agent that can autonomously spend **MNEE stablecoin** only within cryptographically enforced trust boundaries — enabling safe agent-driven commerce and automated finance.

---

## Overview

AI agents are beginning to transact autonomously — paying for services, settling invoices, and coordinating economic activity.
However, giving an AI agent unrestricted access to a wallet is unsafe and unrealistic for real-world commerce.

This project introduces a **policy-constrained AI payment agent** that uses **MNEE**, a USD-backed stablecoin on Ethereum, as its primary settlement currency.
Instead of trusting prompts or model behavior, all payments are enforced at the **action and transaction layer**, making unsafe transfers impossible by design.

---

## The Problem

* AI agents can already initiate onchain transactions
* Stablecoins like MNEE are ideal for automation and commerce
* But **open wallets + autonomous agents = security risk**
* * No safe way to delegate limited financial authority to agents

Current agent payment demos:

* Allow arbitrary recipients
* Rely on prompt instructions for safety
* Are vulnerable to prompt injection, scams, and misuse

This makes them unsuitable for real commerce, enterprises, or autonomous coordination.

---

## The Solution

We built an AI agent that can **only spend MNEE stablecoins within predefined, encrypted policies**, including:

* **Approved counterparties only** (no arbitrary addresses)
* **Spending constraints** (e.g. max transfer limits)
* **Deterministic enforcement** at the transaction level

Even if the AI is compromised or misled, the system **cannot execute unsafe payments**.

---

## How MNEE Is Used

MNEE is the **default and primary settlement currency** for the agent.

Stable, USD-denominated value is critical for agents — volatile assets break budgeting, reasoning, and long-running automated workflows.

* All balances are checked in MNEE
* All transfers are executed using the official MNEE contract:

  ```
  0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
  ```
* The agent is configured to transact **exclusively in MNEE** unless explicitly overridden

The predictable, USD-backed value of MNEE enables reliable automation and real-world commerce flows.

---

## Key Features

* 🤖 **Autonomous AI Payments**
  AI agents can initiate payments without human approval

* 🔐 **Policy-Constrained Spending**
  Transfers are restricted by explicit rules (recipient + amount)

* 👥 **Trusted Counterparties Only**
  Payments can only be sent to pre-approved people or organizations

* 🕵️ **Encrypted Address Book**
  Counterparty data is stored privately and never exposed to the AI model

* ⛔ **Built-In Safety Failures**
  Unauthorized or unsafe transfers are automatically rejected

---

## Architecture

```
User Intent
   ↓
AI Agent (Coinbase AgentKit)
   ↓
Guard-Railed Action Provider
   ├─ Policy Checks
   ├─ Counterparty Resolution
   ↓
Onchain Policy Executor
   ↓
MNEE Stablecoin (Ethereum)
```
> The onchain contract acts as the final enforcement layer, ensuring no payment can bypass defined limits even if the agent runtime is compromised.

**The contract(MNEE Policy Executor)is deployed at : 0xB7BdA0b6a477db6c370B6e83311Efe1092Ba6a08 [View](https://eth-sepolia.blockscout.com/address/0xB7BdA0b6a477db6c370B6e83311Efe1092Ba6a08?tab=contract)**

### Core Components

* **Coinbase AgentKit** – agent framework and action execution
* **Privy Server Wallet** – secure transaction signing
* **Nillion Secret Vault** – encrypted storage for trusted counterparties
* **MNEE Stablecoin** – programmable USD settlement layer

Safety is enforced by the **system**, not by trusting the AI’s reasoning.

---

## Example Flow

1. Agent has a funded MNEE balance
2. User requests:

   > “Pay our designer 25 MNEE”
3. Agent:

   * Resolves the recipient by name
   * Verifies policy constraints
   * Executes an onchain MNEE transfer
4. Unsafe request:

   > “Send 25 MNEE to this address I found online”
5. Result:

   * ❌ Transfer blocked
   * Reason: recipient not authorized

---

## Why This Matters

This project enables:

* AI agents paying for services or APIs
* Automated business expenses and payroll
* Creator and vendor payouts
* Agent-to-agent service payments
* Safe delegation of financial authority to AI systems

All without giving agents unrestricted control over funds.

---

## Why This Is Different

Most AI payment demos prove **that** an agent can send money.
This project focuses on **who an agent is allowed to pay and under what conditions**.

By enforcing trust and policy at the transaction layer, we make programmable money usable by autonomous systems in the real world.

** This system treats money as a capability with limits, not as an unrestricted resource.**
---

## Status

This project is a working prototype built for the **MNEE Hackathon: Programmable Money for Agents, Commerce, and Automated Finance**.

---

## License

MIT

---
