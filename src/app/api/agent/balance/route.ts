import { NextRequest, NextResponse } from "next/server";
import { getBalance } from "@/lib/magicblock";

const USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

// GET /api/agent/balance?address=xxx&token=xxx
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    const token = searchParams.get("token");

    if (!address) {
        return NextResponse.json({ error: "address required" }, { status: 400 });
    }

    const base = await getBalance(address, USDC_MINT, "devnet");

    const result: any = {
        address,
        public_balance: (parseFloat(base.balance ?? "0") / 1e6).toFixed(4),
    };

    // if token provided, fetch private balance too
    if (token) {
        const headers: Record<string, string> = { authorization: `Bearer ${token}` };
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_MAGICBLOCK_URL}/v1/spl/private-balance?address=${address}&mint=${USDC_MINT}&cluster=devnet`,
            { headers }
        );
        const data = await res.json();
        result.private_balance = (parseFloat(data.balance ?? "0") / 1e6).toFixed(4);
    }

    return NextResponse.json(result);
}