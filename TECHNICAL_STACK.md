## Technology Stack & Architecture

This project is a **guard-railed AI payment agent** that enables autonomous yet constrained movement of **MNEE stablecoins** using cryptographically enforced policies.

### 1. Blockchain & Smart Contracts

**Ethereum (Primary)**

* MNEE is a USD-backed stablecoin deployed on Ethereum.
* All agent payments are settled on-chain using the official MNEE ERC-20 contract.
* On-chain execution ensures transparency, auditability, and deterministic settlement.

**ERC-20 Standard**

* MNEE follows the ERC-20 standard.
* Token transfers are executed via signed transactions initiated by the agent wallet.
* Optional support for additional ERC-20 tokens exists but is disabled by default.

---

### 2. AI Agent Framework

**Coinbase AgentKit**

* Provides the execution framework for AI agents.
* Supports modular “Action Providers” that define what the agent is allowed to do.
* The agent cannot perform arbitrary transactions—only explicitly exposed actions.

**Custom Agent Action Provider**

* Implements controlled MNEE transfer actions.
* Enforces:

  * Token-level constraints (MNEE-only by default)
  * Recipient-level constraints (address book whitelist)
  * Amount and policy checks before execution
* Acts as the primary guardrail between AI reasoning and on-chain execution.

---

### 3. Secure Identity & Access Control

**Privy Server Wallet**

* Used to manage the agent’s on-chain identity.
* Enables transaction signing without exposing private keys to the agent logic.
* Allows programmatic control while maintaining custody safeguards.

**User Authentication**

* Google or email-based sign-in.
* Links each user to a personalized agent configuration and policy set.

---

### 4. Privacy-Preserving Data Storage

**Nillion Secret Vault**

* Stores sensitive data such as:

  * Address books
  * Approved counterparties
  * Organizational payment permissions
* Data is encrypted and never exposed in plaintext to the agent or on-chain.
* The agent can query allowed recipients by name without learning raw addresses.

This prevents:

* Address leakage
* Social engineering attacks
* Prompt-based exfiltration of sensitive data

---

### 5. Policy & Guardrail Layer

**Cryptographically Enforced Boundaries**

* Agents can only send MNEE to addresses retrieved from the encrypted address book.
* No raw address input is accepted from the agent or user prompts.
* All transfers are validated against:

  * Token allowlist
  * Recipient allowlist
  * Optional spending limits

This design ensures:

* Protection against scams and hallucinated recipients
* Safe autonomous spending
* Predictable financial behavior

---

### 6. Developer & User Experience

**Coinbase OnchainKit**

* Used for wallet interactions and transaction visibility.
* Provides on-chain UX components for transparency and trust.

**Coinbase Onramp**

* Allows users to fund agent wallets with MNEE in a few clicks.
* Bridges traditional payment methods to on-chain programmable money.

**Twitter Integration**

* Enables identity-based interactions and social distribution of agents.
* Can be extended for creator payments or public agent services.

---

### 7. System Architecture Overview

```
User / Business
      ↓
Authentication (Privy)
      ↓
AI Agent (Coinbase AgentKit)
      ↓
Action Provider (Policy Enforcement)
      ↓
Nillion Secret Vault (Encrypted Address Book)
      ↓
Ethereum (MNEE ERC-20 Contract)
```

---

### 8. Why This Stack

* **MNEE** provides stable, programmable value suitable for automation.
* **AgentKit** enables controlled autonomy instead of open-ended AI actions.
* **Nillion** ensures privacy without sacrificing functionality.
* **Ethereum** provides trust-minimized settlement and composability.

Together, this stack enables **safe, real-world AI commerce using programmable money**.

---