import { NextRequest, NextResponse } from "next/server";
import { buildDeposit } from "@/lib/magicblock";
import { rateLimit } from "@/lib/rateLimit";
import { isValidSolanaAddress, isValidAmount } from "@/lib/validate";

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(ip, 10, 60000)) {
        return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const { owner, amount, mint, cluster } = body;

    if (!owner || !amount || !mint) {
        return NextResponse.json({ error: "owner, amount, mint required" }, { status: 400 });
    }

    if (!isValidSolanaAddress(owner)) {
        return NextResponse.json({ error: "invalid owner address" }, { status: 400 });
    }
    if (!isValidAmount(amount / 1e6)) {
        return NextResponse.json({ error: "invalid amount" }, { status: 400 });
    }

    const result = await buildDeposit({ owner, amount, mint, cluster });
    return NextResponse.json(result);
}