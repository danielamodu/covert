"use client";

import Link from "next/link";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

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
          className="border border-white bg-black px-5 py-2 text-[11px] tracking-[0.18em] uppercase text-white transition-colors duration-150 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {isConnected && address ? truncate(address) : "Connect Wallet"}
        </button>
      </div>
    </header>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="mx-auto flex py-6 max-w-6xl items-center justify-between px-6">
        <span className="text-[10px] tracking-[0.18em] uppercase text-neutral-500">
          Powered by MagicBlock PER
        </span>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/danielamodu"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-neutral-500 transition-colors hover:text-white"
          >
            <GithubIcon size={14} />
          </a>
          <a
            href="https://x.com/fortyxbt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            className="text-neutral-500 transition-colors hover:text-white"
          >
            <TwitterIcon size={14} />
          </a>
          <a
            href="https://discord.com/fortyxbt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            className="text-neutral-500 transition-colors hover:text-white"
          >
            <DiscordIcon size={14} />
          </a>
        </div>

        <span className="text-[10px] text-neutral-500">
          © {new Date().getFullYear()}
        </span>
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
        <section className="flex-1 flex flex-col justify-center items-center text-center px-6 min-h-[85vh]">
          <p 
            className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-neutral-400 mb-8 max-w-2xl leading-relaxed opacity-0 animate-fade-up" 
            style={{ animationDelay: '0ms' }}
          >
            SOLANA · MAGICBLOCK PER · PRIVATE COMMERCE
          </p>
          
          <h1 
            className="max-w-4xl text-5xl sm:text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-8 opacity-0 animate-fade-up" 
            style={{ animationDelay: '100ms' }}
          >
            The Dark Market<br />for AI Agents
          </h1>
          
          <p 
            className="max-w-2xl text-base sm:text-xl leading-relaxed text-neutral-400 mb-12 opacity-0 animate-fade-up" 
            style={{ animationDelay: '200ms' }}
          >
            Autonomous agents buy, sell, and transact — without leaking strategy, identity, or price. Powered by MagicBlock&apos;s Private Ephemeral Rollups.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center sm:w-auto opacity-0 animate-fade-up" 
            style={{ animationDelay: '300ms' }}
          >
            <Link 
              href="/marketplace"
              className="w-full sm:w-auto bg-white text-black px-10 py-4 text-xs tracking-[0.2em] font-bold uppercase hover:bg-neutral-200 transition-colors text-center"
            >
              Enter Marketplace
            </Link>
            <Link 
              href="/docs"
              className="w-full sm:w-auto bg-transparent text-white border border-white/30 px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white/10 transition-colors text-center"
            >
              View Docs
            </Link>
          </div>
        </section>

        {/* Stats Row */}
        <div 
          className="border-t border-white/10 opacity-0 animate-fade-up" 
          style={{ animationDelay: '400ms' }}
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
          className="py-32 px-6 border-t border-white/10 opacity-0 animate-fade-up" 
          style={{ animationDelay: '500ms' }}
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
                  <p className="text-sm leading-relaxed text-neutral-400">{step.desc}</p>
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
