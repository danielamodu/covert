import { NextRequest, NextResponse } from "next/server";

const USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
const MAGICBLOCK_URL = process.env.NEXT_PUBLIC_MAGICBLOCK_URL!;

// POST /api/agent/verify-solvency
// body: { address, required_amount, token }
// returns: { verified: boolean, message: string }
// never reveals actual balance
export async function POST(req: NextRequest) {
  const { address, required_amount, token } = await req.json();

  if (!address || !required_amount || !token) {
    return NextResponse.json(
      { error: "address, required_amount, token required" },
      { status: 400 }
    );
  }

  const res = await fetch(
    `${MAGICBLOCK_URL}/v1/spl/private-balance?address=${address}&mint=${USDC_MINT}&cluster=devnet`,
    { headers: { authorization: `Bearer ${token}` } }
  );

  const data = await res.json();
  const balance = parseFloat(data.balance ?? "0") / 1e6;
  const verified = balance >= required_amount;

  console.log("balance from API:", data);
  console.log("parsed balance:", balance);
  console.log("required:", required_amount);
  console.log("verified:", verified);

  return NextResponse.json({
    verified,
    message: verified
      ? `Agent has sufficient funds for this transaction`
      : `Insufficient private balance for this transaction`,
    // never return actual balance
  });
}
