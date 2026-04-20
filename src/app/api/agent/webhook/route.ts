import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { webhook_url, deal } = await req.json();

    if (!webhook_url) return NextResponse.json({ skipped: true });

    try {
        await fetch(webhook_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event: "deal.created",
                deal: {
                    id: deal.id,
                    service_id: deal.service_id,
                    buyer_address: deal.buyer_address,
                    amount: deal.amount,
                    status: deal.status,
                    created_at: deal.created_at,
                },
            }),
        });
        return NextResponse.json({ delivered: true });
    } catch (err) {
        return NextResponse.json({ delivered: false, error: "webhook delivery failed" });
    }
}