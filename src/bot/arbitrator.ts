import { CONFIG } from '../config/config';
import { EvidenceListener } from './evidenceListener';
import { logger } from '../utils/logger';
import * as process from 'process';

/**
 * Entry point for the Autonomous AI Arbitrator Bot.
 * It initialises the Nostr listener and keeps the process alive
 * until a termination signal is received.
 */
async function main() {
  logger.info('Starting Unicity Arbitrator Bot');
  const listener = new EvidenceListener();

  // Graceful shutdown handling
  const shutdown = async () => {
    logger.info('Shutting down Arbitrator Bot...');
    // Currently the EvidenceListener runs an infinite async iterator.
    // In a full implementation we would expose a `stop()` method.
    // For the prototype we simply exit the process.
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  try {
    await listener.start();
  } catch (err) {
    logger.error('Fatal error in EvidenceListener', err);
    process.exit(1);
  }
}

void main();
