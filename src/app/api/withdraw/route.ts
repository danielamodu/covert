import { NextRequest, NextResponse } from "next/server";
import { buildWithdraw } from "@/lib/magicblock";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { owner, mint, amount, cluster } = body;

    if (!owner || !mint || !amount) {
        return NextResponse.json({ error: "owner, mint, amount required" }, { status: 400 });
    }

    const result = await buildWithdraw({ owner, mint, amount, cluster });
    return NextResponse.json(result);
}