// src/utils/crypto.ts
// Real Ed25519 signature verification using tweetnacl.
// The SignedIntent.id is assumed to be the message that was signed.

import nacl from 'tweetnacl';
import { Buffer } from 'buffer';

/**
 * Verify an Ed25519 signature.
 * @param message - The original message that was signed (string).
 * @param signatureHex - Hex‑encoded signature (64 bytes).
 * @param pubKeyHex - Hex‑encoded public key (32 bytes).
 * @returns true if the signature is valid, false otherwise.
 */
export async function verifySignature(
  message: string,
  signatureHex: string,
  pubKeyHex: string,
): Promise<boolean> {
  try {
    const messageBytes = Buffer.from(message, 'utf8');
    const signature = Buffer.from(signatureHex, 'hex');
    const pubKey = Buffer.from(pubKeyHex, 'hex');
    if (signature.length !== nacl.sign.signatureLength || pubKey.length !== nacl.sign.publicKeyLength) {
      return false;
    }
    return nacl.sign.detached.verify(messageBytes, signature, pubKey);
  } catch (e) {
    // Any parsing error results in a failed verification.
    return false;
  }
}
