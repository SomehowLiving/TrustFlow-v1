import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";

const root = path.resolve(process.cwd(), "trustflow");

function saveJSON(filename: string, data: any) {
    const full = path.join(root, filename);
    fs.writeFileSync(full, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { owner, message, signature } = body;
        if (!owner || !message || !signature) {
            return NextResponse.json({ error: "missing fields" }, { status: 400 });
        }

        // verify signature matches owner
        let recovered: string;
        try {
            recovered = ethers.utils.verifyMessage(message, signature);
        } catch (e) {
            return NextResponse.json({ error: "invalid signature format" }, { status: 400 });
        }

        if (recovered.toLowerCase() !== owner.toLowerCase()) {
            return NextResponse.json({ error: "signature does not match owner" }, { status: 403 });
        }

        // persist addressbook container with explicit fields expected by execute route
        const parsed = JSON.parse(message);
        const container = {
            owner,
            signedMessage: message,
            signature,
            entries: parsed.entries || parsed,
            timestamp: parsed.timestamp || Date.now(),
        };

        saveJSON("addressbook.json", container);

        return NextResponse.json({ status: "verified", owner: recovered });
    } catch (err: any) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
