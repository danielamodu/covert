import { NextRequest, NextResponse } from "next/server";
import { buildTransfer } from "@/lib/magicblock";
import { supabase } from "@/lib/supabase";

const USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

// POST /api/agent/buy
// body: { service_id, buyer_address, amount }
// returns unsigned transaction for the agent to sign and broadcast
export async function POST(req: NextRequest) {
    const { service_id, buyer_address, amount } = await req.json();

    if (!service_id || !buyer_address || !amount) {
        return NextResponse.json({ error: "service_id, buyer_address, amount required" }, { status: 400 });
    }

    // fetch service
    const { data: service, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", service_id)
        .single();

    if (error || !service) {
        return NextResponse.json({ error: "service not found" }, { status: 404 });
    }

    // build private transfer transaction
    const tx = await buildTransfer({
        from: buyer_address,
        to: service.seller_address,
        mint: USDC_MINT,
        amount: Math.round(amount * 1e6),
        visibility: "private",
        fromBalance: "ephemeral",
        toBalance: "ephemeral",
        cluster: "devnet",
        memo: `Purchase: ${service.name}`,
    });

    if (tx.error) {
        return NextResponse.json({ error: tx.error }, { status: 500 });
    }

    return NextResponse.json({
        transaction: tx,
        service: {
            id: service.id,
            name: service.name,
            seller_address: service.seller_address,
            price: service.price,
        },
    });
}