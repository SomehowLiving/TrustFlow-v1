"use client";
import React, { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

function toWei(mnee: string) {
  const n = Number(mnee || "0");
  if (isNaN(n)) return "0";
  return BigInt(Math.floor(n * 1e18)).toString();
}

export default function PolicyPage() {
  const [agentAddress, setAgentAddress] = useState("");
  const [maxPerTx, setMaxPerTx] = useState("");
  const [dailyCap, setDailyCap] = useState("");
  const [weeklyCap, setWeeklyCap] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [activePolicy, setActivePolicy] = useState<any | null>(null);

  useEffect(() => {
    // attempt to load existing policy for default agentAddress if present in query
  }, []);

  async function loadPolicy() {
    if (!agentAddress) return alert("Enter agent address");
    const res = await fetch(`/policies.json`);
    if (!res.ok) return setActivePolicy(null);
    const j = await res.json();
    setActivePolicy(j.agents?.[agentAddress] || null);
  }

  async function savePolicy() {
    if (!agentAddress) return alert("Enter agent address");

    try {
      // derive owner from signer to avoid mismatch
      if (!(window as any).ethereum) return alert("No injected wallet");
      const provider = new BrowserProvider((window as any).ethereum as any);
      const signer = await provider.getSigner();
      const ownerFromSigner = await signer.getAddress();
      console.log("POLICY SIGNER ADDRESS:", ownerFromSigner);

      const body = {
        agentAddress,
        maxPerTxWei: toWei(maxPerTx),
        dailyCapWei: toWei(dailyCap),
        weeklyCapWei: toWei(weeklyCap),
        owner: ownerFromSigner,
      };

      const res = await fetch("/api/trustflow/policy/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      setStatus("saved");
      setActivePolicy(j.policy || null);
    } catch (err: any) {
      setStatus(String(err));
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Agent Policy Setup</h1>

      <section style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <p>
          These limits are enforced server-side. The agent cannot bypass them.
        </p>

        <label style={{ display: "block", marginTop: 12 }}>Agent Address</label>
        <input value={agentAddress} onChange={(e) => setAgentAddress(e.target.value)} style={{ width: "100%" }} />

        <label style={{ display: "block", marginTop: 12 }}>Max Per Transaction (MNEE)</label>
        <input value={maxPerTx} onChange={(e) => setMaxPerTx(e.target.value)} style={{ width: "100%" }} />

        <label style={{ display: "block", marginTop: 12 }}>Daily Cap (MNEE)</label>
        <input value={dailyCap} onChange={(e) => setDailyCap(e.target.value)} style={{ width: "100%" }} />

        <label style={{ display: "block", marginTop: 12 }}>Weekly Cap (MNEE)</label>
        <input value={weeklyCap} onChange={(e) => setWeeklyCap(e.target.value)} style={{ width: "100%" }} />

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={savePolicy}>Save Policy</button>
          <button onClick={loadPolicy}>Load Policy</button>
        </div>

        {status && (
          <div style={{ marginTop: 12 }}>
            <strong>Status:</strong> {status}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <label>Active Policy for agent</label>
          <pre style={{ background: "#fafafa", padding: 12 }}>{JSON.stringify(activePolicy, null, 2)}</pre>
        </div>
      </section>
    </main>
  );
}
