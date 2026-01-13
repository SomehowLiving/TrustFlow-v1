"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InterpretationPage() {
  const [intent, setIntent] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("trustflow_parsed_intent");
    if (raw) setIntent(JSON.parse(raw));
  }, []);

  function proceed() {
    if (!intent) return alert("No parsed intent available");
    router.push("/trustflow/execute");
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>TrustFlow — Agent Interpretation</h1>

      {!intent && (
        <div style={{ marginTop: 20 }}>
          <p>Unable to confidently interpret intent</p>
        </div>
      )}

      {intent && (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <label>Parsed by AI (interpretation only — no execution authority)</label>
          <pre style={{ marginTop: 12, background: "#fafafa", padding: 12 }}>{JSON.stringify(intent, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button onClick={proceed} disabled={!intent}>Proceed to Policy Enforcement</button>
      </div>
    </main>
  );
}
