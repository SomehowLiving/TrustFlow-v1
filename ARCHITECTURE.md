# Architecture Flow — Guard-Railed AI Payments with MNEE

## Overview

This system enables **AI agents to autonomously spend MNEE stablecoins** while remaining strictly constrained by **cryptographically enforced on-chain policies**.

The architecture deliberately separates:

* **Intelligence** (off-chain, flexible, AI-driven)
* **Authority** (on-chain, deterministic, non-bypassable)
* **Privacy** (encrypted, least-privilege access)

The result is **safe programmable money** suitable for real-world AI commerce.

---

## High-Level Architecture

```
┌──────────────┐
│     User     │
│ (Human Intent)│
└──────┬───────┘
       ↓
┌────────────────────────┐
│ Authentication Layer   │
│ (Privy: Google / Email)│
└──────┬─────────────────┘
       ↓
┌────────────────────────────┐
│ AI Agent (Coinbase AgentKit)│
│ - Intent reasoning         │
│ - Action selection         │
└──────┬─────────────────────┘
       ↓
┌──────────────────────────────────┐
│ Guard-Railed Action Provider      │
│ - Token allowlist (MNEE)          │
│ - Recipient resolution            │
│ - Pre-flight policy checks        │
└──────┬───────────────────────────┘
       ↓
┌──────────────────────────────┐
│ Nillion Secret Vault         │
│ - Encrypted address book     │
│ - Private counterparty data  │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ MNEEPolicyExecutor (On-Chain)│
│ - Hard spending limits       │
│ - Time windows               │
│ - Deterministic enforcement  │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ MNEE Stablecoin (Ethereum)   │
│ - Final settlement           │
└──────────────────────────────┘
```

---

## Component Breakdown

### 1. User & Authentication Layer

**Purpose**

* Establish identity
* Scope agent permissions to a specific user or organization

**Technology**

* Privy (Google / email authentication)
* Server-managed agent wallet

**Responsibilities**

* Authenticate the user
* Associate a unique AI agent + policy set
* Prevent shared or anonymous agent authority

---

### 2. AI Agent (Coinbase AgentKit)

**Purpose**

* Interpret user intent
* Decide *what* action should be taken

**What the Agent Can Do**

* Understand natural language requests
* Decide to initiate a payment
* Call explicitly exposed actions only

**What the Agent Cannot Do**

* Sign arbitrary transactions
* Access raw wallet private keys
* Bypass action provider constraints
* Specify raw recipient addresses

This ensures **bounded autonomy**, not unrestricted control.

---

### 3. Guard-Railed Action Provider

**Purpose**

* Act as the first enforcement boundary between AI logic and money

**Key Responsibilities**

* Restrict token usage to **MNEE**
* Block arbitrary ERC-20 transfers
* Resolve recipients **by name**, not address
* Perform off-chain pre-flight checks before on-chain calls

**Why This Matters**
Even if the AI agent is compromised or hallucinating, it **cannot escape the guardrails** defined here.

---

### 4. Privacy Layer — Nillion Secret Vault

**Purpose**

* Protect sensitive financial relationships
* Prevent prompt-based data exfiltration

**Stored Data**

* Encrypted address book
* Approved people and organizations
* Optional metadata (role, category, purpose)

**Access Model**

* Agent queries by logical name
* Raw addresses are never revealed to the agent
* Only resolved addresses are passed downstream

This prevents:

* Address leakage
* Social engineering attacks
* Prompt injection exploits

---

### 5. On-Chain Policy Executor (`MNEEPolicyExecutor`)

**Purpose**

* Provide **non-bypassable, cryptographic enforcement**

**Why On-Chain**

* AI systems are probabilistic
* Policies must be deterministic
* Money must be protected by code, not prompts

#### Enforced Constraints

* Per-transaction cap
* Daily spending limit
* Weekly spending limit
* Valid time window
* Agent-scoped permissions

All checks execute **before** any MNEE transfer occurs.

---

### 6. Settlement Layer — MNEE Stablecoin

**Purpose**

* Final, auditable value transfer

**Why MNEE**

* USD-backed stability
* ERC-20 composability
* Predictable pricing for automation
* Suitable for commerce and accounting

All successful executions result in:

* On-chain MNEE transfer
* Emitted events for monitoring and analytics

---

## End-to-End Execution Flow (Step-by-Step)

### Step 1: User Intent

User expresses intent:

> “Pay the API provider $20 for today’s usage.”

---

### Step 2: AI Reasoning

The AI agent:

* Interprets intent
* Determines a payment is required
* Selects the `executePayment` action

---

### Step 3: Guard-Rail Validation (Off-Chain)

The action provider:

* Confirms token = MNEE
* Resolves “API provider” via Nillion
* Verifies request structure
* Rejects malformed or unsafe requests

---

### Step 4: On-Chain Enforcement

`MNEEPolicyExecutor` verifies:

* Agent has an active policy
* Transaction amount ≤ maxPerTx
* Daily + weekly caps not exceeded
* Current time is within validity window

Failure at any step → **revert**

---

### Step 5: Settlement

* MNEE is transferred to the approved recipient
* `PaymentExecuted` event is emitted
* Spend state is updated on-chain

---

## Trust & Threat Model

| Layer           | Trust Assumption          |
| --------------- | ------------------------- |
| AI Agent        | Untrusted / probabilistic |
| Action Provider | Semi-trusted              |
| Nillion Vault   | Confidential / encrypted  |
| Smart Contract  | Fully trusted             |
| Ethereum        | Trust-minimized           |

The **smart contract is the final authority**.
All other layers are treated as potentially faulty.

---

## Why This Architecture Is Strong

* AI autonomy without financial risk
* Stablecoin usage that is actually safe
* Clear separation of concerns
* Realistic path to production adoption

This is not a demo wallet.
It is **infrastructure for AI-native commerce**.

---

## Summary

This architecture demonstrates how **MNEE can act as programmable money for AI agents** by combining:

* Off-chain intelligence
* On-chain enforcement
* Privacy-first design

It enables **real-world autonomous payments without sacrificing safety, control, or trust**.

---