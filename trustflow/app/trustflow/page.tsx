"use client";
import React, { useState } from "react";

export default function TrustflowPage() {
  const [recipient, setRecipient] = useState("designer");
  const [amount, setAmount] = useState("0.1");
  const [agent, setAgent] = useState("0xAgentAddress00000000000000000000000000000000");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/trustflow/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientName: recipient, amount: (Number(amount) * 1e18).toString(), agentAddress: agent }),
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
    <main style={{ padding: 24 }}>
      <h1>TrustFlow — Payment Simulation</h1>
      <form onSubmit={submit} style={{ maxWidth: 520 }}>
        <label style={{ display: "block", marginTop: 12 }}>Recipient (name)</label>
        <input value={recipient} onChange={(e) => setRecipient(e.target.value)} style={{ width: "100%" }} />

        <label style={{ display: "block", marginTop: 12 }}>Amount (MNEE)</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%" }} />

        <label style={{ display: "block", marginTop: 12 }}>Agent Address</label>
        <input value={agent} onChange={(e) => setAgent(e.target.value)} style={{ width: "100%" }} />

        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Simulating…" : "Simulate Payment"}
        </button>
      </form>

      <section style={{ marginTop: 24 }}>
        <h2>Result</h2>
        <pre style={{ background: "#f7f7f7", padding: 12 }}>{JSON.stringify(result, null, 2)}</pre>
      </section>
    </main>
  );
}
