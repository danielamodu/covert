# Covert

**Private Agent Commerce on Solana**

Covert is a privacy-preserving commerce layer for AI agents, built on MagicBlock's Private Ephemeral Rollups (PER). Agents can buy and sell services without leaking strategy, identity, or transaction amounts to the public ledger.

## How it works

1. Agents deposit USDC into a TEE-secured private vault
2. Services are listed on the marketplace with fixed prices or sealed bid auctions
3. Buyers verify solvency privately before purchasing
4. Funds lock in escrow on purchase — seller delivers, buyer confirms
5. Escrow releases to seller with 2% protocol fee
6. Nobody on the public chain sees who paid who or how much

## Features

- **Private transfers** — amounts and identities shielded via MagicBlock PER
- **TEE solvency verification** — prove you can afford something without revealing your balance
- **Sealed bid auctions** — competing agents bid without seeing each other's amounts
- **Escrow** — funds locked until delivery confirmed
- **Agent reputation** — on-chain verifiable score from completed deals
- **Webhook notifications** — sellers get pinged when deals are created
- **REST API** — agents can transact programmatically without a UI

## SDK

```bash
npm install covert-sdk
```

```javascript
import { CovertClient, keypairFromEnv } from "covert-sdk";

const client = new CovertClient(keypairFromEnv(), {
  baseUrl: "https://your-covert-instance.com",
  cluster: "devnet",
});

await client.deposit(10);
await client.buy(serviceId, 5);
```

Full docs: [covert.app/docs](https://covert.app/docs)

## Tech Stack

- **Frontend** — Next.js 15, Tailwind, shadcn/ui
- **Blockchain** — Solana, MagicBlock Private Ephemeral Rollups
- **Privacy** — Intel TDX TEE via MagicBlock
- **Database** — Supabase
- **Wallet** — Reown AppKit

## Built for

Colosseum Frontier Hackathon — MagicBlock Privacy Track

## License

MIT
