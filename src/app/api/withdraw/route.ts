import { NextRequest, NextResponse } from "next/server";
import { buildWithdraw } from "@/lib/magicblock";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(ip, 10, 60000)) {
        return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const { owner, mint, amount, cluster } = body;

    if (!owner || !mint || !amount) {
        return NextResponse.json({ error: "owner, mint, amount required" }, { status: 400 });
    }

    const result = await buildWithdraw({ owner, mint, amount, cluster });
    return NextResponse.json(result);
}