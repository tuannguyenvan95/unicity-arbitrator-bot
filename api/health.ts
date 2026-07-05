export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
    version: '0.1.0',
    bot: 'Unicity Arbitrator Bot',
    network: 'Testnet v2',
  });
}
