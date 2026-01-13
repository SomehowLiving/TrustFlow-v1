# TRUSTFLOW — 4 PAGE UI FLOW (COPILOT INSTRUCTIONS)

## Core invariant (do NOT break)

**Configuration is signed.**
**Execution is enforced.**
**AI is never trusted.**

Specifically:
* Humans sign configuration
* AI interprets intent only
* Smart contracts enforce limits
* Execution is simulated
* **Every execution verifies the address book signature**

---

# 📄 PAGE 1 — OWNER SETUP (Address Book + Signing)

**Route:** `/trustflow/setup`

### Purpose

Allow the owner to define and cryptographically authorize who the agent can pay.

This is a **one-time or rare operation** that happens before any agent actions.

---

## UI Requirements

### Components

**1. Wallet Connection**
* Connect owner wallet (Privy or EVM wallet)
* Display connected address: `"Connected as: 0xAbc..."`

**2. Address Book Editor**

Editable list with columns:
* **name** (string) — e.g., "designer"
* **address** (0x...) — e.g., "0xabc..."

Buttons:
* **Add entry**
* **Remove entry**

This is plain form state. No blockchain interaction yet.

**3. Sign Address Book Button**

Label exactly:
```
Sign Address Book (Owner Wallet)
```

**Critical:** This is a **message signature**, not a transaction.
* No gas
* No chain interaction
* Opens wallet (Privy/MetaMask) to sign

**4. Verification Status**

Display one of:
* ❌ **Not signed** — owner must sign before proceeding
* ✅ **Signed & verified** — show signer address below

Example verified state:
```
Address Book Status: Verified ✓
Signed by: 0xAbc…123
```

---

## Technical Flow

### Message to Sign (Canonical Format)

```json
{
  "domain": "TrustFlow",
  "version": 1,
  "entries": {
    "designer": "0xabc...",
    "vendor": "0xdef..."
  },
  "timestamp": 1234567890
}
```

Serialize this deterministically (JSON.stringify with sorted keys).

### On "Sign Address Book" Click

1. Serialize message deterministically
2. Request `wallet.signMessage(serializedMessage)`
3. POST to backend:

```
POST /api/trustflow/addressbook/save
{
  "owner": "0xOwnerAddress",
  "message": "...serialized message...",
  "signature": "0xSignature"
}
```

### Backend Must

* Verify signature using `ecrecover`
* Store `{ owner, message, signature }`
* **Reject invalid signatures**
* Return verification status

---

## Exit Condition (page is "complete")

User **cannot proceed to Page 2** unless:
* ✅ Wallet connected
* ✅ Address book signed and verified

---

## What NOT to Do

* Do NOT auto-sign on every change
* Do NOT hide signing inside payment flow
* Do NOT let AI modify this
* Do NOT store unsigned entries as valid

**Key principle:**
> From now on, this address book is locked. Any change requires re-signing.

---

# 📄 PAGE 2 — INTENT INPUT (Human → Agent)

**Route:** `/trustflow/intent`

### Purpose

Allow a human to request a payment without touching crypto primitives.

---

## UI Requirements

### Components

**1. Textarea**
```
"Pay 1 MNEE to my designer"
```

**2. Toggle**
* Label: "Use AI interpretation (OpenAI — interpretation only)"
* Default: ON

**3. Manual Fallback Inputs** (optional, for if toggle is OFF)
* Recipient name (dropdown from address book)
* Amount (MNEE)

**4. Button**
```
Submit Intent
```

---

## Request Sent

```
POST /api/trustflow/intent
{
  "naturalLanguage": "Pay 1 MNEE to my designer",
  "agentAddress": "0xAgentAddress"
}
```

---

## Backend Responsibility

If `naturalLanguage` is present:
* Call OpenAI to parse intent
* Return structured intent **only**

**Do NOT:**
* Resolve addresses
* Check address book signature
* Check policy
* Encode calldata

### Response

```json
{
  "intent": "pay",
  "recipient": "designer",
  "amount": 1
}
```

---

## Navigation

On success → redirect to:
```
/trustflow/interpretation
```

Pass the parsed intent in state or URL params.

---

# 📄 PAGE 3 — AGENT INTERPRETATION (Read-Only Transparency)

**Route:** `/trustflow/interpretation`

### Purpose

Make AI reasoning **visible but powerless**.

---

## UI Requirements

### Display

**Parsed intent (read-only JSON or formatted text):**

```json
{
  "action": "pay",
  "recipient": "designer",
  "amount": 1
}
```

**Label:**
```
Parsed by AI (interpretation only — no execution authority)
```

**Important:** Make it clear AI does NOT have access to:
* Address book
* Wallet
* Policies
* Blockchain

---

### Button

```
Proceed to Policy Enforcement
```

---

## Failure Case

If AI output is invalid:
* Show:
  ```
  Unable to confidently interpret intent
  ```
* **Block navigation**
* Do not allow user to proceed

---

# 📄 PAGE 4 — EXECUTION SIMULATION (Proof)

**Route:** `/trustflow/execute`

### Purpose

Prove **cryptographic + on-chain enforcement**.

This is the **most important page**.

---

## Backend Request

```
POST /api/trustflow/execute
{
  "intent": {
    "action": "pay",
    "recipient": "designer",
    "amount": 1
  },
  "agentAddress": "0xAgentAddress"
}
```

---

## Backend Steps (STRICT ORDER)

Execute these steps **in order**. If any fail, stop and return error.

1. **Verify address book signature**
   * Fetch stored signature for owner
   * Use `ecrecover` to verify
   * If invalid/missing → **FAIL**

2. **Resolve recipient from signed address book**
   * Look up "designer" in signed entries
   * If not found → **FAIL**

3. **Load agent policy**
   * Fetch policy (daily cap, per-tx limits)

4. **Enforce limits**
   * Check if amount exceeds cap
   * If exceeded → **FAIL**

5. **ABI-encode transaction**
   * Encode: `executePayment(address recipient, uint256 amount)`
   * Target contract: `MNEEPolicyExecutor`

6. **Return simulated result**
   * **Do NOT broadcast transaction**
   * **Do NOT sign anything**
   * Return execution preview only

---

## UI Display Sections

### 1. Verification Checklist

Show these checks (read-only):

```
✓ Address book signature verified
✓ Recipient resolved: designer → 0xabc...
✓ Policy loaded for agent
✓ Limits satisfied
```

You can use simple text, checkmarks, or badges.

---

### 2. Simulation Result

**Execution Mode:**
```
SIMULATED
(MNEE is a real mainnet stablecoin)
```

**Transaction Preview:**
```json
{
  "to": "0xB7BdA0b6a477db6c370B6e83311Efe1092Ba6a08",
  "method": "executePayment(address,uint256)",
  "calldata": "0xabc...def"
}
```

---

### 3. Explanation Block

```
The agent cannot directly transfer funds.
All payments are routed through an on-chain policy executor.
Settlement is intentionally not broadcast during the hackathon.
```

---

## Failure States (MANDATORY)

You **must** handle these failure cases and show clear error messages:

| Failure | Error Message |
|---------|---------------|
| Invalid signature | ❌ **Address book not authorized by owner** |
| Missing signature | ❌ **Owner must sign address book in setup** |
| Unknown recipient | ❌ **Recipient 'designer' not in signed address book** |
| Policy exceeded | ❌ **Daily cap exceeded** |

Each failure must:
* Block execution
* Show reason clearly
* **Do not proceed to simulation**

Judges **love** seeing these failures — it proves the system says "NO".

---

# 🚫 DO NOT IMPLEMENT

Copilot must **NOT**:

* Broadcast transactions
* Auto-sign anything
* Let AI resolve addresses
* Let AI modify the address book
* Let agent sign anything
* Hide simulation status
* Store unsigned entries as valid
* Skip signature verification

---

# 🏁 SUCCESS CRITERIA

If a judge clicks through all 4 pages, they should understand:

1. **Who controls configuration** — owner signs address book
2. **Why the agent is constrained** — can only read signed config
3. **What AI can and cannot do** — parse intent only, no authority
4. **How programmable money is enforced** — signature verification on every execution

---

# 📌 FINAL COPY FOR COPILOT PROMPT

**Paste this to Copilot:**

"Implement the above four-page TrustFlow UI exactly as specified. Maintain strict separation between owner configuration (signed address book), AI interpretation (parsing only), and execution enforcement (signature verification on every execution). All execution must remain simulated. The owner signs the address book once; the agent can only read signed configuration; every execution verifies that signature before resolving recipients. Do not add extra features."