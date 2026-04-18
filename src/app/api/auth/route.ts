import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, verifyTeeRpcIntegrity } from "@magicblock-labs/ephemeral-rollups-sdk";
import * as nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";

const TEE_URL = "https://tee.magicblock.app";

export async function POST(req: NextRequest) {
    try {
        const { publicKey, signature, message } = await req.json();

        if (!publicKey || !signature || !message) {
            return NextResponse.json(
                { error: "publicKey, signature, and message required" },
                { status: 400 }
            );
        }

        // verify TEE integrity
        const isVerified = await verifyTeeRpcIntegrity(TEE_URL);
        if (!isVerified) {
            return NextResponse.json({ error: "TEE integrity check failed" }, { status: 500 });
        }

        // get auth token — signing happens on the frontend, we just pass the sign function
        const pubkey = new PublicKey(publicKey);
        const signatureBytes = Uint8Array.from(Buffer.from(signature, "base64"));
        const messageBytes = Uint8Array.from(Buffer.from(message, "base64"));

        // verify signature locally before requesting token
        const isValid = nacl.sign.detached.verify(messageBytes, signatureBytes, pubkey.toBytes());
        if (!isValid) {
            return NextResponse.json({ error: "invalid signature" }, { status: 401 });
        }

        const authToken = await getAuthToken(
            TEE_URL,
            pubkey,
            (_msg: Uint8Array) => Promise.resolve(signatureBytes)
        );

        return NextResponse.json({ token: authToken.token });
    } catch (err) {
        console.error("auth error:", err);
        return NextResponse.json({ error: "auth failed" }, { status: 500 });
    }
}