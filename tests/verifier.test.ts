// tests/verifier.test.ts
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import { verifySignedIntent, verifyEvidenceBundle } from '../src/bot/verifier';
import { Verdict } from '../src/types/dispute';

describe('Verifier', () => {
  test('verifySignedIntent succeeds with valid signature', async () => {
    const message = 'test-intent-id';
    const keyPair = nacl.sign.keyPair();
    const signature = Buffer.from(nacl.sign.detached(Buffer.from(message), keyPair.secretKey)).toString('hex');
    const pubKeyHex = Buffer.from(keyPair.publicKey).toString('hex');
    const intent: any = {
      id: message,
      signature,
      buyerPubKey: pubKeyHex,
    };
    const result = await verifySignedIntent(intent);
    expect(result).toBe(true);
  });

  test('verifyEvidenceBundle returns WinnerBuyer when both evidences match', () => {
    const intent: any = { expectedDataHash: 'abc123' };
    const buyerEv: any = { content: 'abc123' };
    const sellerEv: any = { content: 'abc123' };
    const verdict = verifyEvidenceBundle(intent, buyerEv, sellerEv);
    expect(verdict).toBe(Verdict.WinnerBuyer);
  });
});
