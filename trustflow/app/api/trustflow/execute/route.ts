import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MNEE_POLICY_EXECUTOR } from "../../../../constants";

const root = path.resolve(process.cwd(), "trustflow");

function loadJSON(filename: string) {
    const full = path.join(root, filename);
    if (!fs.existsSync(full)) return null;
    return JSON.parse(fs.readFileSync(full, "utf8"));
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { recipientName, amount, agentAddress } = body;

        if (!recipientName || !amount || !agentAddress) {
            return NextResponse.json({ error: "missing fields" }, { status: 400 });
        }

        const addressbook = loadJSON("addressbook.json");
        if (!addressbook || !addressbook.signed) {
            return NextResponse.json({ error: "address book not available or not signed" }, { status: 400 });
        }

        const recipient = addressbook.entries?.[recipientName];
        if (!recipient) {
            return NextResponse.json({ error: "recipient not authorized" }, { status: 403 });
        }

        const policies = loadJSON("policies.json") || { agents: {} };
        const policy = policies.agents?.[agentAddress];
        if (!policy) {
            return NextResponse.json({ error: "no active policy for agent" }, { status: 403 });
        }

        const amt = BigInt(amount);
        const maxPerTx = BigInt(policy.maxPerTx || "0");
        if (amt > maxPerTx) {
            return NextResponse.json({ error: "amount exceeds per-transaction limit" }, { status: 403 });
        }

        // Construct a deterministic simulation of calldata for the on-chain executor
        const simulated = {
            status: "simulated",
            to: MNEE_POLICY_EXECUTOR,
            calldata: {
                function: "executePayment",
                args: [recipient, amount.toString()],
            },
            note: "This is a simulation. No transaction was broadcast.",
        };

        return NextResponse.json(simulated);
    } catch (err: any) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
