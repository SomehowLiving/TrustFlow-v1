"use client";
import React, { useEffect, useState } from "react";

export default function ExecutePage() {
  const [intent, setIntent] = useState<any>(null);
  const [agentAddress, setAgentAddress] = useState("0xAgentAddress00000000000000000000000000000000");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("trustflow_parsed_intent");
    if (raw) setIntent(JSON.parse(raw));
  }, []);

  async function runExecution() {
    if (!intent) return alert("No intent available");
    setLoading(true);
    setResult(null);
    try {
      const body = { intent, agentAddress };
      // For backward compatibility the execute API accepts naturalLanguage or recipientName/amount fields
      const payload: any = { agentAddress };
      if (intent.action === "pay" && intent.recipient && intent.amount != null) {
        payload.recipientName = intent.recipient;
        // convert to wei string
        payload.amount = (Number(intent.amount) * 1e18).toString();
      } else {
        payload.naturalLanguage = intent.naturalLanguage || JSON.stringify(intent);
      }

      const res = await fetch("/api/trustflow/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      setResult(j);
    } catch (err: any) {
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>TrustFlow — Execution Simulation</h1>

      <section style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Verification Checklist</h2>
        <ul style={{ marginTop: 8 }}>
          <li>Address book signature verified (checked on backend)</li>
          <li>Recipient resolved from signed address book</li>
          <li>Policy loaded for agent</li>
          <li>Limits enforced</li>
        </ul>
      </section>

      <section style={{ marginTop: 16 }}>
        <label>Agent Address</label>
        <input value={agentAddress} onChange={(e) => setAgentAddress(e.target.value)} style={{ width: "100%", marginTop: 8 }} />
      </section>

      <div style={{ marginTop: 12 }}>
        <button onClick={runExecution} disabled={loading}>{loading ? "Running…" : "Simulate Execution"}</button>
      </div>

      <section style={{ marginTop: 20 }}>
        {result && result.error && (
          <div style={{ padding: 12, border: "1px solid #f5c6cb", background: "#f8d7da", color: "#721c24" }}>
            <strong>Execution Failed</strong>
            <pre style={{ marginTop: 8 }}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        {result && !result.error && (
          <div style={{ padding: 12, border: "1px solid #d4edda", background: "#dff0d8", color: "#155724" }}>
            <strong>Simulation Result</strong>
            <p style={{ marginTop: 8 }}>{result.explanation}</p>
            <pre style={{ marginTop: 8, background: "#fff", padding: 12 }}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </section>
    </main>
  );
}
