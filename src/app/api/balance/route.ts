import { NextRequest, NextResponse } from "next/server";
import { getBalance, getPrivateBalance } from "@/lib/magicblock";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    const mint = searchParams.get("mint");
    const cluster = searchParams.get("cluster") || "devnet";
    const token = searchParams.get("token") || undefined;

    if (!address || !mint) {
        return NextResponse.json({ error: "address and mint required" }, { status: 400 });
    }

    const [base, private_] = await Promise.all([
        getBalance(address, mint, cluster),
        getPrivateBalance(address, mint, cluster, token ? `Bearer ${token}` : undefined),
    ]);

    return NextResponse.json({ base, private: private_ });
}