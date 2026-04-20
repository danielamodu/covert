/**
 * Covert — Agent Demo Script
 * Simulates two AI agents transacting privately on the platform
 * 
 * Agent A (seller) lists a service
 * Agent B (buyer) discovers and buys it privately
 */

const BASE_URL = "http://localhost:3000";
const AGENT_A_ADDRESS = "2UeeogEc4YXvAwzkTuRpQNhiYDsNuDgVxPkrTWefJc9A";
const AGENT_B_ADDRESS = "2UeeogEc4YXvAwzkTuRpQNhiYDsNuDgVxPkrTWefJc9A";

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function log(msg, data = null) {
    console.log(`\n[${new Date().toISOString()}] ${msg}`);
    if (data) console.log(JSON.stringify(data, null, 2));
}

async function main() {
    console.log("╔════════════════════════════════════════╗");
    console.log("║     COVERT — Agent Commerce Demo       ║");
    console.log("║     Private Agent Commerce on Solana   ║");
    console.log("╚════════════════════════════════════════╝");

    // ── Step 1: Agent A lists a service ──────────────────────────────
    await log("AGENT A: Listing a new service on Covert...");

    const listRes = await fetch(`${BASE_URL}/api/agent/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Quantum Signal Feed",
            category: "Data",
            description: "Real-time quantum-encrypted market signals for autonomous trading agents.",
            price: 5,
            seller_address: AGENT_A_ADDRESS,
        }),
    });

    const { service } = await listRes.json();
    await log("AGENT A: Service listed successfully", service);
    await sleep(1000);

    // ── Step 2: Agent B discovers services ───────────────────────────
    await log("AGENT B: Scanning marketplace for available services...");

    const servicesRes = await fetch(`${BASE_URL}/api/agent/services`);
    const { services } = await servicesRes.json();
    await log(`AGENT B: Found ${services.length} service(s) on the marketplace`);

    const target = services.find(s => s.id === service.id);
    await log(`AGENT B: Targeting service — "${target.name}" at ${target.price} USDC`, {
        service_id: target.id,
        seller: target.seller_address,
        price: target.price,
    });
    await sleep(1000);

    // ── Step 3: Agent B checks public balance ─────────────────────────
    await log("AGENT B: Checking public USDC balance...");

    const balanceRes = await fetch(`${BASE_URL}/api/agent/balance?address=${AGENT_B_ADDRESS}`);
    const balance = await balanceRes.json();
    await log("AGENT B: Balance retrieved", balance);
    await sleep(1000);

    // ── Step 4: Agent B initiates private purchase ────────────────────
    await log("AGENT B: Initiating private purchase via MagicBlock PER...");

    const buyRes = await fetch(`${BASE_URL}/api/agent/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            service_id: target.id,
            buyer_address: AGENT_B_ADDRESS,
            amount: target.price,
        }),
    });

    const buyData = await buyRes.json();
    await log("AGENT B: Unsigned private transaction built", {
        kind: buyData.transaction?.kind,
        sendTo: buyData.transaction?.sendTo,
        requiredSigners: buyData.transaction?.requiredSigners,
        note: "Transaction routed through TEE — amount and identity shielded from public ledger",
    });
    await sleep(1000);

    // ── Step 5: Summary ───────────────────────────────────────────────
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║           DEMO COMPLETE                ║");
    console.log("╠════════════════════════════════════════╣");
    console.log(`║  Service listed:     ${service.name.padEnd(18)}║`);
    console.log(`║  Buyer:              ${AGENT_B_ADDRESS.slice(0, 6)}...${AGENT_B_ADDRESS.slice(-4).padEnd(8)}║`);
    console.log(`║  Seller:             ${AGENT_A_ADDRESS.slice(0, 6)}...${AGENT_A_ADDRESS.slice(-4).padEnd(8)}║`);
    console.log(`║  Amount:             ${String(target.price).padEnd(18)} USDC ║`);
    console.log("║  Privacy:            TEE-encrypted      ║");
    console.log("║  Visible on-chain:   commitment only    ║");
    console.log("╚════════════════════════════════════════╝");
}

main().catch(console.error);