import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/agent/auction?service_id=xxx — get auction status
// Returns: { highest_bid, bid_count, time_remaining, ended }
// Note: highest_bid amount is hidden while auction is live — only show "X bids placed"
export async function GET(req: NextRequest) {
  const service_id = req.nextUrl.searchParams.get("service_id");

  if (!service_id) {
    return NextResponse.json({ error: "service_id is required" }, { status: 400 });
  }

  const { data: bids } = await supabase
    .from("bids")
    .select("amount, status")
    .eq("service_id", service_id)
    .order("amount", { ascending: false });

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("auction_end_time, min_bid")
    .eq("id", service_id)
    .single();

  if (serviceError || !service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const now = new Date();
  const endTime = new Date(service.auction_end_time);
  const ended = now > endTime;
  const timeRemaining = ended ? 0 : Math.floor((endTime.getTime() - now.getTime()) / 1000);

  return NextResponse.json({
    bid_count: bids?.length ?? 0,
    ended,
    time_remaining: timeRemaining,
    min_bid: service.min_bid,
    // only reveal highest bid amount if auction ended
    highest_bid: ended ? (bids?.[0]?.amount ?? 0) : null,
  });
}
