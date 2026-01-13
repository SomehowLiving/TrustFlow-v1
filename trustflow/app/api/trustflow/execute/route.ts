import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MNEE_POLICY_EXECUTOR } from "../../../../constants";
import { encodeFunctionData } from "viem";
import { ethers } from "ethers";

const root = path.resolve(process.cwd(), "trustflow");

function loadJSON(filename: string) {
    const full = path.join(root, filename);
    if (!fs.existsSync(full)) return null;
    return JSON.parse(fs.readFileSync(full, "utf8"));
}

async function parseIntentWithOpenAI(naturalLanguage: string) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY not configured");

    const system = `You are a strict JSON extractor for the TrustFlow demo. Given a user instruction about payments, return JSON with keys: intent (string), recipient (short name), amount (number in MNEE). Return ONLY valid JSON.`;
    const user = `Instruction: ${naturalLanguage}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: system },
                { role: "user", content: user },
            ],
            temperature: 0,
            max_tokens: 200,
        }),
    });

    const j = await res.json();
    const content = j?.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI returned no content");

    // Attempt to parse JSON from the model output
    const firstJson = content.trim();
    try {
        return JSON.parse(firstJson);
    } catch (e) {
        // Try to extract JSON substring
        const m = firstJson.match(/\{[\s\S]*\}/);
        if (!m) throw new Error("OpenAI did not return valid JSON");
        return JSON.parse(m[0]);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Allow either explicit recipientName+amount OR naturalLanguage input
        let recipientName = body.recipientName;
        let amount = body.amount; // expected as string or number in wei (string preferred)
        const agentAddress = body.agentAddress;

        if (!agentAddress) {
            return NextResponse.json({ error: "missing agentAddress" }, { status: 400 });
        }

        if (body.naturalLanguage) {
            // Use LLM only for interpretation of intent
            const parsed = await parseIntentWithOpenAI(body.naturalLanguage);
            if (!parsed || !parsed.recipient || !parsed.amount) {
                return NextResponse.json({ error: "OpenAI parse failed" }, { status: 400 });
            }
            recipientName = parsed.recipient;
            // convert numeric amount (in MNEE) to wei string
            const amountNumber = Number(parsed.amount);
            amount = BigInt(Math.floor(amountNumber * 1e18)).toString();
        }

        if (!recipientName || !amount) {
            return NextResponse.json({ error: "missing fields" }, { status: 400 });
        }

        const addressbook = loadJSON("addressbook.json");
        if (!addressbook) {
            return NextResponse.json({ error: "address book not available" }, { status: 400 });
        }

        // verify signature on the address book (owner must sign the `signedMessage` field)
        const signedMessage = addressbook.signedMessage;
        const signature = addressbook.signature;
        const owner = addressbook.owner;
        if (!signedMessage || !signature || !owner) {
            return NextResponse.json({ error: "address book signature missing or incomplete" }, { status: 400 });
        }

        let recovered: string;
        try {
            recovered = ethers.utils.verifyMessage(signedMessage, signature);
        } catch (e) {
            return NextResponse.json({ error: "address book signature invalid" }, { status: 403 });
        }
        if (recovered.toLowerCase() !== owner.toLowerCase()) {
            return NextResponse.json({ error: "address book signature does not match owner" }, { status: 403 });
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

        const amt = BigInt(amount.toString());
        const maxPerTx = BigInt(policy.maxPerTx || "0");
        if (amt > maxPerTx) {
            return NextResponse.json({ error: "amount exceeds per-transaction limit" }, { status: 403 });
        }

        // ABI-encode calldata using viem for production-correct calldata
        const abi = ["function executePayment(address recipient,uint256 amount)"];
        const calldata = encodeFunctionData({ abi, functionName: "executePayment", args: [recipient, amt] });

        const simulated = {
            executionMode: "simulated",
            explanation:
                "MNEE is a real mainnet stablecoin. For hackathon safety, this demo DOES NOT broadcast transactions. The returned calldata is production-ready and targets the MNEEPolicyExecutor.",
            to: MNEE_POLICY_EXECUTOR,
            calldata,
            note: "No transactions are broadcast. This is a simulation with production ABI-encoded calldata.",
        };

        return NextResponse.json(simulated);
    } catch (err: any) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
