"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function IntentPage() {
  const [natural, setNatural] = useState("Pay 1 MNEE to my designer");
  const [useLLM, setUseLLM] = useState(true);
  const [recipient, setRecipient] = useState("designer");
  const [amount, setAmount] = useState("1");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (useLLM) {
        const res = await fetch("/api/trustflow/intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ naturalLanguage: natural }),
        });
        const j = await res.json();
        if (j.error) throw new Error(j.error || "failed to parse intent");
        // store parsed intent in sessionStorage for next page
        sessionStorage.setItem("trustflow_parsed_intent", JSON.stringify(j.intent));
        router.push("/trustflow/interpretation");
      } else {
        const payload = { action: "pay", recipient: recipient, amount: Number(amount) };
        sessionStorage.setItem("trustflow_parsed_intent", JSON.stringify(payload));
        router.push("/trustflow/interpretation");
      }
    } catch (err: any) {
      alert(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>TrustFlow — Intent Input</h1>

      <form onSubmit={submit} style={{ marginTop: 20 }}>
        <label>
          <input type="checkbox" checked={useLLM} onChange={(e) => setUseLLM(e.target.checked)} /> Use AI interpretation (OpenAI — interpretation only)
        </label>

        {useLLM ? (
          <>
            <label style={{ display: "block", marginTop: 12 }}>Natural language</label>
            <textarea value={natural} onChange={(e) => setNatural(e.target.value)} style={{ width: "100%", minHeight: 120 }} />
          </>
        ) : (
          <>
            <label style={{ display: "block", marginTop: 12 }}>Recipient (name)</label>
            <input value={recipient} onChange={(e) => setRecipient(e.target.value)} style={{ width: "100%" }} />

            <label style={{ display: "block", marginTop: 12 }}>Amount (MNEE)</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%" }} />
          </>
        )}

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>{loading ? "Parsing…" : "Submit Intent"}</button>
        </div>
      </form>
    </main>
  );
}
