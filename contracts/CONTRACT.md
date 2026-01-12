## On-Chain Policy Enforcement (MNEEPolicyExecutor)

To ensure AI agents can transact autonomously **without unrestricted access to funds**, we introduce an on-chain policy execution contract that acts as a **cryptographic enforcement layer**.

### Contract Purpose

`MNEEPolicyExecutor` is a **restricted payment executor** that enforces spending policies for AI agents interacting with the **MNEE stablecoin**.

The contract ensures that:

* Agents can only spend within predefined limits
* All constraints are enforced **on-chain**
* No off-chain system or agent reasoning can bypass these rules

This turns MNEE into **programmable money with enforceable guarantees**.

---

## Key Design Principles

### 1. MNEE-Only Settlement

* The contract is initialized with the official **MNEE ERC-20 contract address**
* All payments are settled using MNEE
* No other tokens are supported

This guarantees stable, USD-denominated payments suitable for automation.

---

### 2. Agent-Scoped Spending Policies

Each agent address is assigned a **Policy** by the contract owner (user or organization).

```solidity
struct Policy {
    uint256 maxPerTx;
    uint256 dailyCap;
    uint256 weeklyCap;
    uint64 validFrom;
    uint64 validUntil;
}
```

Policies define:

* **Maximum amount per transaction**
* **Daily and weekly spending caps**
* **Time-bounded validity windows**

An agent **cannot execute a payment** unless an active policy exists.

---

### 3. On-Chain Spend Accounting

The contract maintains a per-agent **SpendState**:

```solidity
struct SpendState {
    uint256 spentToday;
    uint256 spentThisWeek;
    uint64 lastDay;
    uint64 lastWeek;
}
```

This enables:

* Automatic daily and weekly resets
* Deterministic enforcement of cumulative limits
* Full on-chain auditability of agent behavior

---

### 4. Trust-Minimized Execution

The `executePayment` function is callable **only by the agent itself** (`msg.sender`).

Before transferring MNEE, the contract enforces:

1. Policy existence and validity window
2. Per-transaction cap
3. Daily cap
4. Weekly cap

If **any constraint fails**, the transaction reverts.

This ensures:

* No runaway agents
* No prompt injection exploits
* No accidental overspending

---

### 5. Transparent Event Emission

Each successful payment emits a `PaymentExecuted` event:

```solidity
event PaymentExecuted(
    address indexed agent,
    address indexed recipient,
    uint256 amount,
    uint256 spentToday,
    uint256 spentThisWeek
);
```

This provides:

* Real-time monitoring
* Easy indexing for dashboards
* Post-hoc auditing of agent behavior

---

## End-to-End Execution Flow

The full system combines **off-chain intelligence** with **on-chain enforcement**.

```
User Intent
   ↓
AI Agent (Coinbase AgentKit)
   ↓
Guard-Railed Action Provider
   ├─ Policy validation (off-chain)
   ├─ Counterparty resolution (Nillion Secret Vault)
   ↓
MNEEPolicyExecutor (on-chain)
   ├─ Per-tx limit
   ├─ Daily / weekly caps
   ├─ Time window enforcement
   ↓
MNEE Stablecoin Transfer (Ethereum)
```

### Why This Split Matters

* **Off-chain layer** handles:

  * Natural language understanding
  * Recipient name resolution
  * Privacy-sensitive data

* **On-chain layer** handles:

  * Value movement
  * Hard guarantees
  * Non-bypassable constraints

This separation prevents AI logic from ever becoming a single point of failure.

---

## Why This Is Programmable Money (Not Just Payments)

This contract demonstrates **true programmable money** by embedding:

* Conditional execution
* Time-based rules
* Rate limits
* Autonomous enforcement

MNEE is not just transferred — it is **governed by code**.

---

## Security & Safety Considerations

* No raw addresses are accepted from agent prompts
* Spending limits are immutable until explicitly updated
* All enforcement happens on-chain
* Agent autonomy is strictly scoped

This design makes AI-driven finance **safe enough for real-world commerce**.

---
