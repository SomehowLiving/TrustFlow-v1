"use client";
import React, { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

function deterministicStringify(obj: any) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(deterministicStringify).join(",")} ]`;
  const keys = Object.keys(obj).sort();
  const parts = keys.map((k) => `${JSON.stringify(k)}:${deterministicStringify(obj[k])}`);
  return `{${parts.join(",")}}`;
}

export default function SetupPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [entries, setEntries] = useState<{ name: string; address: string }[]>([
    { name: "designer", address: "0xB7BdA0b6a477db6c370B6e83311Efe1092Ba6a08" },
  ]);
  const [status, setStatus] = useState<string>("Not signed");
  const [signedBy, setSignedBy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // try to detect injected wallet
    if ((window as any).ethereum) {
      (window as any).ethereum.request({ method: "eth_accounts" }).then((accs: string[]) => {
        if (accs && accs.length) setAddress(accs[0]);
      });
    }
  }, []);

  function addEntry() {
    setEntries([...entries, { name: "", address: "" }]);
  }

  function removeEntry(i: number) {
    const copy = entries.slice();
    copy.splice(i, 1);
    setEntries(copy);
  }

  function updateEntry(i: number, k: string, v: string) {
    const copy = entries.slice();
    (copy[i] as any)[k] = v;
    setEntries(copy);
  }

  async function connectWallet() {
    if (!(window as any).ethereum) return alert("No injected wallet found");
    try {
      const accs = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accs[0]);
    } catch (e) {
      console.error(e);
    }
  }

  async function signAddressBook() {
    if (!address) return alert("Connect wallet first");
    setLoading(true);
    try {
      const entriesObj: any = {};
      for (const e of entries) entriesObj[e.name] = e.address;
      const message = {
        domain: "TrustFlow",
        version: 1,
        entries: entriesObj,
        timestamp: Math.floor(Date.now() / 1000),
      };

      const serialized = deterministicStringify(message);

      // Create a signer instance and derive the owner from the actual signer
      if (!(window as any).ethereum) throw new Error("No injected wallet found");
      const provider = new BrowserProvider((window as any).ethereum as any);
      const signer = await provider.getSigner();
      const ownerFromSigner = await signer.getAddress();
      console.log("SIGNER ADDRESS:", ownerFromSigner);

      // Sign the exact serialized string and send that string as `message`
      const signature = await signer.signMessage(serialized);

      console.log("OWNER SENT TO BACKEND:", ownerFromSigner);

      const res = await fetch("/api/trustflow/addressbook/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: ownerFromSigner, message: serialized, signature }),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      setStatus("Signed & verified");
      setSignedBy(j.owner || address);
    } catch (err: any) {
      setStatus("Not signed");
      alert(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>TrustFlow — Owner Setup</h1>

      <section style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Wallet Connection</h2>
        <p>
          {address ? (
            <>
              Connected as: <strong>{address}</strong>
            </>
          ) : (
            <>
              Not connected <button onClick={connectWallet} style={{ marginLeft: 12 }}>Connect Wallet</button>
            </>
          )}
        </p>
      </section>

      <section style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Address Book (Owner Configuration)</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "left" }}>Address</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={i}>
                <td style={{ padding: 6 }}>
                  <input value={e.name} onChange={(ev) => updateEntry(i, "name", ev.target.value)} />
                </td>
                <td style={{ padding: 6 }}>
                  <input value={e.address} onChange={(ev) => updateEntry(i, "address", ev.target.value)} style={{ width: "100%" }} />
                </td>
                <td style={{ padding: 6 }}>
                  <button onClick={() => removeEntry(i)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>
          <button onClick={addEntry}>+ Add Entry</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>JSON Preview:</label>
          <pre style={{ background: "#fafafa", padding: 12, border: "1px solid #eee" }}>
            {JSON.stringify(Object.fromEntries(entries.map((r) => [r.name, r.address])), null, 2)}
          </pre>
        </div>
      </section>

      <section style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Signature</h2>
        <p>Status: {status} {signedBy && <span> — Signed by: {signedBy}</span>}</p>
        <div style={{ marginTop: 12 }}>
          <button onClick={signAddressBook} disabled={loading}>{loading ? "Signing…" : "Sign Address Book (Owner Wallet)"}</button>
        </div>
      </section>
    </main>
  );
}
