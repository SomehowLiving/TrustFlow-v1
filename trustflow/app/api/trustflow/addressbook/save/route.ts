import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import crypto from "crypto";

const root = path.resolve(process.cwd());

function saveJSON(filename: string, data: any) {
    const full = path.join(root, filename);
    fs.writeFileSync(full, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { owner, message, signature } = body;
        if (!owner || message === undefined || !signature) {
            return NextResponse.json({ error: "missing fields" }, { status: 400 });
        }

        // Ensure the client provided the exact signed string
        if (typeof message !== "string") {
            return NextResponse.json({ error: "message must be the exact signed string (type: string)" }, { status: 400 });
        }

        // Minimal diagnostic: compute sha256 of the message (do NOT expose the message)
        const messageHash = crypto.createHash("sha256").update(message, "utf8").digest("hex");
        console.info("AddressBook save: verifying signature", { owner, messageLength: message.length, messageHash });

        // verify signature matches owner using the exact string provided by the client
        let recovered: string;
        try {
            recovered = ethers.verifyMessage(message, signature);
            console.info("Signature identity check", {
                claimedOwner: owner,
                recoveredSigner: recovered,
                same: recovered.toLowerCase() === owner.toLowerCase(),
            });

        } catch (e) {
            console.warn("Signature verification failed (verifyMessage threw)", { owner, messageHash, err: String(e) });
            return NextResponse.json({ error: "invalid signature format or signature does not match message" }, { status: 400 });
        }

        if (recovered.toLowerCase() !== owner.toLowerCase()) {
            console.warn("Signature recovered address mismatch", { owner, recovered, messageHash });
            return NextResponse.json({ error: "signature does not match owner" }, { status: 403 });
        }

        // Only after successful verification, parse the message JSON to extract entries
        let parsed: any;
        try {
            parsed = JSON.parse(message);
        } catch (e) {
            console.warn("Signed message parsed but is not valid JSON", { owner, messageHash });
            return NextResponse.json({ error: "signed message is not valid JSON" }, { status: 400 });
        }

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
