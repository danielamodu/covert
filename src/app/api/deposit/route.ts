import { NextRequest, NextResponse } from "next/server";
import { buildDeposit } from "@/lib/magicblock";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { owner, amount, mint, cluster } = body;

    if (!owner || !amount || !mint) {
        return NextResponse.json({ error: "owner, amount, mint required" }, { status: 400 });
    }

    const result = await buildDeposit({ owner, amount, mint, cluster });
    return NextResponse.json(result);
}