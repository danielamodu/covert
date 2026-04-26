import { NextRequest, NextResponse } from "next/server";
import { buildTransfer } from "@/lib/magicblock";
import { rateLimit } from "@/lib/rateLimit";
import { isValidSolanaAddress, isValidAmount } from "@/lib/validate";

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(ip, 10, 60000)) {
        return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const { from, to, mint, amount, visibility, fromBalance, toBalance, cluster, memo } = body;

    if (!from || !to || !mint || !amount || !visibility || !fromBalance || !toBalance) {
        return NextResponse.json({ error: "missing required fields" }, { status: 400 });
    }

    if (!isValidSolanaAddress(from) || !isValidSolanaAddress(to)) {
        return NextResponse.json({ error: "invalid addresses" }, { status: 400 });
    }
    if (!isValidAmount(amount / 1e6)) {
        return NextResponse.json({ error: "invalid amount" }, { status: 400 });
    }

    const result = await buildTransfer({ from, to, mint, amount, visibility, fromBalance, toBalance, cluster, memo });
    return NextResponse.json(result);
}