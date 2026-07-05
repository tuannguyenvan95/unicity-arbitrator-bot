// src/server.ts
import express from 'express';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.HEALTH_PORT ?? 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  logger.info(`Health check server listening on port ${PORT}`);
});

export default app;
