// src/bot/verifier.ts
import { SignedIntent } from '../types/signedIntent';
import { EvidenceBundle } from '../types/evidence';
import { Verdict } from '../types/dispute';
import { verifySignature } from '../utils/crypto';
import { logger } from '../utils/logger';

/** Verify the digital signature of a SignedIntent */
export async function verifySignedIntent(intent: SignedIntent): Promise<boolean> {
  // For demo purposes we assume the intent.id is signed by the buyer's pubkey.
  // In a real implementation you would verify the appropriate fields.
  return await verifySignature(intent.id, (intent as any).signature, intent.buyerPubKey);
}

/** Verify both evidence events and decide a verdict */
export function verifyEvidenceBundle(
  intent: SignedIntent,
  buyerEv?: any,
  sellerEv?: any
): Verdict {
  // Simple placeholder logic:
  // - If both evidences are present and their hashes match intent.expectedDataHash -> buyer wins.
  // - If only seller evidence present and matches -> seller wins.
  // - Otherwise timeout or missing evidence -> buyer wins by default.
  if (buyerEv && sellerEv) {
    // placeholder: compare payloads
    const buyerHash = buyerEv.content; // assume content holds hash
    const sellerHash = sellerEv.content;
    if (buyerHash === intent.expectedDataHash && sellerHash === intent.expectedDataHash) {
      logger.info('Both parties provided matching evidence');
      return Verdict.WinnerBuyer; // arbitrarily choose buyer when both match
    }
  }
  if (sellerEv) {
    const sellerHash = sellerEv.content;
    if (sellerHash === intent.expectedDataHash) {
      logger.info('Seller provided valid evidence');
      return Verdict.WinnerSeller;
    }
  }
  // Default fallback
  logger.warn('Evidence insufficient – defaulting to buyer');
  return Verdict.WinnerBuyer;
}
