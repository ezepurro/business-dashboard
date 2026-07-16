import app from './app';
import { connectDB } from './config/database';
import { initializeStorage } from './storage/initialize-storage';
import 'dotenv/config';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize storage (also create bucket if it doesn't exist)
    await initializeStorage();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`🚀 API listening on port ${PORT}`);
    });

    function shutdown(signal: NodeJS.Signals) {
      console.log(`Received ${signal}. Closing server...`);

      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    }

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
