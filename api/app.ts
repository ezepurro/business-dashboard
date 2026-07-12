import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    service: 'business-dashboard-api',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Business Dashboard API running',
  });
});

export default app;
