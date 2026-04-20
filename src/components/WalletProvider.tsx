"use client";

import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import { solana, solanaDevnet } from "@reown/appkit/networks";
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const solanaWeb3JsAdapter = new SolanaAdapter({
    wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: [solanaDevnet, solana],
    defaultNetwork: solanaDevnet,
    projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID!,
    featuredWalletIds: [
        "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // Phantom
        "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Solflare
    ],
    metadata: {
        name: "Covert",
        description: "Private Agent Commerce on Solana",
        url: "https://covert.app",
        icons: ["/icon.png"],
    },
    features: {
        analytics: false,
    },
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}