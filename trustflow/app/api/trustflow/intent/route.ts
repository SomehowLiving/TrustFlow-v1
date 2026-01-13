import { NextResponse } from "next/server";

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

    const firstJson = content.trim();
    try {
        return JSON.parse(firstJson);
    } catch (e) {
        const m = firstJson.match(/\{[\s\S]*\}/);
        if (!m) throw new Error("OpenAI did not return valid JSON");
        return JSON.parse(m[0]);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { naturalLanguage } = body;
        if (!naturalLanguage) return NextResponse.json({ error: "missing naturalLanguage" }, { status: 400 });

        const parsed = await parseIntentWithOpenAI(naturalLanguage);
        return NextResponse.json({ intent: parsed });
    } catch (err: any) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
