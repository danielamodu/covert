"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export default function Navbar() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const pathname = usePathname();

  function truncate(addr: string) {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">

        {/* Wordmark */}
        <Link
          href="/marketplace"
          className="text-sm font-bold tracking-[0.2em] uppercase text-black select-none hover:opacity-70 transition-opacity"
        >
          COVERT
        </Link>

        {/* Center nav */}
        <nav className="flex items-center gap-6">
          <Link
            href="/marketplace"
            className={`text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 hover:text-black ${pathname === "/marketplace" ? "text-black font-semibold" : "text-neutral-400"}`}
          >
            Marketplace
          </Link>
          <Link
            href="/activity"
            className={`text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 hover:text-black ${pathname === "/activity" ? "text-black font-semibold" : "text-neutral-400"}`}
          >
            Activity
          </Link>
          <Link
            href="/dashboard"
            className={`text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 hover:text-black ${pathname === "/dashboard" ? "text-black font-semibold" : "text-neutral-400"}`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Wallet button */}
        <button
          type="button"
          onClick={() => open()}
          className="border border-black bg-black px-5 py-2 text-[11px] tracking-[0.18em] uppercase text-white transition-colors duration-200 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          {isConnected && address ? truncate(address) : "Connect Wallet"}
        </button>

      </div>
    </header>
  );
}
