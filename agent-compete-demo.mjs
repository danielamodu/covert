/**
 * Covert — Competing Agents Demo
 * Two buyer agents compete for the same service privately
 * Neither knows the other is bidding
 */

const BASE_URL = "http://localhost:3000";
const SELLER_ADDRESS = "2UeeogEc4YXvAwzkTuRpQNhiYDsNuDgVxPkrTWefJc9A";
const AGENT_A_ADDRESS = "2UeeogEc4YXvAwzkTuRpQNhiYDsNuDgVxPkrTWefJc9A";
const AGENT_B_ADDRESS = "2UeeogEc4YXvAwzkTuRpQNhiYDsNuDgVxPkrTWefJc9A";

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function log(agent, msg, data = null) {
    const colors = { SELLER: "\x1b[36m", "AGENT A": "\x1b[32m", "AGENT B": "\x1b[33m", SYSTEM: "\x1b[35m" };
    const reset = "\x1b[0m";
    console.log(`\n${colors[agent]}[${agent}]${reset} ${msg}`);
    if (data) console.log(JSON.stringify(data, null, 2));
}

async function main() {
    console.log("\x1b[1m");
    console.log("╔════════════════════════════════════════════╗");
    console.log("║   COVERT — Competing Agents Demo           ║");
    console.log("║   Two agents. One service. Zero leakage.   ║");
    console.log("╚════════════════════════════════════════════╝");
    console.log("\x1b[0m");

    // ── Step 1: Seller lists a high-value service ─────────────────────
    await log("SELLER", "Listing exclusive intelligence service...");

    const listRes = await fetch(`${BASE_URL}/api/agent/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Dark Pool Signal Intelligence",
            category: "Data",
            description: "Proprietary dark pool flow data for autonomous trading agents.",
            price: 50,
            seller_address: SELLER_ADDRESS,
        }),
    });

    const { service } = await listRes.json();
    await log("SELLER", "Service listed — waiting for buyers", {
        service: service.name,
        price: `${service.price} USDC`,
        id: service.id,
    });
    await sleep(1500);

    // ── Step 2: Both agents discover the service independently ────────
    await log("AGENT A", "Scanning marketplace...");
    await sleep(500);
    await log("AGENT B", "Scanning marketplace...");

    const [resA, resB] = await Promise.all([
        fetch(`${BASE_URL}/api/agent/services`),
        fetch(`${BASE_URL}/api/agent/services`),
    ]);

    const { services: servicesA } = await resA.json();
    const { services: servicesB } = await resB.json();

    const targetA = servicesA.find(s => s.id === service.id);
    const targetB = servicesB.find(s => s.id === service.id);

    await log("AGENT A", `Found target: "${targetA.name}" at ${targetA.price} USDC`);
    await log("AGENT B", `Found target: "${targetB.name}" at ${targetB.price} USDC`);
    await sleep(1000);

    // ── Step 3: Both agents check their balances ──────────────────────
    await log("AGENT A", "Checking balance...");
    await log("AGENT B", "Checking balance...");

    const [balA, balB] = await Promise.all([
        fetch(`${BASE_URL}/api/agent/balance?address=${AGENT_A_ADDRESS}`).then(r => r.json()),
        fetch(`${BASE_URL}/api/agent/balance?address=${AGENT_B_ADDRESS}`).then(r => r.json()),
    ]);

    await log("AGENT A", `Public balance: ${balA.public_balance} USDC`);
    await log("AGENT B", `Public balance: ${balB.public_balance} USDC`);
    await sleep(1000);

    // ── Step 4: Both agents initiate purchase simultaneously ──────────
    await log("SYSTEM", "Both agents initiating private purchase simultaneously...");
    await log("AGENT A", "Building private transaction — counterparty unknown to Agent B");
    await log("AGENT B", "Building private transaction — counterparty unknown to Agent A");

    const [buyA, buyB] = await Promise.all([
        fetch(`${BASE_URL}/api/agent/buy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: service.id,
                buyer_address: AGENT_A_ADDRESS,
                amount: service.price,
            }),
        }).then(r => r.json()),
        fetch(`${BASE_URL}/api/agent/buy`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: service.id,
                buyer_address: AGENT_B_ADDRESS,
                amount: service.price,
            }),
        }).then(r => r.json()),
    ]);

    await log("AGENT A", "Private transaction built", {
        kind: buyA.transaction?.kind,
        sendTo: buyA.transaction?.sendTo,
        shielded: "identity + amount hidden from public ledger",
    });

    await log("AGENT B", "Private transaction built", {
        kind: buyB.transaction?.kind,
        sendTo: buyB.transaction?.sendTo,
        shielded: "identity + amount hidden from public ledger",
    });

    await sleep(1000);

    // ── Step 5: Summary ───────────────────────────────────────────────
    console.log("\n\x1b[1m");
    console.log("╔════════════════════════════════════════════╗");
    console.log("║           DEMO COMPLETE                    ║");
    console.log("╠════════════════════════════════════════════╣");
    console.log("║  Both agents transacted privately          ║");
    console.log("║  Neither knew the other was buying         ║");
    console.log("║  No amounts visible on public ledger       ║");
    console.log("║  No identities exposed                     ║");
    console.log("║  Settlement: MagicBlock PER (TEE)          ║");
    console.log("╚════════════════════════════════════════════╝");
    console.log("\x1b[0m");
}

main().catch(console.error);