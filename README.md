# Unicity Autonomous AI Arbitrator Bot

## Project Overview
A prototype bot that autonomously resolves disputes on the Unicity Testnet v2 using Nostr for communication and the Sphere SDK for escrow handling. It listens to a Nostr group chat, verifies cryptographic proofs, determines a verdict, and settles the escrow.

## Directory Structure
```
unicity-arbitrator-bot/
├─ .env               # Environment configuration (example provided)
├─ package.json       # Project metadata and scripts
├─ tsconfig.json      # TypeScript compiler configuration
├─ src/
│  ├─ config/
│  │   └─ config.ts          # Loads env vars and exports CONFIG
│  ├─ types/
│  │   ├─ dispute.ts         # Enums for dispute state and verdict
│  │   ├─ evidence.ts        # `EvidenceBundle` interface
│  │   └─ signedIntent.ts    # SignedIntent interface
│  ├─ utils/
│  │   ├─ crypto.ts          # Minimal signature verification (placeholder)
│  │   └─ logger.ts          # Winston logger setup
│  └─ bot/
│      ├─ arbitrator.ts      # Entry point, starts the EvidenceListener
│      ├─ evidenceListener.ts# State‑machine that consumes Nostr events
│      ├─ verifier.ts        # Verifies signed intents and evidence bundles
│      └─ settlement.ts      # Wraps Sphere‑SDK escrow settlement
``` 

## Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (comes with Node)
- Access to the Unicity Testnet RPC endpoint (configured in `.env`)
- A Nostr private key for the bot (set in `BOT_PRIVATE_KEY`)

## Setup
1. **Clone / open the project folder**
   ```bash
   cd C:/Users/Admin/Documents/unicity/sociaal
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Edit the generated `.env` file and replace placeholder values with real ones (group chat pubkey, bot private key, escrow contract address, etc.).
   - Ensure the Nostr relay URLs are reachable.

## Build & Run
- **Build** (produces JavaScript in `dist/`):
  ```bash
  npm run build
  ```
- **Run** the compiled bot:
  ```bash
  npm start
  ```
- **Development mode** (uses `ts-node` for rapid iteration):
  ```bash
  npm run dev
  ```

## How It Works
1. **Dispute Trigger** – A participant posts a Nostr event (kind `DISPUTE_EVENT_KIND`) containing a `SignedIntent`.
2. **Evidence Collection** – The `EvidenceListener` waits for two evidence events (kind `EVIDENCE_EVENT_KIND`) from buyer and seller.
3. **Verification** – `verifier.ts` checks the intent signature and validates the evidence bundle, returning a `Verdict`.
4. **Settlement** – `settlement.ts` loads the escrow contract via the Sphere SDK and signs/releases funds to the winner.
5. **Result Publication** – The bot posts a final verdict event back to the Nostr group chat.

## Extending the Bot
- Replace the placeholder `verifySignature` in `utils/crypto.ts` with a real ECDSA verification (e.g., `tweetnacl` or `ethers`).
- Implement richer escrow logic using the actual Sphere‑SDK APIs.
- Add unit tests under a `test/` directory and integrate a CI pipeline.
- Package the bot as a Docker container for easier deployment.

## FAQs
- **Why is the signature verification simple?**
  The prototype focuses on flow; replace it with a proper implementation before production.
- **Can I run multiple bots?**
  Yes – give each bot its own Nostr key and separate escrow contracts.
- **How do I monitor logs?**
  The bot uses Winston and logs to the console. Adjust `logger.ts` to add file transports if needed.

---
*Happy building! If you need further assistance—adding tests, Dockerfile, or deeper integration—just let me know.*
