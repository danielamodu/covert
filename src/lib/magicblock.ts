const MAGICBLOCK_URL = process.env.NEXT_PUBLIC_MAGICBLOCK_URL!;

export async function getBalance(address: string, mint: string, cluster = "devnet") {
    const res = await fetch(
        `${MAGICBLOCK_URL}/v1/spl/balance?address=${address}&mint=${mint}&cluster=${cluster}`
    );
    return res.json();
}

export async function getPrivateBalance(address: string, mint: string, cluster = "devnet") {
    const res = await fetch(
        `${MAGICBLOCK_URL}/v1/spl/private-balance?address=${address}&mint=${mint}&cluster=${cluster}`
    );
    return res.json();
}

export async function buildDeposit(body: {
    owner: string;
    amount: number;
    mint: string;
    cluster?: string;
    initIfMissing?: boolean;
    initVaultIfMissing?: boolean;
}) {
    const res = await fetch(`${MAGICBLOCK_URL}/v1/spl/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initIfMissing: true, initVaultIfMissing: true, cluster: "devnet", ...body }),
    });
    return res.json();
}

export async function buildTransfer(body: {
    from: string;
    to: string;
    mint: string;
    amount: number;
    visibility: "public" | "private";
    fromBalance: "base" | "ephemeral";
    toBalance: "base" | "ephemeral";
    cluster?: string;
    memo?: string;
}) {
    const res = await fetch(`${MAGICBLOCK_URL}/v1/spl/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initIfMissing: true, initAtasIfMissing: true, initVaultIfMissing: true, cluster: "devnet", ...body }),
    });
    return res.json();
}

export async function buildWithdraw(body: {
    owner: string;
    mint: string;
    amount: number;
    cluster?: string;
}) {
    const res = await fetch(`${MAGICBLOCK_URL}/v1/spl/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idempotent: true, cluster: "devnet", ...body }),
    });
    return res.json();
}