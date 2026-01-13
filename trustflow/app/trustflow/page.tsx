"use client";
import React, { useState } from "react";

export default function TrustflowPage() {
  const [recipient, setRecipient] = useState("designer");
  const [amount, setAmount] = useState("0.1");
  const [agent, setAgent] = useState(
    "0xAgentAddress00000000000000000000000000000000"
  );
  const [natural, setNatural] = useState("");
  const [useLLM, setUseLLM] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const body: any = { agentAddress: agent };

      if (useLLM && natural.trim()) {
        body.naturalLanguage = natural;
      } else {
        body.recipientName = recipient;
        body.amount = (Number(amount) * 1e18).toString();
      }

      const res = await fetch("/api/trustflow/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      setResult(json);
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
      {/* HEADER */}
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>
          TrustFlow — Agent Payment Simulation
        </h1>
        <p style={{ color: "#555", marginTop: 8 }}>
          An AI agent can propose payments, but funds only move within
          cryptographically enforced on-chain policies.
        </p>
      </header>

      {/* AUTHORITY / TRUST SECTION */}
      <section
        style={{
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 8,
          marginBottom: 32,
          background: "#fafafa",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Authority & Trust</h2>
        <ul style={{ marginTop: 12, lineHeight: 1.6 }}>
          <li>
            <strong>Owner wallet:</strong> Connected (used only for configuration)
          </li>
          <li>
            <strong>Address book:</strong> Signed & verified before every execution
          </li>
          <li>
            <strong>Agent:</strong> Untrusted — cannot sign or move funds
          </li>
        </ul>
      </section>

      {/* INTENT INPUT */}
      <section
        style={{
          padding: 24,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>
          Propose a Payment
        </h2>
        <p style={{ color: "#555", marginTop: 4 }}>
          The agent interprets intent. All enforcement happens outside the AI.
        </p>

        <form onSubmit={submit} style={{ marginTop: 16 }}>
          <label style={{ display: "block", marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={useLLM}
              onChange={(e) => setUseLLM(e.target.checked)}
            />{" "}
            Use AI to interpret intent (OpenAI — interpretation only)
          </label>

          {useLLM ? (
            <>
              <label style={{ display: "block", marginTop: 12 }}>
                Natural language instruction
              </label>
              <textarea
                value={natural}
                onChange={(e) => setNatural(e.target.value)}
                placeholder="Pay 0.1 MNEE to my designer"
                style={{ width: "100%", padding: 8, minHeight: 80 }}
              />
            </>
          ) : (
            <>
              <label style={{ display: "block", marginTop: 12 }}>
                Recipient (name from signed address book)
              </label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />

              <label style={{ display: "block", marginTop: 12 }}>
                Amount (MNEE)
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: "100%", padding: 8 }}
              />
            </>
          )}

          <label style={{ display: "block", marginTop: 12 }}>
            Agent Address (policy-bound)
          </label>
          <input
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 20,
              padding: "10px 16px",
              fontWeight: 600,
            }}
          >
            {loading ? "Simulating…" : "Simulate Policy-Enforced Payment"}
          </button>
        </form>
      </section>

      {/* RESULT */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Execution Result</h2>

        {!result && (
          <p style={{ color: "#777", marginTop: 8 }}>
            No execution yet.
          </p>
        )}

        {result && (
          <div
            style={{
              marginTop: 12,
              padding: 16,
              borderRadius: 8,
              background: "#f7f7f7",
              border: "1px solid #ddd",
            }}
          >
            <p>
              <strong>Execution mode:</strong>{" "}
              {result.executionMode || "unknown"}
            </p>

            {result.explanation && (
              <p style={{ marginTop: 8, color: "#555" }}>
                {result.explanation}
              </p>
            )}

            <pre
              style={{
                marginTop: 16,
                padding: 12,
                background: "#fff",
                border: "1px solid #e0e0e0",
                overflowX: "auto",
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}

// "use client";
// import React, { useState } from "react";

// export default function TrustflowPage() {
//   const [recipient, setRecipient] = useState("designer");
//   const [amount, setAmount] = useState("0.1");
//   const [agent, setAgent] = useState("0xAgentAddress00000000000000000000000000000000");
//   const [natural, setNatural] = useState("");
//   const [useLLM, setUseLLM] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setResult(null);
//     try {
//       const body: any = { agentAddress: agent };
//       if (useLLM && natural.trim()) {
//         body.naturalLanguage = natural;
//       } else {
//         body.recipientName = recipient;
//         body.amount = (Number(amount) * 1e18).toString();
//       }

//       const res = await fetch("/api/trustflow/execute", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const json = await res.json();
//       setResult(json);
//     } catch (err) {
//       setResult({ error: String(err) });
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main style={{ padding: 24 }}>
//       <h1>TrustFlow — Payment Simulation</h1>
//       <form onSubmit={submit} style={{ maxWidth: 720 }}>
//         <label style={{ display: "block", marginTop: 12 }}>
//           <input type="checkbox" checked={useLLM} onChange={(e) => setUseLLM(e.target.checked)} /> Use natural language (OpenAI)
//         </label>

//         {useLLM ? (
//           <>
//             <label style={{ display: "block", marginTop: 12 }}>Natural language instruction</label>
//             <textarea value={natural} onChange={(e) => setNatural(e.target.value)} style={{ width: "100%" }} />
//           </>
//         ) : (
//           <>
//             <label style={{ display: "block", marginTop: 12 }}>Recipient (name)</label>
//             <input value={recipient} onChange={(e) => setRecipient(e.target.value)} style={{ width: "100%" }} />

//             <label style={{ display: "block", marginTop: 12 }}>Amount (MNEE)</label>
//             <input value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%" }} />
//           </>
//         )}

//         <label style={{ display: "block", marginTop: 12 }}>Agent Address</label>
//         <input value={agent} onChange={(e) => setAgent(e.target.value)} style={{ width: "100%" }} />

//         <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
//           {loading ? "Simulating…" : "Simulate Payment"}
//         </button>
//       </form>

//       <section style={{ marginTop: 24 }}>
//         <h2>Result</h2>
//         <pre style={{ background: "#f7f7f7", padding: 12 }}>{JSON.stringify(result, null, 2)}</pre>
//       </section>
//     </main>
//   );
// }
