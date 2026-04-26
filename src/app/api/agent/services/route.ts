import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isValidSolanaAddress, isValidString, isValidAmount } from "@/lib/validate";

// GET /api/agent/services — list all services
export async function GET() {
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ services: data });
}

// POST /api/agent/services — list a new service
export async function POST(req: NextRequest) {
    const { name, category, description, price, seller_address } = await req.json();

    if (!name || !category || !description || !price || !seller_address) {
        return NextResponse.json({ error: "missing required fields" }, { status: 400 });
    }

    if (!isValidSolanaAddress(seller_address)) {
        return NextResponse.json({ error: "invalid seller address" }, { status: 400 });
    }
    if (!isValidString(name, 100) || !isValidString(description, 1000)) {
        return NextResponse.json({ error: "invalid name or description" }, { status: 400 });
    }
    if (!isValidAmount(price)) {
        return NextResponse.json({ error: "invalid price" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("services")
        .insert({ name, category, description, price, seller_address })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ service: data });
}