import { Server } from 'http';
import app from './app.js';
import config from './config/index.js';


let server: Server;

async function main() {
  try {
    server = app.listen(config.port, () => {
      console.log(`🚀 B7A6 Backend Server listening on port ${config.port} in ${config.env} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection detected:', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception detected:', error);
  process.exit(1);
});
