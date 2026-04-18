import { NextRequest, NextResponse } from "next/server";
import { buildTransfer } from "@/lib/magicblock";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { from, to, mint, amount, visibility, fromBalance, toBalance, cluster, memo } = body;

    if (!from || !to || !mint || !amount || !visibility || !fromBalance || !toBalance) {
        return NextResponse.json({ error: "missing required fields" }, { status: 400 });
    }

    const result = await buildTransfer({ from, to, mint, amount, visibility, fromBalance, toBalance, cluster, memo });
    return NextResponse.json(result);
}