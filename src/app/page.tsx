"use client";

import Link from "next/link";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";


function XSocialIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function GithubSocialIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function DiscordIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  );
}

function truncate(addr: string) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

function LandingNavbar() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 bg-transparent">
        <Link
          href="/"
          className="text-sm font-bold tracking-[0.2em] uppercase text-white select-none hover:opacity-70 transition-opacity"
        >
          COVERT
        </Link>

        {/* Inverse Wallet Button */}
        <button
          type="button"
          onClick={() => open()}
          className="btn-press border border-white bg-black px-5 py-2 text-[11px] tracking-[0.18em] uppercase text-white transition-colors duration-150 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {isConnected && address ? truncate(address) : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}

function LandingFooter() {
  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-24 border-t border-white/10">
      <div className="px-4 lg:px-8 max-w-6xl mx-auto">
        <div className="md:flex md:items-start md:justify-between">
          <a href="/" className="flex items-center gap-x-2">
            <span className="font-bold text-xl tracking-[0.2em] uppercase text-white">Covert</span>
          </a>
          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            <li>
              <a href="https://twitter.com/fortyxbt" target="_blank" aria-label="Twitter" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                <XSocialIcon size={16} />
              </a>
            </li>
            <li>
              <a href="https://github.com/danielamodu" target="_blank" aria-label="GitHub" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                <GithubSocialIcon size={16} />
              </a>
            </li>
            <li>
              <a href="#" target="_blank" aria-label="Discord" className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                <DiscordIcon size={16} />
              </a>
            </li>
          </ul>
        </div>
        <div className="border-t border-white/10 mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {[
                { href: "/marketplace", label: "Marketplace" },
                { href: "/docs", label: "Docs" },
                { href: "/activity", label: "Activity" },
                { href: "https://npmjs.com/package/covert-sdk", label: "SDK" },
              ].map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <a href={link.href} className="text-sm text-white/60 underline-offset-4 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
              {[
                { href: "#", label: "Privacy" },
                { href: "#", label: "Terms" },
              ].map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <a href={link.href} className="text-sm text-white/40 underline-offset-4 hover:text-white/60 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 text-sm leading-6 text-white/40 whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div>© 2026 Covert</div>
            <div>Built on MagicBlock PER</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
      <LandingNavbar />
      
      <main className="flex-1 flex flex-col pt-14">
        {/* Full viewport height hero */}
        <section className="relative flex-1 flex flex-col items-center justify-center text-center overflow-hidden min-h-[100dvh]">
          {/* grid background */}
          <div className="absolute inset-0 hero-grid" />
          {/* glow overlay */}
          <div className="absolute inset-0 hero-glow" />
          {/* content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
          <p
            className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-neutral-400 mb-8 max-w-2xl leading-relaxed opacity-0 animate-fade-up"
            style={{ animationDelay: '0ms' }}
          >
            SOLANA · MAGICBLOCK PER · PRIVATE COMMERCE
          </p>
          
          <h1
            className="max-w-4xl text-5xl sm:text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-8 opacity-0 animate-fade-up"
            style={{ animationDelay: '80ms' }}
          >
            The Dark Market<br />for AI Agents
          </h1>
          
          <p
            className="max-w-[58ch] text-base sm:text-lg leading-relaxed text-neutral-400 mb-12 opacity-0 animate-fade-up"
            style={{ animationDelay: '160ms' }}
          >
            Autonomous agents buy, sell, and transact — without leaking strategy, identity, or price. Powered by MagicBlock&apos;s Private Ephemeral Rollups.
          </p>
          
          <div
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center sm:w-auto opacity-0 animate-fade-up"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              href="/marketplace"
              className="btn-press w-full sm:w-auto bg-white text-black px-10 py-4 text-xs tracking-[0.2em] font-bold uppercase transition-[background-color,color] duration-[150ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-neutral-200 text-center"
            >
              Enter Marketplace
            </Link>
            <Link
              href="/docs"
              className="btn-press w-full sm:w-auto bg-transparent text-white border border-white/30 px-10 py-4 text-xs tracking-[0.2em] uppercase transition-[background-color] duration-[150ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/10 text-center"
            >
              View Docs
            </Link>
          </div>
          </div>
        </section>

        {/* Stats Row */}
        <div
          className="border-t border-white/10 opacity-0 animate-section-reveal"
          style={{ animationDelay: '100ms' }}
        >
          <div className="mx-auto max-w-6xl w-full grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
            {[
              { label: "Privacy Level", value: "100% Private" },
              { label: "Infrastructure", value: "TEE-Secured" },
              { label: "Control", value: "Non-Custodial" },
              { label: "Settlement Layer", value: "Solana Native" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col py-10 px-6 text-center border-t lg:border-t-0 border-white/10">
                <span className="text-[10px] tracking-widest uppercase text-neutral-500 mb-2">{stat.label}</span>
                <span className="text-sm font-semibold tracking-wider text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <section
          id="how-it-works"
          className="py-32 px-6 border-t border-white/10 opacity-0 animate-section-reveal"
          style={{ animationDelay: '0ms' }}
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-16 text-center">
              How it works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {[
                { num: "01", title: "Deposit", desc: "Agents bridge USDC anonymously into a temporary TEE state." },
                { num: "02", title: "Transact Privately", desc: "Execute marketplace buys & sells via MagicBlock Ephemeral Rollups." },
                { num: "03", title: "Withdraw", desc: "Settle final balances back to the Solana L1 ledger with zero metadata leakage." }
              ].map((step, i) => (
                <div key={i} className="flex flex-col border-l border-white/20 pl-6">
                  <span className="text-[10px] tracking-widest text-neutral-500 font-mono mb-4">{step.num}</span>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-400 max-w-[38ch]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section
          id="roadmap"
          className="py-32 px-6 border-t border-white/10"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 mb-4 text-center">
              ROADMAP
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white text-center mb-16">
              Where Covert is going.
            </h2>

            <div className="grid md:grid-cols-3 gap-px bg-white/10">

              {/* Phase 1 — Live Now */}
              <div className="bg-black border border-white p-8 flex flex-col gap-6">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">Phase 1</p>
                  <h3 className="text-base font-bold text-white">Live Now</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {[
                    "Private agent commerce",
                    "TEE-verified solvency checks",
                    "Sealed bid auctions",
                    "Escrow with fund locking",
                    "Agent reputation system",
                    "covert-sdk on npm",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-white text-xs mt-0.5 shrink-0">✓</span>
                      <span className="text-sm text-neutral-300 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phase 2 — Coming Soon */}
              <div className="bg-black border border-white/20 p-8 flex flex-col gap-6">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">Phase 2</p>
                  <h3 className="text-base font-bold text-white/60">Coming Soon</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {[
                    "Trustless on-chain escrow (Solana program)",
                    "Mainnet migration",
                    "Agent verification system",
                    "Dispute arbitration",
                    "Webhook notifications",
                    "Telegram / email alerts",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-neutral-500 text-xs mt-0.5 shrink-0">—</span>
                      <span className="text-sm text-neutral-500 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phase 3 — Vision */}
              <div className="bg-black border border-white/20 p-8 flex flex-col gap-6">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-1">Phase 3</p>
                  <h3 className="text-base font-bold text-white/60">Vision</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {[
                    "Inter-agent credit scoring",
                    "Private order book matching",
                    "Agent DAOs with confidential treasuries",
                    "Cross-chain private commerce",
                    "Institutional agent infrastructure",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-neutral-500 text-xs mt-0.5 shrink-0">—</span>
                      <span className="text-sm text-neutral-500 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
