"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start px-6 pt-24 pb-0">
      {/* Eyebrow */}
      <p className="mb-6 text-xs tracking-[0.22em] uppercase text-neutral-500">
        Solana · MagicBlock PER · Confidential
      </p>

      {/* Headline */}
      <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-tight text-black sm:text-6xl lg:text-7xl">
        Private Commerce
        <br />
        for AI Agents
      </h1>

      {/* Sub-headline */}
      <p className="mt-6 max-w-lg text-base leading-7 text-neutral-600 sm:text-lg">
        A permissionless marketplace where autonomous agents transact — sealed
        bids, hidden prices, zero data leakage.
      </p>
    </section>
  );
}

/* ─── Countdown helper ───────────────────────────────────────────────────── */
function formatCountdown(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 24) {
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h left`;
  }
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

/* ─── Service card ───────────────────────────────────────────────────────── */
function ServiceCard({ service }: { service: any }) {
  const isAuction = service.type === "auction";

  return (
    <div className="group relative flex flex-col gap-5 border border-black/10 bg-white p-6 transition-all duration-200 hover:border-black hover:shadow-[4px_4px_0_0_#000]">
      {/* Top row: badge + price/bid info */}
      <div className="flex items-start justify-between">
        {isAuction ? (
          <span className="inline-block border border-black bg-black px-2 py-0.5 text-[10px] tracking-widest uppercase text-white">
            Auction
          </span>
        ) : (
          <span className="inline-block border border-black/30 px-2 py-0.5 text-[10px] tracking-widest uppercase text-neutral-600">
            {service.category}
          </span>
        )}

        {isAuction ? (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] tracking-wider text-neutral-500">
              {service.auction_end_time ? formatCountdown(service.auction_end_time) : ""}
            </span>
          </div>
        ) : (
          <div className="flex h-7 items-center gap-1.5 border border-black/15 bg-neutral-50 px-2">
            <span className="text-[10px] tracking-wider text-black font-semibold">
              ${service.price.toFixed(2)} USDC
            </span>
          </div>
        )}
      </div>

      {/* Service name */}
      <h2 className="text-base font-semibold leading-snug tracking-tight text-black">
        <Link href={`/service/${service.id}`} className="after:absolute after:inset-0">
          {service.name}
        </Link>
      </h2>

      {/* Bid count or seller */}
      {isAuction ? (
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">
            {service._bid_count != null
              ? service._bid_count === 0
                ? "No bids yet"
                : `${service._bid_count} bid${service._bid_count === 1 ? "" : "s"} placed`
              : "Sealed bids"}
          </span>
        </div>
      ) : (
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">
            Seller
          </span>
          <Link href={`/agent/${service.seller_address}`} className="hover:opacity-70 transition-opacity">
            <code className="text-xs text-neutral-700">
              {truncateAddress(service.seller_address)}
            </code>
          </Link>
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        className="relative z-10 pointer-events-none mt-auto w-full border border-black bg-black py-2.5 text-[11px] tracking-[0.15em] uppercase text-white transition-all duration-150 group-hover:bg-white group-hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        {isAuction ? "Place Bid" : "Buy Privately"}
      </button>
    </div>
  );
}

/* ─── Services grid ──────────────────────────────────────────────────────── */
function ServicesGrid({ services }: { services: any[] }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 mt-12 pb-24">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="text-xs tracking-[0.22em] uppercase text-neutral-600">
          Available Services
        </h2>
        <span className="text-[10px] text-neutral-500">
          {services.length} listings
        </span>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20 text-neutral-500 text-sm">
          No services listed yet.
        </div>
      ) : (
        <div className="w-full">
          {(() => {
            const cols =
              services.length === 1 ? "grid-cols-1 max-w-xs" :
              services.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl" :
              services.length % 3 === 0 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
              services.length % 2 === 0 ? "grid-cols-1 sm:grid-cols-2" :
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
            return (
              <div className={`grid gap-px bg-black/10 ${cols}`}>
                {services.map((s: any) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}

/* ─── Filter Bar ─────────────────────────────────────────────────────────── */
function FilterBar({ 
  searchQuery, setSearchQuery, 
  selectedCategory, setSelectedCategory, 
  sortBy, setSortBy 
}: any) {
  const categories = ["All", "Data", "Relay", "Compute", "Oracle", "ZK", "Network"];
  
  return (
    <div className="mx-auto w-full max-w-6xl px-6 mt-16 border-b border-black/10 pb-8">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        {/* Search */}
        <input 
          type="text" 
          placeholder="Search services..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border border-black/20 bg-transparent px-4 py-2 text-sm w-full lg:w-64 placeholder:text-neutral-400 focus:outline-none focus:border-black"
        />
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 text-[10px] tracking-widest uppercase transition-colors border ${
                selectedCategory === c 
                  ? "bg-black text-white border-black" 
                  : "bg-transparent text-neutral-600 border-black/20 hover:border-black hover:text-black"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select 
          value={sortBy} 
          onChange={e => setSortBy(e.target.value)}
          className="border border-black/20 bg-transparent px-4 py-2 text-sm text-black focus:outline-none focus:border-black cursor-pointer min-w-[160px]"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function MarketplacePage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setServices(data);
      });
  }, []);

  const filteredServices = services
    .filter(s => selectedCategory === "All" || s.category === selectedCategory)
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <main className="flex-1">
        <div className="page-enter">
        <Hero />
        <FilterBar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          sortBy={sortBy} setSortBy={setSortBy}
        />
        <ServicesGrid services={filteredServices} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
