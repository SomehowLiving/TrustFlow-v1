import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const root = path.resolve(process.cwd());

function loadJSON(filename: string) {
    const full = path.join(root, filename);
    if (!fs.existsSync(full)) return null;
    return JSON.parse(fs.readFileSync(full, "utf8"));
}

function saveJSON(filename: string, data: any) {
    const full = path.join(root, filename);
    fs.writeFileSync(full, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { agentAddress, maxPerTxWei, dailyCapWei, weeklyCapWei, owner } = body;
        if (!agentAddress || !maxPerTxWei || !dailyCapWei || !weeklyCapWei || !owner) {
            return NextResponse.json({ error: "missing fields" }, { status: 400 });
        }

        const addressbook = loadJSON("addressbook.json");
        if (!addressbook || !addressbook.owner) {
            return NextResponse.json({ error: "address book missing or unsigned" }, { status: 400 });
        }

        // Prevent agents / arbitrary callers from self-configuring: require owner to match signed address book owner
        if (owner.toLowerCase() !== addressbook.owner.toLowerCase()) {
            return NextResponse.json({ error: "owner must match signed address book owner" }, { status: 403 });
        }

        const policies = loadJSON("policies.json") || { agents: {} };
        policies.agents = policies.agents || {};

        policies.agents[agentAddress] = {
            maxPerTx: String(maxPerTxWei),
            dailyCap: String(dailyCapWei),
            weeklyCap: String(weeklyCapWei),
        };

        saveJSON("policies.json", policies);

        return NextResponse.json({ status: "saved", agent: agentAddress, policy: policies.agents[agentAddress] });
    } catch (err: any) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
