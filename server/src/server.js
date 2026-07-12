import env from './config/env.js';
import app from './app.js';
import prisma from './config/prisma.js';

let server;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅  Database connected');

    server = app.listen(env.port, () => {
      console.log(`🚀  TransitOps API running`);
      console.log(`    Environment : ${env.nodeEnv}`);
      console.log(`    URL         : http://localhost:${env.port}`);
      console.log(`    Health      : http://localhost:${env.port}/api/health`);
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`\n⚠️   ${signal} received — shutting down gracefully`);
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      console.log('✅  Prisma disconnected. Goodbye.');
      process.exit(0);
    });
  } else {
    await prisma.$disconnect();
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('❌  Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌  Uncaught Exception:', err.message);
  process.exit(1);
});

startServer();
