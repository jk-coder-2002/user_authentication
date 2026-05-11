import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { startActivationJob } from './cron/activation.cron';
import { connectToDatabase, verifySchema } from './prisma/client';

const start = async (): Promise<void> => {
  try {
    await connectToDatabase();
    logger.info('Database connection established');

    await verifySchema();
    logger.info('Prisma schema validated');

    const server = app.listen(config.port, () => {
      logger.info(`Server listening on port ${config.port}`);
    });

    startActivationJob();

    process.on('unhandledRejection', (reason) => {
      logger.error(`Unhandled rejection: ${reason}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';
    logger.error(`Failed to start server: ${message}`);
    process.exit(1);
  }
};

start();
