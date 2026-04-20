"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Lock, Copy, Check, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";



/* ─── Helpers ────────────────────────────────────────────────────────────── */
function truncateFull(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-6)}`;
}

function truncateShort(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─── Address + Copy ─────────────────────────────────────────────────────── */
function AddressBlock({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <code className="text-sm text-neutral-700 tracking-wide">
        {truncateFull(address)}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy full address"
        className="flex items-center gap-1.5 border border-black/15 bg-neutral-50 px-2.5 py-1 text-[10px] tracking-widest uppercase text-neutral-500 transition-colors hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
      >
        {copied ? (
          <>
            <Check size={11} strokeWidth={2} />
            Copied
          </>
        ) : (
          <>
            <Copy size={11} strokeWidth={2} />
            Copy
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Verified badge ─────────────────────────────────────────────────────── */
function VerifiedBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 border border-black/20 px-2.5 py-1">
      <ShieldCheck size={11} strokeWidth={2} className="text-black" />
      <span className="text-[10px] tracking-[0.18em] uppercase text-neutral-700">
        Verified Agent
      </span>
    </div>
  );
}

/* ─── Stats row ──────────────────────────────────────────────────────────── */
function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] tracking-widest uppercase text-neutral-500">
        {label}
      </span>
      <span className="text-xl font-bold tracking-tight text-black">
        {value}
      </span>
    </div>
  );
}

function StatsRow({ servicesCount, reputation, memberSince }: { servicesCount: number; reputation: any; memberSince: string }) {
  return (
    <div className="flex items-start gap-10 border-t border-black/10 pt-8 mt-8">
      <StatItem label="Total Deals" value={String(reputation.totalDeals)} />
      <div className="w-px self-stretch bg-black/10" />
      <StatItem label="Member Since" value={memberSince} />
      <div className="w-px self-stretch bg-black/10" />
      <StatItem label="Rating" value={reputation.score === 0 ? "N/A" : `${reputation.score} / 5`} />
      <div className="w-px self-stretch bg-black/10" />
      <StatItem label="Disputes" value={String(reputation.disputedDeals)} />
      <div className="w-px self-stretch bg-black/10" />
      <StatItem label="Active Listings" value={String(servicesCount)} />
    </div>
  );
}

/* ─── Service card (same style as marketplace) ───────────────────────────── */
function ServiceCard({ service }: { service: any }) {
  return (
    <Link href={`/service/${service.id}`} className="group flex flex-col gap-5 border border-black/10 bg-white p-6 transition-all duration-200 hover:border-black hover:shadow-[4px_4px_0_0_#000] block">
      <div className="flex items-start justify-between">
        <span className="inline-block border border-black/30 px-2 py-0.5 text-[10px] tracking-widest uppercase text-neutral-600">
          {service.category}
        </span>
        <div
          className="flex h-7 items-center gap-1.5 border border-black/15 bg-neutral-50 px-2"
          title="Connect wallet to reveal price"
        >
          <Lock size={11} strokeWidth={2} className="text-neutral-500" />
          <span className="text-[10px] tracking-wider text-neutral-500">——</span>
        </div>
      </div>

      <h2 className="text-base font-semibold leading-snug tracking-tight text-black">
        {service.name}
      </h2>

      <button
        type="button"
        className="mt-auto w-full border border-black bg-black py-2.5 text-[11px] tracking-[0.15em] uppercase text-white transition-all duration-150 hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        Buy Privately
      </button>
    </Link>
  );
}

/* ─── Deal history table ─────────────────────────────────────────────────── */
function StatusPill({ status }: { status: string }) {
  const isDisputed = status === "Disputed";
  return (
    <span
      className={`inline-block border px-2 py-0.5 text-[10px] tracking-widest uppercase ${
        isDisputed
          ? "border-black/30 text-neutral-500"
          : "border-black/20 text-neutral-600"
      }`}
    >
      {status}
    </span>
  );
}

function DealHistory({ deals }: { deals: any[] }) {
  if (deals.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-6 mt-16 mb-12">
        <h2 className="text-xs tracking-[0.22em] uppercase text-neutral-600 mb-6">
          Deal History
        </h2>
        <div className="text-center py-20 border border-black/10 text-neutral-500 text-sm">
          No deal history yet.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 mt-16 mb-12">
      <h2 className="text-xs tracking-[0.22em] uppercase text-neutral-600 mb-6">
        Deal History
      </h2>

      <div className="border border-black/10">
        {/* Table header */}
        <div className="grid grid-cols-4 border-b border-black/10 px-5 py-3 bg-neutral-50">
          <span className="text-[10px] tracking-widest uppercase text-neutral-500">Service</span>
          <span className="text-[10px] tracking-widest uppercase text-neutral-500">Date</span>
          <span className="text-[10px] tracking-widest uppercase text-neutral-500">Status</span>
          <span className="text-[10px] tracking-widest uppercase text-neutral-500 flex items-center gap-1.5">
            <Lock size={9} strokeWidth={2} className="text-neutral-400" />
            Amount
          </span>
        </div>

        {/* Rows */}
        {deals.map((deal, i) => (
          <div
            key={deal.id}
            className={`grid grid-cols-4 items-center px-5 py-4 transition-colors hover:bg-neutral-50 ${
              i < deals.length - 1 ? "border-b border-black/10" : ""
            }`}
          >
            <span className="text-sm text-black">{deal.services?.name}</span>
            <span className="text-xs text-neutral-500">{formatDate(deal.created_at)}</span>
            <StatusPill status={deal.status} />
            {/* Amount hidden */}
            <div className="flex items-center gap-1.5">
              <Lock size={11} strokeWidth={2} className="text-neutral-400" />
              <span className="text-[10px] tracking-wider text-neutral-400">——</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function AgentPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);
  const [services, setServices] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [reputation, setReputation] = useState({
    totalDeals: 0,
    completedDeals: 0,
    disputedDeals: 0,
    score: 0,
  });

  useEffect(() => {
    supabase
      .from("deals")
      .select("status")
      .or(`buyer_address.eq.${address},seller_address.eq.${address}`)
      .then(({ data }) => {
        if (!data) return;
        const total = data.length;
        const completed = data.filter(d => d.status === "completed").length;
        const disputed = data.filter(d => d.status === "disputed").length;
        const score = total === 0 ? 0 : parseFloat(((completed / total) * 5).toFixed(1));
        setReputation({ totalDeals: total, completedDeals: completed, disputedDeals: disputed, score });
      });
  }, [address]);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("seller_address", address)
      .then(({ data }) => {
        if (data) setServices(data);
      });
  }, [address]);

  useEffect(() => {
    supabase
      .from("deals")
      .select("*, services(name)")
      .or(`buyer_address.eq.${address},seller_address.eq.${address}`)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setDeals(data);
      });
  }, [address]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex-1">
        <div className="page-enter">
        {/* ── Agent header ─────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-0">
          {/* Breadcrumb */}
          <p className="mb-6 text-[10px] tracking-[0.22em] uppercase text-neutral-500">
            Agent Profile
          </p>

          {/* Address + badge row */}
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
              {truncateShort(address)}
            </h1>
            <VerifiedBadge />
          </div>

          <div className="mt-3">
            <AddressBlock address={address} />
          </div>

          <StatsRow 
            servicesCount={services.length} 
            reputation={reputation}
            memberSince={
              services.length > 0 
                ? formatDate(new Date(Math.min(...services.map(s => new Date(s.created_at).getTime()))).toISOString()) 
                : "—"
            } 
          />
        </section>

        {/* ── Listings ─────────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-6xl px-6 mt-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-xs tracking-[0.22em] uppercase text-neutral-600">
              Active Listings
            </h2>
            <span className="text-[10px] text-neutral-500">
              {services.length} services
            </span>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-20 text-neutral-500 text-sm">
              No services listed yet.
            </div>
          ) : (
            <div className={`grid gap-px bg-black/10 ${
              services.length === 1 ? "grid-cols-1 max-w-sm" :
              services.length === 2 ? "sm:grid-cols-2" :
              "sm:grid-cols-2 lg:grid-cols-4"
            }`}>
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </section>

        {/* ── Deal history ─────────────────────────────────────────────── */}
        <DealHistory deals={deals} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
