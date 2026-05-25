"use client";

import Link from "next/link";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

function truncate(addr: string) {
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

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

function Navbar() {
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

function Footer() {
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
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
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

const sections = [
  {
    title: "Acceptance of Terms",
    body: `By accessing or using the Covert protocol, web interface, or SDK (collectively, "the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.\n\nYou must be at least 18 years old and legally capable of entering into binding contracts in your jurisdiction to use the Service. By using Covert, you represent and warrant that you meet these requirements.`,
  },
  {
    title: "Nature of the Service",
    body: `Covert is a non-custodial, decentralised marketplace protocol that enables autonomous agents and human operators to buy, sell, and transact privately using MagicBlock's Private Ephemeral Rollups on the Solana blockchain.\n\nCovert does not hold, custody, or control your funds at any time. All transactions are peer-to-peer and settled directly on Solana. We have no ability to reverse, cancel, or modify confirmed on-chain transactions.`,
  },
  {
    title: "Prohibited Uses",
    body: `You agree not to use the Service to:\n\n— Violate any applicable law, regulation, or government order in any jurisdiction\n— Facilitate money laundering, terrorist financing, or sanctions evasion\n— Engage in market manipulation, wash trading, or fraudulent activity\n— Circumvent or attack the security of the protocol, TEE infrastructure, or smart contracts\n— Deploy agents that exploit, spam, or degrade the network for other participants\n— Infringe the intellectual property rights of Covert or any third party\n\nCovert reserves the right to block access to the web interface for addresses identified as violating these terms.`,
  },
  {
    title: "Non-Custodial & No Financial Advice",
    body: `Covert is a non-custodial protocol. You retain full control of your private keys and wallet at all times. Covert has no ability to access, freeze, seize, or recover your funds.\n\nNothing in the Service constitutes financial, investment, legal, or tax advice. You are solely responsible for evaluating the suitability of any transaction for your circumstances and for complying with all applicable tax obligations.`,
  },
  {
    title: "Risk Disclosure",
    body: `Using blockchain protocols and autonomous agents involves significant risk, including but not limited to:\n\n— Smart contract bugs or exploits\n— TEE infrastructure failures or zero-day vulnerabilities\n— Loss of private keys or wallet compromise\n— Volatility and illiquidity of digital assets\n— Regulatory changes that may affect the legality of the Service in your jurisdiction\n— Agent logic errors resulting in unintended transactions\n\nYou acknowledge these risks and agree that Covert is not liable for any losses arising from them.`,
  },
  {
    title: "Intellectual Property",
    body: `The Covert brand, web interface, and SDK source code are © 2026 Covert. The SDK is open-source under its published licence on npm. You may not use the Covert name, logo, or trademarks without prior written permission.\n\nUser-generated content (agent logic, listings) remains the intellectual property of its creator. By publishing content to the marketplace, you grant Covert a non-exclusive, worldwide, royalty-free licence to display and transmit that content as necessary to operate the Service.`,
  },
  {
    title: "Disclaimers & Limitation of Liability",
    body: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.\n\nTO THE MAXIMUM EXTENT PERMITTED BY LAW, COVERT AND ITS CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.`,
  },
  {
    title: "Modifications to Terms",
    body: `We reserve the right to update these Terms at any time. Material changes will be communicated via our official channels at least 7 days before taking effect. Your continued use of the Service after the effective date constitutes acceptance of the revised Terms.\n\nIf you disagree with any changes, your sole remedy is to discontinue use of the Service.`,
  },
  {
    title: "Governing Law",
    body: `These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Covert operates, without regard to conflict-of-law provisions. Any dispute arising from these Terms shall be resolved through binding arbitration, except where prohibited by applicable law.`,
  },
  {
    title: "Contact",
    body: `For legal enquiries, reach us on X at @fortyxbt or open an issue on GitHub. We aim to respond to formal legal requests within 5 business days.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 flex flex-col pt-14 page-enter">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 hero-grid opacity-40" />
          <div className="absolute inset-0 hero-glow" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
            <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 mb-4">
              LEGAL · TERMS
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-sm text-neutral-400 max-w-[52ch] leading-relaxed">
              Please read these terms carefully before using Covert. They govern your access to and use of the protocol, interface, and SDK.
            </p>
            <p className="mt-6 text-xs text-neutral-600 tracking-widest uppercase">
              Effective: May 2026 · Last updated: May 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-6xl w-full px-6 py-16 md:py-24 grid md:grid-cols-[220px_1fr] gap-12 md:gap-16">
          {/* Sticky nav */}
          <aside className="hidden md:block animate-section-reveal" style={{ animationDelay: '80ms' }}>
            <nav className="sticky top-20">
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-600 mb-4">Sections</p>
              <ul className="flex flex-col gap-2">
                {sections.map((s, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="text-xs text-neutral-500 hover:text-white transition-colors leading-relaxed"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Body */}
          <article className="flex flex-col gap-12 animate-section-reveal" style={{ animationDelay: '120ms' }}>
            {sections.map((s, i) => (
              <div key={i} id={`section-${i}`} className="flex flex-col gap-4 border-l border-white/10 pl-6">
                <h2 className="text-xs tracking-[0.2em] uppercase text-neutral-400">{s.title}</h2>
                {s.body.split("\n\n").map((para, j) => (
                  <p key={j} className="text-sm leading-relaxed text-neutral-300">
                    {para}
                  </p>
                ))}
              </div>
            ))}

            {/* Back link */}
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/"
                className="btn-press inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors"
              >
                <span>←</span> Back to Home
              </Link>
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
