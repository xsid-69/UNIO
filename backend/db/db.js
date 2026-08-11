import dns from 'node:dns';
import mongoose from 'mongoose';

let connectionPromise = null;
let shutdownHandlersAttached = false;

function attachShutdownHandlers() {
  if (shutdownHandlersAttached) return;
  shutdownHandlersAttached = true;
  const shutdown = async (signal) => {
    try {
      await mongoose.connection.close();
      console.log(`MongoDB connection closed after ${signal}`);
      process.exit(0);
    } catch (error) {
      console.error('Failed to close MongoDB connection:', error.message);
      process.exit(1);
    }
  };
  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  const dnsServers = process.env.MONGO_DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean);
  if (dnsServers?.length) dns.setServers(dnsServers);
  if (!process.env.MONGO_DB_URI) throw new Error('MONGO_DB_URI is not set');

  attachShutdownHandlers();
  connectionPromise = mongoose.connect(process.env.MONGO_DB_URI, { serverSelectionTimeoutMS: 10_000 })
    .then(() => {
      console.log('Database connected successfully');
      return mongoose.connection;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });
  return connectionPromise;
}

export default connectDB;