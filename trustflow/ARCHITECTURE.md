## End-to-End System Flow (Judge-Ready)

This section describes the complete TrustFlow execution path, from human intent to stablecoin settlement.
The architecture is intentionally layered, with **explicit trust boundaries** and **deterministic enforcement**.

```
User Intent (Natural Language)
        ↓
AI Agent (Local, Untrusted)
        ↓
Guard-Railed Action Provider
        ↓
On-Chain Policy Executor (MNEE)
        ↓
Stablecoin Settlement (MNEE)
```

**Trust Assumption:**
Only one component is trusted — the **on-chain smart contract**.
All off-chain components, including the AI agent, are treated as potentially malicious.

---

## 1️⃣ User Intent Layer (Human Interface)

**Example Input**

```
“Pay 1 MNEE to Alice”
```

**Characteristics**

* Human-readable intent
* No blockchain addresses
* No protocol or token knowledge required

**Trust Model**

* This layer is **untrusted**
* Input may be ambiguous, incorrect, or malicious

The system never assumes user intent is safe or well-formed.

---

## 2️⃣ AI Agent Layer (Decision Layer)

**Responsibilities**

* Parse natural-language intent
* Select the appropriate action:

  ```
  execute_mnee_payment
  ```

**Explicit Restrictions**
The agent:

* ❌ Cannot choose the token
* ❌ Cannot choose the contract
* ❌ Cannot invent recipients
* ❌ Cannot bypass policy constraints

**Security Model**
The agent is treated as **potentially compromised**.
Its output is considered a *proposal*, not authority.

---

## 3️⃣ Guard-Railed Action Provider (Off-Chain Safety Layer)

This layer enforces **off-chain safety guarantees** before any transaction is constructed.

### Responsibilities

* Resolve recipient name → blockchain address
* Verify address book integrity
* Construct deterministic transaction calldata

---

### Recipient Resolution

* Uses an **encrypted, wallet-signed address list**
* The AI agent has **read-only access**
* The agent cannot modify, extend, or replace entries

**Integrity Check**

* The signature is verified against the owner wallet
* If verification fails → execution aborts

**Threats Prevented**

* Hallucinated addresses
* Prompt injection attacks
* Agent-initiated fund redirection
* Unauthorized counterparty insertion

---

## 4️⃣ On-Chain Policy Executor (Trust Anchor)

**Smart Contract**

```
MNEEPolicyExecutor
```

This contract is the **final and only trusted authority**.

### Enforced On-Chain Policies

* Maximum per-transaction amount
* Daily / weekly spending limits
* Time-based constraints
* Authorized caller validation

### Properties

* Deterministic
* Immutable
* Cryptographically enforced

Even with full control over the agent and off-chain runtime, **unsafe payments are impossible**.

---

## 5️⃣ Stablecoin Settlement Layer (Economic Layer)

**Asset**

* **MNEE** — USD-backed stablecoin

**Production Behavior**

* `executePayment` transfers real MNEE
* Settlement occurs on Ethereum mainnet
* Funds move only if all policies are satisfied

---

## 🧪 Simulation Disclosure (Explicit and Transparent)

### What Is Simulated

❗ **Only one component is simulated:**

* Final token transfer (value settlement)

---

### What Is NOT Simulated

The following are **real, correct, and production-accurate**:

* MNEE contract address
* Policy Executor ABI
* Policy enforcement logic
* Recipient resolution
* Guard-rail validation
* Calldata construction

---

### Why Settlement Is Simulated

* MNEE is a real mainnet stablecoin
* Hackathon demos should not move real funds
* Live settlement requires funded wallets and real balances
* Policy violations would result in irreversible transactions

Simulation preserves safety **without weakening architecture correctness**.

---

## How Simulation Works (Technical Detail)

Instead of broadcasting a transaction, the system:

1. Constructs the exact calldata that would be sent on mainnet
2. Uses deterministic encoding via `encodeFunctionData`

```ts
encodeFunctionData({
  functionName: "executePayment",
  args: [recipient, amount]
})
```

3. Produces a transaction preview:

```
to:   MNEEPolicyExecutor
data: <encoded calldata>
```

4. Marks execution result as:

```
status: "simulated"
```

There are:

* No mock contracts
* No fake tokens
* No altered logic

---

## 🔐 Why This Design Is Correct

**Core Principle**

> Agents decide. Contracts enforce.

Even in simulation:

* The agent cannot escape constraints
* The policy executor remains the source of truth
* The system is fully mainnet-ready

This design mirrors real-world deployment while maintaining safety and auditability during demonstration.

---
