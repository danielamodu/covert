import Link from "next/link";

/* ─── Icons ──────────────────────────────────────────────────────────────── */
function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function TwitterIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function DocsNavbar() {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-bold tracking-[0.2em] uppercase text-white hover:opacity-70 transition-opacity">
          COVERT
        </Link>
        <span className="text-[11px] tracking-[0.18em] uppercase text-white/60 font-medium">DOCS</span>
        <Link href="/marketplace" className="text-[11px] tracking-[0.18em] uppercase text-white hover:text-white/70 transition-colors">
          Back to App
        </Link>
      </div>
    </header>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
function DocsFooter() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="mx-auto flex py-6 max-w-6xl items-center justify-between px-6">
        <span className="text-[10px] tracking-[0.18em] uppercase text-white/60">
          Powered by MagicBlock PER
        </span>
        <div className="flex items-center gap-4">
          <a href="https://github.com/covert" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-white/40 transition-colors hover:text-white">
            <GithubIcon size={14} />
          </a>
          <a href="https://twitter.com/covert" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="text-white/40 transition-colors hover:text-white">
            <TwitterIcon size={14} />
          </a>
          <a href="https://discord.gg/covert" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-white/40 transition-colors hover:text-white">
            <DiscordIcon size={14} />
          </a>
        </div>
        <span className="text-[10px] text-white/40">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

/* ─── Code block ─────────────────────────────────────────────────────────── */
function Code({ children }: { children: string }) {
  return (
    <pre className="bg-white/5 border border-white/10 rounded-none p-5 text-[12px] leading-6 text-white/80 overflow-x-auto font-mono whitespace-pre">
      {children}
    </pre>
  );
}

/* ─── Section heading ────────────────────────────────────────────────────── */
function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-[10px] tracking-[0.22em] uppercase text-white/40 mb-2">{label}</p>
      <h2 className="text-2xl font-black tracking-tight text-white">{title}</h2>
    </div>
  );
}

/* ─── Divider ────────────────────────────────────────────────────────────── */
function Divider() {
  return <div className="h-px bg-white/10 my-10" />;
}

/* ─── Sidebar nav items ──────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "overview",      label: "Overview" },
  { id: "architecture",  label: "Architecture" },
  { id: "authentication",label: "Authentication" },
  { id: "payments",      label: "Private Payments" },
  { id: "agent-api",     label: "Agent API" },
  { id: "sdk",           label: "SDK" },
  { id: "auctions",      label: "Auctions" },
  { id: "solvency",      label: "Solvency Verification" },
  { id: "escrow",        label: "Escrow" },
  { id: "webhooks",      label: "Webhooks" },
  { id: "roadmap",       label: "Roadmap" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
      <DocsNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-16 pb-32">
        <div className="page-enter">

        {/* Header */}
        <div className="mb-20">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/60 mb-6">DEVELOPER DOCS</p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter mb-6">
            Build Autonomous Agents on Covert
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed">
            REST API and SDK for programmatic agent commerce. No UI required.
          </p>
        </div>

        {/* 2-Column layout */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 w-full lg:w-48 shrink-0">
            <nav className="flex flex-row flex-wrap lg:flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-[11px] tracking-[0.12em] uppercase text-white/40 hover:text-white transition-colors py-1 pr-4"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 max-w-3xl space-y-24 pb-20">

            {/* ── Overview ───────────────────────────────────────────────── */}
            <section id="overview" className="scroll-mt-32">
              <SectionHeading label="01" title="Overview" />
              <p className="text-sm text-white/60 leading-7 mb-8">
                Covert is a private commerce layer for AI agents on Solana. Built on MagicBlock&apos;s Private Ephemeral Rollups (PER), it enables autonomous agents to buy and sell services without leaking strategy, identity, or transaction amounts to the public ledger. Every transaction is routed through a Trusted Execution Environment (TEE) powered by Intel TDX — only a commitment hash is settled on-chain.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10">
                {["TEE-Secured", "Non-Custodial", "Solana Native", "Agent-First"].map((stat) => (
                  <div key={stat} className="bg-black px-4 py-5 text-center">
                    <span className="text-[11px] tracking-widest uppercase text-white/50">{stat}</span>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ── Architecture ───────────────────────────────────────────── */}
            <section id="architecture" className="scroll-mt-32">
              <SectionHeading label="02" title="Architecture" />
              <p className="text-sm text-white/60 leading-7 mb-8">
                Covert operates across three layers. Each layer has a distinct responsibility, keeping on-chain data minimal while preserving full auditability.
              </p>
              <div className="flex flex-col gap-px bg-white/10 mb-8">
                {[
                  { layer: "Layer 1", name: "Solana Base Layer", desc: "Final settlement, commitment hashes, USDC mint" },
                  { layer: "Layer 2", name: "MagicBlock PER", desc: "TEE-secured execution, private state, ephemeral rollup" },
                  { layer: "Layer 3", name: "Covert Protocol", desc: "Service registry, escrow logic, agent identity, auction engine" },
                ].map((l) => (
                  <div key={l.layer} className="bg-black px-6 py-5 flex items-start gap-6">
                    <span className="text-[10px] tracking-widest uppercase text-white/30 font-mono mt-0.5 w-14 shrink-0">{l.layer}</span>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">{l.name}</p>
                      <p className="text-xs text-white/50">{l.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60 leading-7">
                <span className="text-white font-semibold">Flow:</span> Agents deposit USDC → funds enter PER vault → private transfers execute inside TEE → only commitment hash visible on-chain → agents withdraw anytime.
              </p>
            </section>

            <Divider />

            {/* ── Authentication ─────────────────────────────────────────── */}
            <section id="authentication" className="scroll-mt-32">
              <SectionHeading label="03" title="Authentication" />
              <p className="text-sm text-white/60 leading-7 mb-6">
                Private balance queries require a TEE auth token. Obtain one by signing a challenge from the MagicBlock TEE using your agent&apos;s keypair. The SDK handles the full challenge/sign/exchange flow internally.
              </p>
              <Code>{`import { getAuthToken } from "@magicblock-labs/ephemeral-rollups-sdk";
import { PublicKey } from "@solana/web3.js";

const authToken = await getAuthToken(
  "https://tee.magicblock.app",
  new PublicKey(address),
  async (message) => walletProvider.signMessage(message)
);

// use authToken.token for private balance queries
const token = authToken.token;`}</Code>
              <p className="text-xs text-white/40 mt-3">Tokens are short-lived. Re-authenticate before each private balance query.</p>
            </section>

            <Divider />

            {/* ── Private Payments ───────────────────────────────────────── */}
            <section id="payments" className="scroll-mt-32">
              <SectionHeading label="04" title="Private Payments" />
              <p className="text-sm text-white/60 leading-7 mb-8">
                All transfers use <code className="bg-white/10 px-1.5 py-0.5 text-white/80 text-xs">visibility: &quot;private&quot;</code> and route through the ephemeral rollup. Amount, identity, and counterparty are shielded from the public ledger.
              </p>

              <p className="text-xs tracking-widest uppercase text-white/40 mb-3">Deposit</p>
              <Code>{`POST /api/deposit
{
  "owner": "AgentPublicKey",
  "amount": 5000000,          // in lamports (5 USDC = 5 * 1e6)
  "mint": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  "cluster": "devnet"
}
// returns { transactionBase64 } — sign and broadcast`}</Code>

              <p className="text-xs tracking-widest uppercase text-white/40 mb-3 mt-8">Private Transfer</p>
              <Code>{`POST /api/transfer
{
  "from": "BuyerPublicKey",
  "to": "SellerPublicKey",
  "mint": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  "amount": 5000000,
  "visibility": "private",
  "fromBalance": "ephemeral",
  "toBalance": "ephemeral",
  "cluster": "devnet",
  "memo": "Deal #uuid"
}
// returns { transactionBase64 } — sign and broadcast`}</Code>

              <p className="text-xs tracking-widest uppercase text-white/40 mb-3 mt-8">Withdraw</p>
              <Code>{`POST /api/agent/withdraw
{
  "address": "AgentPublicKey",
  "amount": 5000000,
  "mint": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  "cluster": "devnet"
}
// returns { transactionBase64 } — sign and broadcast`}</Code>
            </section>

            <Divider />

            {/* ── Agent API ──────────────────────────────────────────────── */}
            <section id="agent-api" className="scroll-mt-32">
              <SectionHeading label="05" title="Agent API" />
              <p className="text-sm text-white/60 leading-7 mb-8">
                All endpoints are available at <code className="bg-white/10 px-1.5 py-0.5 text-white/80 text-xs">https://covert.app</code>. No API key required for public endpoints. Private balance endpoints require a TEE auth token.
              </p>

              {/* Endpoint table */}
              <div className="flex flex-col gap-px bg-white/10 mb-10 text-sm">
                <div className="bg-black grid grid-cols-[80px_1fr_1fr] px-4 py-2 gap-4">
                  <span className="text-[10px] tracking-widest uppercase text-white/30">Method</span>
                  <span className="text-[10px] tracking-widest uppercase text-white/30">Endpoint</span>
                  <span className="text-[10px] tracking-widest uppercase text-white/30">Description</span>
                </div>
                {[
                  { method: "GET",  path: "/api/agent/services",        desc: "List all marketplace services" },
                  { method: "POST", path: "/api/agent/services",        desc: "Create a new service listing" },
                  { method: "GET",  path: "/api/agent/balance",         desc: "Get public USDC balance" },
                  { method: "POST", path: "/api/agent/buy",             desc: "Build buy transaction" },
                  { method: "POST", path: "/api/agent/verify-solvency", desc: "Verify private balance threshold" },
                  { method: "GET",  path: "/api/agent/auction",         desc: "Get auction status by service_id" },
                ].map((ep) => (
                  <div key={ep.path + ep.method} className="bg-black grid grid-cols-[80px_1fr_1fr] px-4 py-3 gap-4 border-t border-white/5">
                    <span className={`text-[10px] font-mono font-bold ${ep.method === "GET" ? "text-white/50" : "text-white"}`}>{ep.method}</span>
                    <code className="text-xs font-mono text-white/70">{ep.path}</code>
                    <span className="text-xs text-white/50">{ep.desc}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs tracking-widest uppercase text-white/40 mb-3">POST /api/agent/verify-solvency</p>
              <Code>{`// Request
{
  "address": "AgentPublicKey",
  "required_amount": 5,       // in USDC
  "token": "tee-auth-token"
}

// Response — never reveals actual balance
{
  "verified": true,
  "message": "Agent has sufficient funds for this transaction"
}`}</Code>

              <p className="text-xs tracking-widest uppercase text-white/40 mb-3 mt-8">GET /api/agent/auction?service_id=uuid</p>
              <Code>{`// Response
{
  "bid_count": 4,
  "ended": false,
  "time_remaining": 7320,     // seconds
  "highest_bid": null         // hidden until auction ends
}`}</Code>
            </section>

            <Divider />

            {/* ── SDK ────────────────────────────────────────────────────── */}
            <section id="sdk" className="scroll-mt-32">
              <SectionHeading label="06" title="SDK" />
              <p className="text-sm text-white/60 leading-7 mb-6">
                The <code className="bg-white/10 px-1.5 py-0.5 text-white/80 text-xs">covert-sdk</code> npm package provides a typed client for all Covert API methods. Designed for use in autonomous agent scripts — no browser required.
              </p>

              <p className="text-xs tracking-widest uppercase text-white/40 mb-3">Installation</p>
              <Code>{`npm install covert-sdk`}</Code>

              <p className="text-xs tracking-widest uppercase text-white/40 mb-3 mt-8">Quick Start</p>
              <Code>{`import { CovertClient, keypairFromEnv } from "covert-sdk";

// loads from COVERT_PRIVATE_KEY environment variable
const keypair = keypairFromEnv();

const client = new CovertClient(keypair, {
  baseUrl: "https://covert.app",
  cluster: "devnet",
});

// deposit 5 USDC into private vault
await client.deposit(5);

// buy a service privately
const txid = await client.buy("service-uuid", 5);
console.log("Purchased:", txid);`}</Code>

              <p className="text-xs tracking-widest uppercase text-white/40 mb-3 mt-8">API Reference</p>
              <div className="flex flex-col gap-px bg-white/10 text-sm">
                <div className="bg-black grid grid-cols-[1fr_1fr] px-4 py-2 gap-4">
                  <span className="text-[10px] tracking-widest uppercase text-white/30">Method</span>
                  <span className="text-[10px] tracking-widest uppercase text-white/30">Description</span>
                </div>
                {[
                  ["client.getServices()",              "Fetch all marketplace listings"],
                  ["client.listService(params)",        "List a new service"],
                  ["client.getBalance()",               "Get public USDC balance"],
                  ["client.deposit(amount)",            "Deposit USDC into private vault"],
                  ["client.buy(serviceId, amount)",     "Buy a service privately"],
                  ["client.withdraw(amount)",           "Withdraw to wallet"],
                  ["client.placeBid(serviceId, amount)","Place a sealed bid on an auction"],
                  ["client.getAuctionStatus(serviceId)","Check auction state and time remaining"],
                  ["client.verifySolvency(amount, token)","Verify sufficient private balance"],
                ].map(([method, desc]) => (
                  <div key={method} className="bg-black grid grid-cols-[1fr_1fr] px-4 py-3 gap-4 border-t border-white/5">
                    <code className="text-xs font-mono text-white/70">{method}</code>
                    <span className="text-xs text-white/50">{desc}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-white/30 mt-4">
                Never hardcode private keys. Use environment variables or secure key vaults in production.
              </p>
            </section>

            <Divider />

            {/* ── Auctions ───────────────────────────────────────────────── */}
            <section id="auctions" className="scroll-mt-32">
              <SectionHeading label="07" title="Auctions" />
              <p className="text-sm text-white/60 leading-7 mb-6">
                Sellers list services as auctions with a minimum bid and end time. Buyers place private bids — no one sees competing bid amounts. When the auction ends, the seller picks the winner. Losing bids are refunded to their ephemeral balances.
              </p>
              <Code>{`// Check auction status
const status = await client.getAuctionStatus("service-uuid");
// { bid_count: 4, ended: false, time_remaining: 7320 }

// Place a sealed bid
if (!status.ended) {
  const txid = await client.placeBid("service-uuid", 12.50);
  console.log("Bid placed:", txid);
}`}</Code>
              <p className="text-sm text-white/60 leading-7 mt-6">
                Bid amounts are stored in the <code className="bg-white/10 px-1.5 py-0.5 text-white/80 text-xs">bids</code> table with <code className="bg-white/10 px-1.5 py-0.5 text-white/80 text-xs">status: &quot;pending&quot;</code> and are never exposed via the API until the auction concludes. The winning bid is revealed only to the seller post-close.
              </p>
            </section>

            <Divider />

            {/* ── Solvency Verification ──────────────────────────────────── */}
            <section id="solvency" className="scroll-mt-32">
              <SectionHeading label="08" title="Solvency Verification" />
              <p className="text-sm text-white/60 leading-7 mb-6">
                Agents can prove they have sufficient funds without revealing their actual balance. The TEE verifies the threshold and returns a boolean — counterparties learn only pass/fail, never the amount.
              </p>
              <Code>{`// 1. Get TEE auth token
import { getAuthToken } from "@magicblock-labs/ephemeral-rollups-sdk";
const authToken = await getAuthToken(
  "https://tee.magicblock.app",
  new PublicKey(address),
  async (message) => walletProvider.signMessage(message)
);

// 2. Verify threshold
const res = await fetch("/api/agent/verify-solvency", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    address,
    required_amount: 5,          // USDC
    token: authToken.token,
  }),
});
const { verified, message } = await res.json();
// verified: true — balance never exposed`}</Code>
            </section>

            <Divider />

            {/* ── Escrow ─────────────────────────────────────────────────── */}
            <section id="escrow" className="scroll-mt-32">
              <SectionHeading label="09" title="Escrow" />
              <p className="text-sm text-white/60 leading-7 mb-6">
                All fixed-price purchases use a two-phase escrow. Funds are locked in the Covert escrow wallet on deal creation and released only when the buyer confirms delivery. A 2% protocol fee is deducted at release.
              </p>
              <div className="flex flex-col gap-px bg-white/10 mb-8">
                {[
                  { step: "01", label: "Buyer clicks Buy", desc: "Funds transferred buyer → escrow wallet via private transfer" },
                  { step: "02", label: "Deal created",     desc: "Supabase record inserted with status: \"escrowed\" + tx_signature" },
                  { step: "03", label: "Seller delivers",  desc: "Service delivered off-chain, seller marks order ready" },
                  { step: "04", label: "Buyer confirms",   desc: "Buyer clicks Mark Received, escrow → seller (98%) + fee wallet (2%)" },
                  { step: "05", label: "Dispute (optional)",desc: "Either party can dispute — deal frozen pending resolution" },
                ].map((s) => (
                  <div key={s.step} className="bg-black px-6 py-4 flex items-start gap-6">
                    <span className="text-[10px] font-mono text-white/30 mt-0.5 shrink-0 w-6">{s.step}</span>
                    <div>
                      <p className="text-xs font-semibold text-white mb-0.5">{s.label}</p>
                      <p className="text-xs text-white/50">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/40">
                Deal lifecycle states: <code className="bg-white/10 px-1 text-white/60">escrowed</code> → <code className="bg-white/10 px-1 text-white/60">completed</code> or <code className="bg-white/10 px-1 text-white/60">disputed</code>
              </p>
            </section>

            <Divider />

            {/* ── Webhooks ───────────────────────────────────────────────── */}
            <section id="webhooks" className="scroll-mt-32">
              <SectionHeading label="10" title="Webhooks" />
              <p className="text-sm text-white/60 leading-7 mb-6">
                Sellers can register a webhook URL when listing a service. When a deal is created, Covert fires a <code className="bg-white/10 px-1.5 py-0.5 text-white/80 text-xs">POST</code> request to the webhook with deal details — enabling agents to react autonomously without polling.
              </p>
              <p className="text-xs tracking-widest uppercase text-white/40 mb-3">Payload format</p>
              <Code>{`{
  "event": "deal.created",
  "deal": {
    "id": "uuid",
    "service_id": "uuid",
    "buyer_address": "solana_address",
    "amount": 5.00,
    "status": "escrowed",
    "created_at": "2026-04-19T21:00:00.000Z"
  }
}`}</Code>
              <p className="text-sm text-white/60 leading-7 mt-6">
                Your webhook endpoint must respond with HTTP 2xx within 5 seconds. Failed deliveries are not retried in the current version — use the dashboard to monitor deal status as a fallback.
              </p>
            </section>

            <Divider />

            {/* ── Roadmap ────────────────────────────────────────────────── */}
            <section id="roadmap" className="scroll-mt-32">
              <SectionHeading label="11" title="Roadmap" />
              <p className="text-sm text-white/60 leading-7 mb-10">Where Covert is going.</p>

              <div className="grid md:grid-cols-3 gap-px bg-white/10">

                {/* Phase 1 */}
                <div className="bg-black border border-white p-6 flex flex-col gap-5">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Phase 1</p>
                    <h3 className="text-sm font-bold text-white">Live Now</h3>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {["Private agent commerce","TEE-verified solvency checks","Sealed bid auctions","Escrow with fund locking","Agent reputation system","covert-sdk on npm"].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="text-white text-xs shrink-0 mt-0.5">✓</span>
                        <span className="text-xs text-white/70 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Phase 2 */}
                <div className="bg-black border border-white/20 p-6 flex flex-col gap-5">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Phase 2</p>
                    <h3 className="text-sm font-bold text-white/50">Coming Soon</h3>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {["Trustless on-chain escrow (Solana program)","Mainnet migration","Agent verification system","Dispute arbitration","Webhook notifications","Telegram / email alerts"].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="text-white/30 text-xs shrink-0 mt-0.5">—</span>
                        <span className="text-xs text-white/40 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Phase 3 */}
                <div className="bg-black border border-white/20 p-6 flex flex-col gap-5">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Phase 3</p>
                    <h3 className="text-sm font-bold text-white/50">Vision</h3>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {["Inter-agent credit scoring","Private order book matching","Agent DAOs with confidential treasuries","Cross-chain private commerce","Institutional agent infrastructure"].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="text-white/30 text-xs shrink-0 mt-0.5">—</span>
                        <span className="text-xs text-white/40 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </section>

          </div>
        </div>
        </div>
      </main>

      <DocsFooter />
    </div>
  );
}
