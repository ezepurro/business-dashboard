import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import companyRoutes from './routes/company.routes';
import datasetRoutes from './routes/dataset.routes';
import errorMiddleware from './middleware/error.middleware';
import helmet from 'helmet';
import cors from 'cors';
import { swaggerMiddleware } from './openapi/swagger';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/api/health', (_, res) => {
  res.json({
    ok: true,
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/companies', companyRoutes);

app.use('/api/docs', ...swaggerMiddleware);

app.use('/datasets', datasetRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado.',
  });
});

app.use(errorMiddleware);

export default app;
