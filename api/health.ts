import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
    version: '0.1.0',
    bot: 'Unicity Arbitrator Bot',
    network: 'Testnet v2',
  });
}
