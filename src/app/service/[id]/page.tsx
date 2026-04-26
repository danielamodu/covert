"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Lock, ShieldCheck, CheckCircle2, X, ArrowRight, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getAuthToken } from "@magicblock-labs/ephemeral-rollups-sdk";
import { supabase } from "@/lib/supabase";
import bs58 from "bs58";


/* ─── Helpers ────────────────────────────────────────────────────────────── */
function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ─── Buy dialog ─────────────────────────────────────────────────────────── */
function BuyDialog({ serviceName, sellerAddress, serviceId, serviceWebhookUrl, onClose, onPurchaseSuccess }: { serviceName: string; sellerAddress: string; serviceId: string; serviceWebhookUrl: string | null; onClose: () => void; onPurchaseSuccess?: () => void }) {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<any>("solana");
  const { connection } = useAppKitConnection();

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handlePurchase = async () => {
    if (!amount || parseFloat(amount) <= 0 || !address || !walletProvider) return;
    setStatus("loading");
    setMessage("");

    try {
      const escrowWallet = process.env.NEXT_PUBLIC_ESCROW_WALLET!;

      // Sign a message to prove wallet ownership
      const buyMessage = `covert:buy:${serviceId}:${Date.now()}`;
      const messageBytes = new TextEncoder().encode(buyMessage);
      const signatureBytes = await walletProvider.signMessage(messageBytes);
      const signature = bs58.encode(signatureBytes);

      // Lock funds into escrow via private transfer
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: address,
          to: escrowWallet,
          mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
          amount: Math.round(parseFloat(amount) * 1e6),
          visibility: "private",
          fromBalance: "ephemeral",
          toBalance: "ephemeral",
          cluster: "devnet",
          memo: `Escrow lock: ${serviceName}`,
          signature,
          message: buyMessage,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Transfer failed: ${res.status}${errText ? ` — ${errText}` : ""}`);
      }

      const { transactionBase64 } = await res.json();
      const buffer = Buffer.from(transactionBase64, "base64");
      const transaction = Transaction.from(buffer);

      if (!connection) throw new Error("No connection");
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = new PublicKey(address);

      const signed = await walletProvider.signTransaction(transaction);
      const rawTx = signed.serialize();
      const txid = await connection.sendRawTransaction(rawTx, { skipPreflight: true });
      await connection.confirmTransaction(txid);

      // Deal only created after funds are confirmed in escrow
      const { data: dealData, error: dealError } = await supabase.from("deals").insert({
        service_id: serviceId,
        buyer_address: address,
        seller_address: sellerAddress,
        amount: parseFloat(amount),
        status: "escrowed",
        tx_signature: txid,
      }).select().single();

      if (dealError) throw dealError;

      // Save transaction record
      await supabase.from("transactions").insert({
        wallet_address: address,
        type: "purchase",
        amount: parseFloat(amount),
        service_id: serviceId,
        tx_signature: txid,
      });

      // Fire webhook if seller has one
      if (serviceWebhookUrl && dealData) {
        fetch("/api/agent/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            webhook_url: serviceWebhookUrl,
            deal: {
              id: dealData.id,
              service_id: serviceId,
              buyer_address: address,
              amount: parseFloat(amount),
              status: "escrowed",
              created_at: dealData.created_at || new Date().toISOString(),
            },
          }),
        }).catch(err => console.error("Webhook fetch failed:", err));
      }

      setStatus("success");
      setMessage("Funds locked in escrow — seller has been notified");
      if (onPurchaseSuccess) onPurchaseSuccess();
    } catch (err: any) {
      console.error("Purchase error:", err);
      setStatus("error");
      const errString = err && Object.keys(err).length > 0 ? JSON.stringify(err) : String(err);
      setMessage(err?.message || (errString !== "{}" && errString !== "[object Object]" ? errString : "Wallet rejected or connection failed"));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md bg-white border border-black/20 p-8 shadow-[8px_8px_0_0_#000]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold tracking-[0.12em] uppercase text-black">
            Buy Privately
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-400 hover:text-black transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Service name */}
        <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1">
          Service
        </p>
        <p className="text-sm font-semibold text-black mb-6">{serviceName}</p>

        {/* Amount */}
        <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-2">
          Amount (USDC)
        </p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={status === "loading" || status === "success"}
          placeholder="0.0000"
          className="w-full border border-black/20 bg-neutral-50 px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:opacity-50"
        />

        {/* Routing note */}
        <div className="mt-4 flex gap-3 border border-black/10 bg-neutral-50 p-3">
          <ShieldCheck
            size={14}
            strokeWidth={1.75}
            className="text-neutral-500 shrink-0 mt-0.5"
          />
          <p className="text-[10px] leading-5 text-neutral-500">
            This transaction will be routed through MagicBlock&apos;s Private
            Ephemeral Rollup. Amount, identity, and counterparty are shielded
            from the public ledger.
          </p>
        </div>

        {message && (
          <p className={`mt-4 text-[10px] tracking-widest uppercase ${status === "error" ? "text-red-500" : "text-neutral-600"}`}>
            {message}
          </p>
        )}

        {/* Confirm */}
        <button
          type="button"
          onClick={handlePurchase}
          disabled={status === "loading" || status === "success" || !amount}
          className="mt-6 w-full border border-black bg-black py-3 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
        >
          {status === "loading" ? "Processing..." : "Confirm Private Purchase"}
        </button>
      </div>
    </div>
  );
}

/* ─── Bid dialog ───────────────────────────────────────────────────────────── */
function BidDialog({ service, onClose }: { service: any; onClose: () => void }) {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<any>("solana");
  const { connection } = useAppKitConnection();

  const [bidAmount, setBidAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleBid = async () => {
    const amt = parseFloat(bidAmount);
    if (!amt || amt <= 0 || !address || !walletProvider) return;
    if (service.min_bid && amt < service.min_bid) {
      setStatus("error");
      setMessage(`Minimum bid is ${service.min_bid} USDC`);
      return;
    }
    setStatus("loading");
    setMessage("");

    try {
      // Lock funds into PER escrow via deposit
      const resp = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: address,
          amount: amt * 1e6,
          mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
          cluster: "devnet",
        }),
      });

      if (resp.ok) {
        const { transactionBase64 } = await resp.json();
        const txBuffer = Buffer.from(transactionBase64, "base64");
        const tx = Transaction.from(txBuffer);
        if (!connection) throw new Error("No connection");
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.lastValidBlockHeight = lastValidBlockHeight;
        tx.feePayer = new PublicKey(address);
        const signed = await walletProvider.signTransaction(tx);
        const rawTx = signed.serialize();
        const txid = await connection.sendRawTransaction(rawTx, { skipPreflight: true });
        await connection.confirmTransaction(txid);
      }

      // Save bid to bids table
      const { error: bidError } = await supabase.from("bids").insert({
        service_id: service.id,
        bidder_address: address,
        amount: amt,
        status: "pending",
      });
      if (bidError) throw bidError;

      setStatus("success");
      setMessage("Bid placed privately — competitors cannot see your amount");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Bid failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-md bg-white border border-black/20 p-8 shadow-[8px_8px_0_0_#000]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold tracking-[0.12em] uppercase text-black">Place Sealed Bid</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-neutral-400 hover:text-black transition-colors">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1">Service</p>
        <p className="text-sm font-semibold text-black mb-6">{service.name}</p>

        {service.min_bid && (
          <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-3">
            Minimum bid: <span className="text-black font-semibold">${service.min_bid} USDC</span>
          </p>
        )}

        <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-2">Your Bid (USDC)</p>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          disabled={status === "loading" || status === "success"}
          placeholder={service.min_bid ? `Min ${service.min_bid}` : "0.00"}
          className="w-full border border-black/20 bg-neutral-50 px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:opacity-50"
        />

        <div className="mt-4 flex gap-3 border border-black/10 bg-neutral-50 p-3">
          <ShieldCheck size={14} strokeWidth={1.75} className="text-neutral-500 shrink-0 mt-0.5" />
          <p className="text-[10px] leading-5 text-neutral-500">
            Your bid amount is sealed inside MagicBlock&apos;s Private Ephemeral Rollup. Competitors cannot see it.
          </p>
        </div>

        {message && (
          <p className={`mt-4 text-[10px] tracking-widest uppercase ${status === "error" ? "text-red-500" : "text-neutral-600"}`}>
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={handleBid}
          disabled={status === "loading" || status === "success" || !bidAmount}
          className="mt-6 w-full border border-black bg-black py-3 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
        >
          {status === "loading" ? "Placing Bid..." : "Place Private Bid"}
        </button>
      </div>
    </div>
  );
}

/* ─── Similar service card ───────────────────────────────────────────────── */
function SimilarCard({ service }: { service: any }) {
  return (
    <Link
      href={`/service/${service.id}`}
      className="group flex flex-col gap-5 border border-black/10 bg-white p-6 transition-all duration-200 hover:border-black hover:shadow-[4px_4px_0_0_#000]"
    >
      <div className="flex items-start justify-between">
        <span className="inline-block border border-black/30 px-2 py-0.5 text-[10px] tracking-widest uppercase text-neutral-600">
          {service.category}
        </span>
        <div className="flex h-7 items-center gap-1.5 border border-black/15 bg-neutral-50 px-2">
          <Lock size={11} strokeWidth={2} className="text-neutral-500" />
          <span className="text-[10px] tracking-wider text-neutral-500">——</span>
        </div>
      </div>

      <h3 className="text-base font-semibold leading-snug tracking-tight text-black">
        {service.name}
      </h3>

      <div className="mt-auto flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-neutral-500 group-hover:text-black transition-colors">
        View Service
        <ArrowRight size={11} strokeWidth={2} />
      </div>
    </Link>
  );
}

/* ─── Privacy explainer ──────────────────────────────────────────────────── */
function PrivacyBadge() {
  return (
    <div className="border border-black/10 bg-neutral-50 p-6">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 shrink-0 border border-black/15 bg-white p-2">
          <ShieldCheck size={16} strokeWidth={1.75} className="text-black" />
        </div>
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2">
            Privacy Mechanic
          </p>
          <p className="text-sm leading-6 text-neutral-700">
            This transaction is TEE-encrypted via{" "}
            <span className="font-semibold text-black">MagicBlock PER</span>.
            Your identity, counterparty, and amount are shielded from public
            view. Execution occurs inside a Private Ephemeral Rollup — only a
            commitment hash is settled on-chain.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              "Identity shielded",
              "Amount hidden",
              "Counterparty private",
              "On-chain commitment only",
            ].map((tag) => (
              <span
                key={tag}
                className="border border-black/15 px-2.5 py-1 text-[10px] tracking-widest uppercase text-neutral-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [buyOpen, setBuyOpen] = useState(false);
  const [bidOpen, setBidOpen] = useState(false);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dealCount, setDealCount] = useState(0);
  const [auctionStatus, setAuctionStatus] = useState<{
    bid_count: number;
    ended: boolean;
    time_remaining: number;
    highest_bid: number | null;
  } | null>(null);

  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<any>("solana");
  const [solventVerified, setSolventVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isPurchased = localStorage.getItem(`purchased_${id}`);
      if (isPurchased) setPurchased(true);
    }
  }, [id]);

  const handlePurchaseSuccess = () => {
    setPurchased(true);
    localStorage.setItem(`purchased_${id}`, "true");
  };

  const handleVerify = async () => {
    if (!address || !walletProvider) {
      setVerifyError("Connect your wallet first");
      return;
    }
    setVerifying(true);
    setVerifyError("");

    try {
      // get auth token via SDK (handles challenge/sign flow internally)
      const authToken = await getAuthToken(
        "https://tee.magicblock.app",
        new PublicKey(address),
        async (message: Uint8Array) => {
          const signed = await walletProvider.signMessage(message);
          return signed;
        }
      );
      const token = authToken.token;

      // verify solvency
      console.log("sending to verify-solvency:", { address, required_amount: service.price, token: token ? "exists" : "missing" });
      const verifyRes = await fetch("/api/agent/verify-solvency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          required_amount: service.price,
          token,
        }),
      });

      const data = await verifyRes.json();
      if (data.verified) {
        setSolventVerified(true);
      } else {
        setVerifyError("Insufficient private balance");
      }
    } catch (err: any) {
      console.error(err);
      setVerifyError("Verification failed — try again");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setService(data);
        setLoading(false);
        // fetch auction status if needed
        if (data?.type === "auction") {
          fetch(`/api/agent/auction?service_id=${id}`)
            .then(r => r.json())
            .then(setAuctionStatus)
            .catch(console.error);
        }
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("deals")
      .select("*", { count: "exact", head: true })
      .eq("service_id", id)
      .then(({ count }) => {
        setDealCount(count ?? 0);
      });
  }, [id]);

  const [similarServices, setSimilarServices] = useState<any[]>([]);

  useEffect(() => {
    if (!service) return;
    supabase
      .from("services")
      .select("*")
      .eq("category", service.category)
      .neq("id", service.id)
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSimilarServices(data);
        } else {
          // Fallback: fetch from other categories
          supabase
            .from("services")
            .select("*")
            .neq("category", service.category)
            .limit(3)
            .then(({ data: fallbackData }) => {
              if (fallbackData) setSimilarServices(fallbackData);
            });
        }
      });
  }, [service]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <p className="text-sm uppercase tracking-widest text-neutral-500">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <p className="text-sm uppercase tracking-widest text-neutral-500">Service not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      <main className="flex-1">
        <div className="page-enter">
        <div className="mx-auto w-full max-w-6xl px-6 pt-24">

          {/* ── Breadcrumb ───────────────────────────────────────────── */}
          <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-500 mb-8">
            <Link href="/marketplace" className="hover:text-black transition-colors">
              Marketplace
            </Link>
            {" / "}
            {service.name}
          </p>

          {/* ── Main content grid ────────────────────────────────────── */}
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">

            {/* Left column */}
            <div>
              {/* Category */}
              <span className="inline-block border border-black/30 px-2 py-0.5 text-[10px] tracking-widest uppercase text-neutral-600 mb-5">
                {service.category}
              </span>

              {/* Heading */}
              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-black sm:text-5xl mb-6">
                {service.name}
              </h1>

              {/* Seller */}
              <div className="flex items-center gap-2.5 mb-8">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                  Sold by
                </span>
                <Link
                  href={`/agent/${service.seller_address}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
                >
                  <code>{truncate(service.seller_address)}</code>
                  <ExternalLink size={11} strokeWidth={2} />
                </Link>
              </div>

              {/* Description */}
              <p className="text-base leading-7 text-neutral-600 max-w-xl mb-10">
                {service.description}
              </p>

              {/* Privacy explainer */}
              <PrivacyBadge />
            </div>

            {/* Right column — purchase / bid panel */}
            <div className="flex flex-col gap-0">
              <div className="border border-black p-6 flex flex-col gap-5 sticky top-20">

                {service.type === "auction" ? (
                  <>
                    {/* Auction panel */}
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-2">Auction</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-black">
                          {auctionStatus?.ended ? "Ended" : auctionStatus ? `${Math.floor(auctionStatus.time_remaining / 3600)}h ${Math.floor((auctionStatus.time_remaining % 3600) / 60)}m left` : "Loading..."}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-black/10" />

                    <div className="flex justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] tracking-widest uppercase text-neutral-400">Bids</span>
                        <span className="text-base font-bold text-black">
                          {auctionStatus != null ? auctionStatus.bid_count : "—"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] tracking-widest uppercase text-neutral-400">Min Bid</span>
                        <span className="text-base font-bold text-black">${service.min_bid ?? 0} USDC</span>
                      </div>
                      {auctionStatus?.ended && auctionStatus.highest_bid != null && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] tracking-widest uppercase text-neutral-400">Winning Bid</span>
                          <span className="text-base font-bold text-black">${auctionStatus.highest_bid.toFixed(2)} USDC</span>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-black/10" />

                    {!auctionStatus?.ended && (
                      <button
                        type="button"
                        onClick={() => setBidOpen(true)}
                        className="w-full border border-black bg-black py-3.5 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-white hover:text-black transition-colors"
                      >
                        Place Private Bid
                      </button>
                    )}
                    {auctionStatus?.ended && (
                      <p className="text-center text-[10px] tracking-widest uppercase text-neutral-500">Auction closed</p>
                    )}
                  </>
                ) : (
                  <>
                    {/* Fixed price panel */}
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-2">Price</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-black">${service.price.toFixed(2)} USDC</span>
                      </div>
                    </div>

                    <div className="h-px bg-black/10" />

                    <div className="flex justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] tracking-widest uppercase text-neutral-400">Deals</span>
                        <span className="text-base font-bold text-black">{dealCount}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] tracking-widest uppercase text-neutral-400">Rating</span>
                        <span className="text-base font-bold text-black">4.9</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] tracking-widest uppercase text-neutral-400">Disputes</span>
                        <span className="text-base font-bold text-black">0</span>
                      </div>
                    </div>

                    <div className="h-px bg-black/10" />

                    {/* Solvency verification / Purchase state */}
                    {purchased ? (
                      <div className="flex flex-col gap-3 bg-neutral-50 border border-black/10 p-6">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 size={18} strokeWidth={2.5} />
                          <span className="text-xs font-bold tracking-widest uppercase">Service Purchased — Awaiting Delivery</span>
                        </div>
                        <p className="text-[10px] tracking-widest uppercase text-neutral-500">
                          Check your dashboard for deal status
                        </p>
                      </div>
                    ) : (
                      <>
                        {!solventVerified ? (
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={handleVerify}
                              disabled={verifying || !address}
                              className="w-full border border-black/30 py-2.5 text-[11px] tracking-[0.15em] uppercase text-black hover:border-black transition-colors disabled:opacity-40"
                            >
                              {verifying ? "Verifying..." : "Verify Funds"}
                            </button>
                            <div className="flex items-center justify-center gap-1.5">
                              <ShieldCheck size={10} strokeWidth={1.75} className="text-neutral-400" />
                              <span className="text-[10px] text-neutral-400">TEE-verified solvency check</span>
                            </div>
                            {verifyError && (
                              <p className="text-[10px] tracking-widest uppercase text-red-500 text-center">{verifyError}</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 border border-black/10 bg-neutral-50 px-3 py-2">
                            <CheckCircle2 size={13} strokeWidth={2} className="text-black shrink-0" />
                            <span className="text-[10px] tracking-widest uppercase text-black">Funds verified — ready to purchase</span>
                          </div>
                        )}

                        <button
                          type="button"
                          id="buy-privately-btn"
                          onClick={() => setBuyOpen(true)}
                          disabled={!solventVerified}
                          className="w-full border border-black bg-black py-3.5 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 disabled:hover:bg-black disabled:hover:text-white"
                        >
                          Buy Privately
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* Trust note */}
                <div className="flex items-center justify-center gap-1.5">
                  <ShieldCheck size={11} strokeWidth={1.75} className="text-neutral-400" />
                  <span className="text-[10px] text-neutral-400">TEE-encrypted · MagicBlock PER</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Similar services ─────────────────────────────────────── */}
          <section className="mt-20 mb-12">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-xs tracking-[0.22em] uppercase text-neutral-600">
                Similar Services
              </h2>
            </div>
            {similarServices.length > 0 ? (
              <div className={`grid gap-px bg-black/10 ${
                similarServices.length === 1 ? "grid-cols-1 max-w-sm" :
                similarServices.length === 2 ? "grid-cols-1 sm:grid-cols-2" :
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}>
                {similarServices.map((s) => (
                  <SimilarCard key={s.id} service={s} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-12">
                <p className="text-sm text-neutral-400">No similar services available</p>
              </div>
            )}
          </section>
        </div>
        </div>
      </main>

      <Footer />

      {buyOpen && (
        <BuyDialog
          serviceName={service.name}
          sellerAddress={service.seller_address}
          serviceId={service.id}
          serviceWebhookUrl={service.webhook_url || null}
          onClose={() => setBuyOpen(false)}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}
      {bidOpen && (
        <BidDialog
          service={service}
          onClose={() => setBidOpen(false)}
        />
      )}
    </div>
  );
}