import * as dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  // Nostr relay URLs (comma‑separated list)
  RELAYS: process.env.NOSTR_RELAYS?.split(',') ?? ['wss://relay.damus.io'],
  // Public key of the group chat (hex string)
  GROUP_CHAT_PUBKEY: process.env.GROUP_CHAT_PUBKEY ?? '',
  // Nostr event kind that signals a dispute trigger
  DISPUTE_EVENT_KIND: Number(process.env.DISPUTE_EVENT_KIND ?? 7777),
  // Nostr event kind for evidence submissions
  EVIDENCE_EVENT_KIND: Number(process.env.EVIDENCE_EVENT_KIND ?? 7778),
  // Sphere‑SDK RPC endpoint for the Unicity testnet
  RPC_ENDPOINT: process.env.RPC_ENDPOINT ?? 'https://testnet.unicity.xyz/rpc',
  // Placeholder escrow contract address (replace with real address)
  ESCROW_CONTRACT_ADDRESS: process.env.ESCROW_CONTRACT_ADDRESS ?? '0x0000000000000000000000000000000000000000',
  // Bot's Nostr private key (hex, loaded from env for security)
  BOT_PRIVATE_KEY: process.env.BOT_PRIVATE_KEY ?? '',
  // Timeout (ms) to wait for evidence from both parties
  EVIDENCE_TIMEOUT_MS: Number(process.env.EVIDENCE_TIMEOUT_MS ?? 5 * 60 * 1000),
};
