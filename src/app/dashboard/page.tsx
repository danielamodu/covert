"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { getAuthToken } from "@magicblock-labs/ephemeral-rollups-sdk";
import * as nacl from "tweetnacl";
import {
  Lock,
  Unlock,
  LogOut,
  ArrowDownToLine,
  ArrowUpFromLine,
  X,
  ShieldCheck,
  ListPlus,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function truncate(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─── Dialog shell ───────────────────────────────────────────────────────── */
function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-white border border-black/20 p-8 shadow-[8px_8px_0_0_#000]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold tracking-[0.12em] uppercase text-black">
            {title}
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
        {children}
      </div>
    </div>
  );
}

/* ─── Deposit dialog ─────────────────────────────────────────────────────── */
function DepositDialog({ address, onClose, onSuccess }: { address: string; onClose: () => void; onSuccess?: () => void }) {
  const { walletProvider } = useAppKitProvider<any>("solana");
  const { connection } = useAppKitConnection();
  
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleDeposit = async () => {
    if (!amount || isNaN(parseFloat(amount))) return;
    setStatus("loading");
    setMessage("");

    try {
      const resp = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: address,
          amount: parseFloat(amount) * 1e6,
          mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
          cluster: "devnet"
        })
      });

      if (!resp.ok) {
        const errorData = await resp.text();
        throw new Error(`Failed to initialize deposit: ${resp.status} - ${errorData}`);
      }

      console.log("deposit response:", await resp.clone().json());
      const { transactionBase64 } = await resp.json();
      const transactionBuffer = Buffer.from(transactionBase64, "base64");
      const transaction = Transaction.from(transactionBuffer);
      
      // Always fetch fresh blockhash
      if (!connection) throw new Error("No connection");
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = new PublicKey(address);
      
      const signed = await walletProvider.signTransaction(transaction);
      const rawTx = signed.serialize();
      if (!connection) throw new Error("No connection");
      const txid = await connection.sendRawTransaction(rawTx, { skipPreflight: true });
      if (!connection) throw new Error("No connection");
      await connection.confirmTransaction(txid);
      
      await supabase.from("transactions").insert({
        wallet_address: address,
        type: "deposit",
        amount: parseFloat(amount),
        tx_signature: txid,
      });
      
      setStatus("success");
      setMessage("Deposit successful!");
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "An error occurred");
    }
  };

  return (
    <Dialog title="Deposit" onClose={onClose}>
      <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-4">
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
      <p className="mt-2 text-[10px] text-neutral-400">
        Funds are shielded on-chain using MagicBlock PER.
      </p>

      {message && (
        <p className={`mt-4 text-[10px] tracking-widest uppercase ${status === "error" ? "text-red-500" : "text-neutral-600"}`}>
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleDeposit}
        disabled={status === "loading" || status === "success" || !amount}
        className="mt-6 w-full border border-black bg-black py-3 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
      >
        {status === "loading" ? "Processing..." : "Confirm Deposit"}
      </button>
    </Dialog>
  );
}

/* ─── Withdraw dialog ────────────────────────────────────────────────────── */
function WithdrawDialog({ address, walletProvider, onClose, onSuccess }: { address: string; walletProvider: any; onClose: () => void; onSuccess?: () => void }) {
  const { connection } = useAppKitConnection();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStatus("loading");
    setMessage("");

    try {
      const resp = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: address,
          amount: parseFloat(amount) * 1e6,
          mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
          cluster: "devnet",
        }),
      });

      if (!resp.ok) {
        let errorData = "";
        try { errorData = await resp.clone().text(); } catch(e) {}
        throw new Error(`Failed to initialize withdrawal: ${resp.status} - ${errorData}`);
      }

      const { transactionBase64 } = await resp.json();
      const transactionBuffer = Buffer.from(transactionBase64, "base64");
      const transaction = Transaction.from(transactionBuffer);
      
      if (!connection) throw new Error("No connection");
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = new PublicKey(address);
      
      const signed = await walletProvider.signTransaction(transaction);
      const rawTx = signed.serialize();
      if (!connection) throw new Error("No connection");
      const txid = await connection.sendRawTransaction(rawTx, { skipPreflight: true });
      if (!connection) throw new Error("No connection");
      await connection.confirmTransaction(txid);
      
      await supabase.from("transactions").insert({
        wallet_address: address,
        type: "withdrawal",
        amount: parseFloat(amount),
        tx_signature: txid,
      });

      setStatus("success");
      setMessage("Withdrawal successful!");
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "An error occurred");
    }
  };

  return (
    <Dialog title="Withdraw" onClose={onClose}>
      <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-4">
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
      <p className="mt-2 text-[10px] text-neutral-400">
        Funds are shielded on-chain using MagicBlock PER.
      </p>

      {message && (
        <p className={`mt-4 text-[10px] tracking-widest uppercase ${status === "error" ? "text-red-500" : "text-neutral-600"}`}>
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleWithdraw}
        disabled={status === "loading" || status === "success" || !amount}
        className="mt-6 w-full border border-black bg-black py-3 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
      >
        {status === "loading" ? "Processing..." : "Confirm Withdrawal"}
      </button>
    </Dialog>
  );
}

/* ─── Balance cards ──────────────────────────────────────────────────────── */
function PublicBalanceCard({ usdcBalance }: { usdcBalance: number }) {
  return (
    <div className="flex flex-col gap-3 border border-black/15 bg-white p-6">
      <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">
        Public Balance
      </span>
      <p className="text-3xl font-black tracking-tight text-black">
        {usdcBalance.toFixed(4)} USDC
      </p>
      <p className="text-[10px] text-neutral-400">
        On-chain · Visible
      </p>
    </div>
  );
}

function PrivateBalanceCard({
  address,
  walletProvider,
  balance,
  setBalance,
  onReveal,
}: {
  address?: string;
  walletProvider: any;
  balance: string | null;
  setBalance: (b: string) => void;
  onReveal: (token: string) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReveal = async () => {
    if (revealed) {
      setRevealed(false);
      return;
    }

    if (!address || !walletProvider) {
      setError("Connect wallet first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const authToken = await getAuthToken(
        "https://tee.magicblock.app",
        new PublicKey(address),
        async (message: Uint8Array) => {
          const signed = await walletProvider.signMessage(message);
          return signed;
        }
      );

      console.log("authToken:", authToken);

      const res = await fetch(
        `/api/balance?address=${address}&mint=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU&cluster=devnet&token=${authToken.token}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch private balance");
      }

      const data = await res.json();
      const rawBalance = data?.private?.balance ?? data?.balance ?? "0";
      const balanceString = (parseFloat(rawBalance) / 1e6).toFixed(4);
      setBalance(balanceString);
      onReveal(authToken.token);
      setRevealed(true);
    } catch (err: any) {
      console.error(err);
      setError("Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 border border-black bg-black p-6">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/60">
          Private Balance
        </span>
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <ShieldCheck size={11} strokeWidth={1.75} />
          <span>MagicBlock PER</span>
        </div>
      </div>

      {revealed && balance !== null ? (
        <p className="text-3xl font-black tracking-tight text-white">
          {balance} USDC
        </p>
      ) : (
        <div className="flex items-center gap-2.5">
          <Lock size={20} strokeWidth={1.75} className="text-white/40" />
          <span className="text-3xl font-black tracking-tight text-white/30">
            {loading ? "..." : "██████"}
          </span>
        </div>
      )}

      {error && (
        <p className="mt-0 text-[10px] tracking-widest uppercase text-red-500">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleReveal}
        disabled={loading}
        className="mt-1 flex items-center gap-2 self-start border border-white/20 px-3 py-1.5 text-[10px] tracking-widest uppercase text-white/60 hover:border-white hover:text-white transition-colors disabled:opacity-50"
      >
        {revealed ? (
          <>
            <Lock size={11} strokeWidth={2} />
            Hide
          </>
        ) : (
          <>
            <Unlock size={11} strokeWidth={2} />
            {loading ? "Authenticating..." : "Authenticate & Reveal"}
          </>
        )}
      </button>
    </div>
  );
}

/* ─── Status pill ────────────────────────────────────────────────────────── */
function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Progress": "border-black/30 text-neutral-700",
    Pending: "border-black/20 text-neutral-500",
    "Awaiting Delivery": "border-black/20 text-neutral-500",
    Confirmed: "border-black/15 text-neutral-500",
    "disputed": "border-red-300 text-red-500",
    "delivered": "border-blue-300 text-blue-500",
  };
  return (
    <span
      className={`inline-block border px-2 py-0.5 text-[10px] tracking-widest uppercase ${
        styles[status] ?? "border-black/15 text-neutral-500"
      }`}
    >
      {status}
    </span>
  );
}

/* ─── Active deals table ─────────────────────────────────────────────────── */
function ActiveDeals({ deals, address, handleComplete, handleDelivered, handleDispute, setDeals }: { deals: any[]; address: string; handleComplete: (deal: any) => Promise<void>; handleDelivered: (dealId: string) => Promise<void>; handleDispute: (id: string) => Promise<void>; setDeals: React.Dispatch<React.SetStateAction<any[]>> }) {
  return (
    <section className="mt-12">
      <h2 className="text-xs tracking-[0.22em] uppercase text-neutral-600 mb-5">
        Active Deals
      </h2>
      <div className="border border-black/10">
        {/* Header */}
        <div className="grid grid-cols-5 border-b border-black/10 px-5 py-3 bg-neutral-50">
          {["Counterparty", "Service", "Role", "Status", "Action"].map((h) => (
            <span
              key={h}
              className="text-[10px] tracking-widest uppercase text-neutral-500"
            >
              {h}
            </span>
          ))}
        </div>

        {deals.map((deal, i) => {
          const counterparty = deal.buyer_address === address ? deal.seller_address : deal.buyer_address;
          const isBuyer = deal.buyer_address === address;
          const isSeller = deal.seller_address === address;
          return (
            <div
              key={deal.id}
              className={`grid grid-cols-5 items-center px-5 py-4 transition-colors hover:bg-neutral-50 ${
                i < deals.length - 1 ? "border-b border-black/10" : ""
              }`}
            >
              <Link href={`/agent/${counterparty}`} className="hover:opacity-70 transition-opacity">
                <code className="text-xs text-neutral-700">
                  {truncate(counterparty)}
                </code>
              </Link>
              <Link href={`/service/${deal.service_id}`} className="text-sm text-black hover:opacity-70 transition-opacity">
                {deal.services?.name}
              </Link>
              {/* Role badge */}
              <span>
                {isBuyer ? (
                  <span className="inline-block border border-black/30 px-2 py-0.5 text-[10px] tracking-widest uppercase text-neutral-700">
                    BUYER
                  </span>
                ) : isSeller ? (
                  <span className="inline-block border border-black/30 px-2 py-0.5 text-[10px] tracking-widest uppercase text-neutral-700">
                    SELLER
                  </span>
                ) : null}
              </span>
              <StatusPill status={deal.status} />
              {/* Action column */}
              <div className="flex flex-col gap-1 items-start">
                {deal.status === "disputed" || deal.status === "completed" ? (
                  <span
                    className={`inline-block border px-3 py-1 text-[10px] tracking-widest uppercase w-fit ${
                      deal.status === "disputed"
                        ? "border-red-300 text-red-500"
                        : "border-black/15 text-neutral-500"
                    }`}
                  >
                    {deal.status === "disputed" ? "DISPUTED" : "COMPLETED"}
                  </span>
                ) : isBuyer && deal.status === "escrowed" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleComplete(deal)}
                      className="border border-black/30 px-3 py-1 text-[10px] tracking-widest uppercase text-neutral-600 hover:border-black hover:text-black transition-colors w-fit"
                    >
                      Mark Received
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDispute(deal.id)}
                      className="border border-red-300 px-3 py-1 text-[10px] tracking-widest uppercase text-red-500 hover:bg-red-50 transition-colors w-fit"
                    >
                      Dispute
                    </button>
                  </>
                ) : isBuyer && deal.status === "delivered" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleComplete(deal)}
                      className="border border-black/30 px-3 py-1 text-[10px] tracking-widest uppercase text-neutral-600 hover:border-black hover:text-black transition-colors w-fit"
                    >
                      Confirm Receipt
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDispute(deal.id)}
                      className="border border-red-300 px-3 py-1 text-[10px] tracking-widest uppercase text-red-500 hover:bg-red-50 transition-colors w-fit"
                    >
                      Dispute
                    </button>
                  </>
                ) : isSeller && deal.status === "escrowed" ? (
                  <button
                    type="button"
                    onClick={() => handleDelivered(deal.id)}
                    className="border border-black bg-black px-3 py-1 text-[10px] tracking-widest uppercase text-white hover:bg-white hover:text-black transition-colors w-fit"
                  >
                    Mark Delivered
                  </button>
                ) : isSeller && deal.status === "delivered" ? (
                  <span className="text-[10px] tracking-widest uppercase text-neutral-400">
                    Awaiting Buyer Confirmation
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}

        {deals.length === 0 && (
          <div className="px-5 py-8 text-center text-xs text-neutral-400">
            No active deals.
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Transaction history ────────────────────────────────────────────────── */
function TxHistory({ transactions }: { transactions: any[] }) {
  return (
    <section className="mt-10 mb-12">
      <h2 className="text-xs tracking-[0.22em] uppercase text-neutral-600 mb-5">
        Transaction History
      </h2>
      <div className="border border-black/10">
        {/* Header */}
        <div className="grid grid-cols-4 border-b border-black/10 px-5 py-3 bg-neutral-50">
          <span className="text-[10px] tracking-widest uppercase text-neutral-500">
            Type
          </span>
          <span className="text-[10px] tracking-widest uppercase text-neutral-500">
            Service
          </span>
          <span className="text-[10px] tracking-widest uppercase text-neutral-500">
            Date
          </span>
          <span className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-neutral-500">
            <Lock size={9} strokeWidth={2} className="text-neutral-400" />
            Amount
          </span>
        </div>

        {transactions.map((tx, i) => (
          <div
            key={tx.id}
            className={`grid grid-cols-4 items-center px-5 py-4 transition-colors hover:bg-neutral-50 ${
              i < transactions.length - 1 ? "border-b border-black/10" : ""
            }`}
          >
            <span className="text-sm text-black">{tx.type}</span>
            <span className="text-xs text-neutral-500">{tx.services?.name ?? "—"}</span>
            <span className="text-xs text-neutral-500">
              {formatDate(tx.created_at)}
            </span>
            <div className="flex items-center gap-1.5">
              <Lock size={11} strokeWidth={2} className="text-neutral-400" />
              <span className="text-[10px] tracking-wider text-neutral-400">
                ——
              </span>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="px-5 py-8 text-center text-xs text-neutral-400">
            No transactions yet.
          </div>
        )}
      </div>
      <div className="mt-3 flex justify-end">
        <Link href="/activity" className="text-[10px] tracking-widest uppercase text-neutral-500 hover:text-black transition-colors">
          View All
        </Link>
      </div>
    </section>
  );
}

function ListServiceDialog({ address, onClose }: { address: string; onClose: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Data");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [serviceType, setServiceType] = useState<"fixed" | "auction">("fixed");
  const [minBid, setMinBid] = useState("");
  const [auctionEndTime, setAuctionEndTime] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !description) return;
    if (serviceType === "fixed" && !price) return;
    if (serviceType === "auction" && (!minBid || !auctionEndTime)) return;
    setStatus("loading");
    try {
      const { error } = await supabase.from("services").insert({
        name,
        category,
        description,
        price: serviceType === "fixed" ? parseFloat(price) : 0,
        seller_address: address,
        webhook_url: webhookUrl || null,
        type: serviceType,
        min_bid: serviceType === "auction" ? parseFloat(minBid) : null,
        auction_end_time: serviceType === "auction" ? new Date(auctionEndTime).toISOString() : null,
      });
      if (error) throw error;
      setStatus("success");
      setMessage("Service listed successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to list service");
    }
  };

  const isDisabled = status === "loading" || status === "success";

  return (
    <Dialog title="List Service" onClose={onClose}>
      <div className="flex flex-col gap-4">

        {/* Service Type toggle */}
        <div>
          <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-2">
            Service Type
          </p>
          <div className="flex border border-black/20">
            <button
              type="button"
              onClick={() => setServiceType("fixed")}
              disabled={isDisabled}
              className={`flex-1 py-2.5 text-[10px] tracking-widest uppercase transition-colors ${
                serviceType === "fixed"
                  ? "bg-black text-white"
                  : "bg-transparent text-neutral-600 hover:text-black"
              }`}
            >
              Fixed Price
            </button>
            <button
              type="button"
              onClick={() => setServiceType("auction")}
              disabled={isDisabled}
              className={`flex-1 py-2.5 text-[10px] tracking-widest uppercase transition-colors border-l border-black/20 ${
                serviceType === "auction"
                  ? "bg-black text-white"
                  : "bg-transparent text-neutral-600 hover:text-black"
              }`}
            >
              Auction
            </button>
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-2">
            Name
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isDisabled}
            placeholder="e.g. Encrypted Data Feed"
            className="w-full border border-black/20 bg-neutral-50 px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-2">
            Category
          </p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isDisabled}
            className="w-full border border-black/20 bg-neutral-50 px-4 py-3 text-sm text-black focus:border-black focus:outline-none disabled:opacity-50 appearance-none"
          >
            <option value="Data">Data</option>
            <option value="Relay">Relay</option>
            <option value="Compute">Compute</option>
            <option value="Oracle">Oracle</option>
            <option value="ZK">ZK</option>
            <option value="Network">Network</option>
          </select>
        </div>

        <div>
          <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-2">
            Description
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isDisabled}
            placeholder="Describe your service..."
            rows={3}
            className="w-full border border-black/20 bg-neutral-50 px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:opacity-50 resize-none"
          />
        </div>

        {/* Fixed price fields */}
        {serviceType === "fixed" && (
          <div>
            <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-2">
              Price (USDC)
            </p>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isDisabled}
              placeholder="0.00"
              className="w-full border border-black/20 bg-neutral-50 px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:opacity-50"
            />
          </div>
        )}

        {/* Auction fields */}
        {serviceType === "auction" && (
          <>
            <div>
              <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-2">
                Minimum Bid (USDC)
              </p>
              <input
                type="number"
                value={minBid}
                onChange={(e) => setMinBid(e.target.value)}
                disabled={isDisabled}
                placeholder="0.00"
                className="w-full border border-black/20 bg-neutral-50 px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-2">
                Auction End Time
              </p>
              <input
                type="datetime-local"
                value={auctionEndTime}
                onChange={(e) => setAuctionEndTime(e.target.value)}
                disabled={isDisabled}
                className="w-full border border-black/20 bg-neutral-50 px-4 py-3 text-sm text-black focus:border-black focus:outline-none disabled:opacity-50"
              />
            </div>
          </>
        )}

        <div>
          <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-2">
            Webhook URL (Optional)
          </p>
          <input
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            disabled={isDisabled}
            placeholder="https://your-agent.com/webhook"
            className="w-full border border-black/20 bg-neutral-50 px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>

      {message && (
        <p className={`mt-4 text-[10px] tracking-widest uppercase ${status === "error" ? "text-red-500" : "text-neutral-600"}`}>
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isDisabled || !name || !description || (serviceType === "fixed" ? !price : !minBid || !auctionEndTime)}
        className="mt-6 w-full border border-black bg-black py-3 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white"
      >
        {status === "loading" ? "Listing..." : "List Service"}
      </button>
    </Dialog>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [dialog, setDialog] = useState<"deposit" | "withdraw" | "list" | null>(null);
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<any>("solana");
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [privateRevealed, setPrivateRevealed] = useState(false);
  const [privateBalance, setPrivateBalance] = useState<string | null>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wonBids, setWonBids] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalListings: 0,
    totalDeals: 0,
    completedDeals: 0,
    pendingDeals: 0,
  });

  useEffect(() => {
    if (!address) return;
    
    // count listings
    supabase
      .from("services")
      .select("*", { count: "exact", head: true })
      .eq("seller_address", address)
      .then(({ count }) => {
        setAnalytics(prev => ({ ...prev, totalListings: count ?? 0 }));
      });

    // count deals as seller
    supabase
      .from("deals")
      .select("status")
      .eq("seller_address", address)
      .then(({ data }) => {
        if (!data) return;
        setAnalytics(prev => ({
          ...prev,
          totalDeals: data.length,
          completedDeals: data.filter(d => d.status === "completed").length,
          pendingDeals: data.filter(d => d.status === "pending" || d.status === "in_progress").length,
        }));
      });
  }, [address]);

  // Seller: mark deal as delivered (no escrow release)
  const handleDelivered = async (dealId: string) => {
    await supabase.from("deals").update({ status: "delivered" }).eq("id", dealId);
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: "delivered" } : d));
  };

  const handleDispute = async (dealId: string) => {
    await supabase.from("deals").update({ status: "disputed" }).eq("id", dealId);
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: "disputed" } : d));
  };

  // Buyer: confirm receipt and release escrow to seller
  const handleComplete = async (deal: any) => {
    try {
      const escrowWallet = process.env.NEXT_PUBLIC_ESCROW_WALLET!;
      const feeWallet = process.env.NEXT_PUBLIC_FEE_WALLET!;
      const feePercentage = parseFloat(process.env.NEXT_PUBLIC_FEE_PERCENTAGE ?? "0.02");
      const totalAmount = Math.round(deal.amount * 1e6);
      const feeAmount = Math.round(totalAmount * feePercentage);
      const sellerAmount = totalAmount - feeAmount;

      // build the transfer transaction — release from escrow to seller
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: escrowWallet,
          to: deal.seller_address,
          mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
          amount: sellerAmount,
          visibility: "private",
          fromBalance: "ephemeral",
          toBalance: "ephemeral",
          cluster: "devnet",
          memo: `Escrow release: ${deal.id}`,
        }),
      });

      if (!res.ok) {
        let errText = "";
        try { errText = await res.clone().text(); } catch(e) {}
        throw new Error(`Failed to initialize transfer: ${res.status} - ${errText}`);
      }

      const { transactionBase64 } = await res.json();
      const buffer = Buffer.from(transactionBase64, "base64");
      const transaction = Transaction.from(buffer);
      if (!connection) throw new Error("No connection");
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = new PublicKey(address!);

      const signed = await walletProvider.signTransaction(transaction);
      const rawTx = signed.serialize();
      if (!connection) throw new Error("No connection");
      const txid = await connection.sendRawTransaction(rawTx, { skipPreflight: true });
      if (!connection) throw new Error("No connection");
      await connection.confirmTransaction(txid);

      // fee transfer
      if (feeWallet && feeAmount > 0) {
        const feeRes = await fetch("/api/transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: escrowWallet,
            to: feeWallet,
            mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
            amount: feeAmount,
            visibility: "private",
            fromBalance: "ephemeral",
            toBalance: "ephemeral",
            cluster: "devnet",
            memo: `Protocol fee: ${deal.id}`,
          }),
        });

        if (feeRes.ok) {
          const { transactionBase64: feeTxBase64 } = await feeRes.json();
          const feeBuffer = Buffer.from(feeTxBase64, "base64");
          const feeTransaction = Transaction.from(feeBuffer);
          const feeBlockhash = await connection.getLatestBlockhash();
          feeTransaction.recentBlockhash = feeBlockhash.blockhash;
          feeTransaction.lastValidBlockHeight = feeBlockhash.lastValidBlockHeight;
          feeTransaction.feePayer = new PublicKey(address!);

          const signedFee = await walletProvider.signTransaction(feeTransaction);
          const rawFeeTx = signedFee.serialize();
          const feeTxid = await connection.sendRawTransaction(rawFeeTx, { skipPreflight: true });
          await connection.confirmTransaction(feeTxid);
        }
      }

      // update deal status
      await supabase.from("deals").update({ status: "completed", tx_signature: txid }).eq("id", deal.id);
      setDeals(prev => prev.filter(d => d.id !== deal.id));
    } catch (err: any) {
      console.error("Transfer failed:", err);
    }
  };

  const refreshBalances = async () => {
    if (!address) return;
    setRefreshing(true);
    const res = await fetch(`/api/balance?address=${address}&mint=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU&cluster=devnet`);
    const data = await res.json();
    setUsdcBalance(parseFloat(data.base?.balance ?? "0") / 1e6);
    if (authToken) {
      const privateRes = await fetch(`/api/balance?address=${address}&mint=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU&cluster=devnet&token=${authToken}`);
      const privateData = await privateRes.json();
      const raw = privateData?.private?.balance ?? "0";
      setPrivateBalance((parseFloat(raw) / 1e6).toFixed(4));
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (isConnected && address && connection) {
      fetch(`/api/balance?address=${address}&mint=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU&cluster=devnet`)
        .then((res) => res.json())
        .then((data) => {
          const rawBalance = data?.base?.balance ?? "0";
          setUsdcBalance(parseFloat(rawBalance) / 1e6);
        })
        .catch(console.error);

      supabase
        .from("deals")
        .select("*, services(name)")
        .or(`buyer_address.eq.${address},seller_address.eq.${address}`)
        .in("status", ["pending", "in_progress", "awaiting_delivery", "escrowed", "delivered", "disputed"])
        .order("created_at", { ascending: false })
        .then(({ data }) => { if (data) setDeals(data); });

      supabase
        .from("transactions")
        .select("*, services(name)")
        .eq("wallet_address", address)
        .order("created_at", { ascending: false })
        .limit(6)
        .then(({ data }) => { if (data) setTransactions(data); });

      supabase
        .from("bids")
        .select("*, services(name, seller_address)")
        .eq("bidder_address", address)
        .eq("status", "won")
        .order("created_at", { ascending: false })
        .then(({ data }) => { if (data) setWonBids(data); });
    }
  }, [isConnected, address, connection]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm tracking-widest uppercase text-neutral-500">
            Connect your wallet to access the dashboard
          </p>
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
        <div className="mx-auto w-full max-w-6xl px-6 pt-24 pb-0">

          {/* ── Top bar: address + actions ──────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-[10px] tracking-[0.22em] uppercase text-neutral-500">
                  Agent Dashboard
                </p>
                <button
                  type="button"
                  onClick={refreshBalances}
                  disabled={refreshing}
                  aria-label="Refresh balances"
                  className="border border-black/20 p-1.5 hover:border-black transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={12} strokeWidth={2} className={refreshing ? "animate-spin" : ""} />
                </button>
              </div>
              <code className="text-sm font-semibold text-black">
                {address ? truncate(address) : ""}
              </code>
            </div>

            <div className="flex items-center gap-3">
              {/* Deposit */}
              <button
                type="button"
                id="deposit-btn"
                onClick={() => setDialog("deposit")}
                className="flex items-center gap-2 border border-black bg-black px-4 py-2 text-[11px] tracking-[0.15em] uppercase text-white hover:bg-white hover:text-black transition-colors"
              >
                <ArrowDownToLine size={12} strokeWidth={2} />
                Deposit
              </button>

              {/* Withdraw */}
              <button
                type="button"
                id="withdraw-btn"
                onClick={() => setDialog("withdraw")}
                className="flex items-center gap-2 border border-black/30 px-4 py-2 text-[11px] tracking-[0.15em] uppercase text-neutral-600 hover:border-black hover:text-black transition-colors"
              >
                <ArrowUpFromLine size={12} strokeWidth={2} />
                Withdraw
              </button>

              {/* List Service */}
              <button
                type="button"
                onClick={() => setDialog("list")}
                className="flex items-center gap-2 border border-black/30 px-4 py-2 text-[11px] tracking-[0.15em] uppercase text-neutral-600 hover:border-black hover:text-black transition-colors"
              >
                <ListPlus size={12} strokeWidth={2} />
                List Service
              </button>

              {/* Disconnect */}
              <button
                type="button"
                id="disconnect-btn"
                onClick={() => open()}
                className="flex items-center gap-2 border border-black/15 px-3 py-2 text-[11px] tracking-[0.15em] uppercase text-neutral-400 hover:border-black/40 hover:text-neutral-600 transition-colors"
              >
                <LogOut size={12} strokeWidth={2} />
                Disconnect
              </button>
            </div>
          </div>

          {/* ── Balance cards ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-px bg-black/10 sm:grid-cols-2">
            <PublicBalanceCard usdcBalance={usdcBalance} />
            <PrivateBalanceCard
              address={address}
              walletProvider={walletProvider}
              balance={privateBalance}
              setBalance={setPrivateBalance}
              onReveal={(token) => {
                setAuthToken(token);
                setPrivateRevealed(true);
              }}
            />
          </div>

          {/* ── Agent Analytics ────────────────────────────────────────── */}
          <section className="mt-12">
            <h2 className="text-xs tracking-[0.22em] uppercase text-neutral-600 mb-5">
              Agent Analytics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border border-black/10 p-4">
                <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1">Active Listings</p>
                <p className="text-2xl font-black text-black">{analytics.totalListings}</p>
              </div>
              <div className="border border-black/10 p-4">
                <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1">Total Sales</p>
                <p className="text-2xl font-black text-black">{analytics.totalDeals}</p>
              </div>
              <div className="border border-black/10 p-4">
                <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1">Completed</p>
                <p className="text-2xl font-black text-black">{analytics.completedDeals}</p>
              </div>
              <div className="border border-black/10 p-4">
                <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-1">Pending</p>
                <p className="text-2xl font-black text-black">{analytics.pendingDeals}</p>
              </div>
            </div>
          </section>

          {/* ── Auctions Won ────────────────────────────────────────────── */}
          {wonBids.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xs tracking-[0.22em] uppercase text-neutral-600 mb-5">
                Auctions Won
              </h2>
              <div className="border border-black/10">
                {wonBids.map((bid, i) => (
                  <div
                    key={bid.id}
                    className={`flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors ${
                      i < wonBids.length - 1 ? "border-b border-black/10" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-black">
                        {bid.services?.name ?? "Unknown Service"}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                        Seller: {bid.services?.seller_address ? truncate(bid.services.seller_address) : "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-black">${bid.amount.toFixed(2)} USDC</span>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400">{formatDate(bid.created_at)}</span>
                      </div>
                      <span className="border border-black/20 px-2 py-0.5 text-[10px] tracking-widest uppercase text-neutral-600">
                        Won
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Active deals ───────────────────────────────────────────── */}
          <ActiveDeals deals={deals} address={address as string} handleComplete={handleComplete} handleDelivered={handleDelivered} handleDispute={handleDispute} setDeals={setDeals} />

          {/* ── Tx history ─────────────────────────────────────────────── */}
          <TxHistory transactions={transactions} />
        </div>
        </div>
      </main>

      <Footer />

      {/* ── Dialogs ──────────────────────────────────────────────────────── */}
      {dialog === "deposit" && address && (
        <DepositDialog address={address} onClose={() => setDialog(null)} onSuccess={refreshBalances} />
      )}
      {dialog === "withdraw" && address && (
        <WithdrawDialog address={address} walletProvider={walletProvider} onClose={() => setDialog(null)} onSuccess={refreshBalances} />
      )}
      {dialog === "list" && address && (
        <ListServiceDialog address={address} onClose={() => setDialog(null)} />
      )}
    </div>
  );
}
