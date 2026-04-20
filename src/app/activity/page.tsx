"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

function timeAgo(dateParam: string) {
  const date = new Date(dateParam);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);

  if (seconds < 60) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function truncate(addr: string) {
  if (!addr) return "Unknown";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function ActivityPage() {
  const [activity, setActivity] = useState<any[]>([]);

  const fetchActivity = () => {
    supabase
      .from("deals")
      .select("*, services(name)")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setActivity(data);
      });
  };

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <main className="flex-1">
        <div className="page-enter">
        {/* Hero section */}
        <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-16">
          <p className="mb-4 text-[10px] tracking-[0.22em] uppercase text-neutral-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            LIVE · UPDATES EVERY 30S
          </p>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-black sm:text-4xl">
            Network Activity
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-neutral-600">
            All transactions are private. Amounts and identities are shielded.
          </p>
        </section>

        {/* Activity feed */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="border border-black/10">
            {activity.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-neutral-400">
                No activity yet. Be the first to transact.
              </div>
            ) : (
              activity.map((item, i) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-neutral-50 ${
                    i < activity.length - 1 ? "border-b border-black/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center border border-black/15 bg-neutral-50 shrink-0">
                      <Lock size={12} strokeWidth={2} className="text-black" />
                    </span>
                    <p className="text-sm text-black">
                      Agent <code className="text-xs text-neutral-600">{truncate(item.buyer_address)}</code> purchased{" "}
                      <span className="font-semibold">{item.services?.name ?? "Unknown Service"}</span>{" "}
                      from Agent <code className="text-xs text-neutral-600">{truncate(item.seller_address)}</code>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:ml-auto">
                    <span className="text-xs text-neutral-500 shrink-0">
                      {timeAgo(item.created_at)}
                    </span>
                    <span className="inline-block border border-black/30 bg-black text-white px-2 py-0.5 text-[10px] tracking-widest uppercase shrink-0">
                      PRIVATE
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
