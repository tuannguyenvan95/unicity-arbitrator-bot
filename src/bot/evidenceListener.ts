// src/bot/evidenceListener.ts
import { SimplePool, Event, Sub, signEvent } from 'nostr-tools';
import { CONFIG } from '../config/config';
import { DisputeState, Verdict } from '../types/dispute';
import { SignedIntent } from '../types/signedIntent';
import { verifyEvidenceBundle, verifySignedIntent } from '../bot/verifier';
import { settleEscrow } from '../bot/settlement';
import { logger } from '../utils/logger';

/**
 * EvidenceListener implements the dispute state‑machine.
 * It monitors a Nostr group chat for a dispute trigger event and then
 * collects evidence events from the two parties.
 */
export class EvidenceListener {
  private pool: SimplePool;
  private currentState: DisputeState = DisputeState.Idle;
  private buyerEvidence?: Event;
  private sellerEvidence?: Event;
  private intent?: SignedIntent;
  private timeoutHandle?: NodeJS.Timeout;

  constructor() {
    this.pool = new SimplePool();
  }

  /** Start listening to the group chat */
  public async start() {
    logger.info('Connecting to Nostr relays…');
    const sub: Sub = this.pool.sub(CONFIG.RELAYS, [{ kinds: [CONFIG.DISPUTE_EVENT_KIND, CONFIG.EVIDENCE_EVENT_KIND] }]);
    // Listen for events via the subscription's event emitter
    sub.on('event', (ev: Event) => this.handleEvent(ev));
    // Keep the process alive; the subscription runs in the background.
    await new Promise(() => {});
  }

  private async handleEvent(ev: Event) {
    switch (this.currentState) {
      case DisputeState.Idle:
        if (ev.kind === CONFIG.DISPUTE_EVENT_KIND) {
          await this.onDisputeTrigger(ev);
        }
        break;
      case DisputeState.Collecting:
        if (ev.kind === CONFIG.EVIDENCE_EVENT_KIND) {
          await this.onEvidence(ev);
        }
        break;
      default:
        // ignore events in other states
        break;
    }
  }

  /** Process the initial dispute trigger containing the signed intent */
  private async onDisputeTrigger(ev: Event) {
    logger.info('Dispute trigger received');
    try {
      const payload = JSON.parse(ev.content);
      const intent: SignedIntent = payload.signedIntent;
      if (!(await verifySignedIntent(intent))) {
        logger.error('Signed intent verification failed');
        return;
      }
      this.intent = intent;
      this.transition(DisputeState.Collecting);
      this.timeoutHandle = setTimeout(() => this.onEvidenceTimeout(), CONFIG.EVIDENCE_TIMEOUT_MS);
    } catch (e) {
      logger.error('Failed to parse dispute trigger event', e);
    }
  }

  /** Collect evidence from buyer or seller */
  private async onEvidence(ev: Event) {
    const signer = ev.pubkey;
    if (!this.intent) return;
    if (signer === this.intent.buyerPubKey) {
      this.buyerEvidence = ev;
      logger.info('Buyer evidence received');
    } else if (signer === this.intent.sellerPubKey) {
      this.sellerEvidence = ev;
      logger.info('Seller evidence received');
    } else {
      logger.warn('Evidence from unknown participant ignored');
    }
    if (this.buyerEvidence && this.sellerEvidence) {
      if (this.timeoutHandle) clearTimeout(this.timeoutHandle);
      this.transition(DisputeState.Verifying);
      await this.runVerification();
    }
  }

  /** Called when evidence timeout expires */
  private async onEvidenceTimeout() {
    logger.warn('Evidence collection timed out');
    this.transition(DisputeState.Verifying);
    await this.runVerification();
  }

  /** Verification step */
  private async runVerification() {
    if (!this.intent) {
      logger.error('No intent available for verification');
      this.transition(DisputeState.Completed);
      return;
    }
    const verdict = verifyEvidenceBundle(this.intent, this.buyerEvidence, this.sellerEvidence);
    logger.info('Verdict determined: %s', verdict);
    this.transition(DisputeState.Settling);
    await settleEscrow(this.intent, verdict);
    this.transition(DisputeState.Completed);
    await this.postVerdictEvent(verdict);
    this.reset();
  }

  /** Publish a final verdict event back to the group */
  private async postVerdictEvent(verdict: Verdict) {
    const event: Event = {
      kind: CONFIG.DISPUTE_EVENT_KIND,
      content: JSON.stringify({ verdict }),
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      pubkey: '' // will be replaced by signature
    } as any;
    const signed = signEvent(event, CONFIG.BOT_PRIVATE_KEY);
    (this.pool as any).publish(CONFIG.RELAYS, signed as any);
    logger.info('Verdict event published');
  }

  private transition(state: DisputeState) {
    logger.debug(`State transition: ${this.currentState} → ${state}`);
    this.currentState = state;
  }

  private reset() {
    this.buyerEvidence = undefined;
    this.sellerEvidence = undefined;
    this.intent = undefined;
    this.transition(DisputeState.Idle);
  }
}
