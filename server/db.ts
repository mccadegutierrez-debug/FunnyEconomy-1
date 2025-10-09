import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

neonConfig.webSocketConstructor = ws;

// Database failover configuration
const DATABASE_URLS = [
  process.env.DATABASE_URL,
  process.env.BACKUP_DATABASE_URL_1,
  process.env.BACKUP_DATABASE_URL_2,
].filter(Boolean) as string[];

if (DATABASE_URLS.length === 0) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const DATABASE_LABELS = ["Primary", "Backup 1", "Backup 2"];

// Mutable exports for failover
export let pool: Pool;
export let db: ReturnType<typeof drizzle>;
let currentDatabaseIndex = 0;

// Initialize connection with primary database
function initializeDatabase(index: number = 0) {
  const url = DATABASE_URLS[index];
  if (!url) {
    throw new Error(`No database URL at index ${index}`);
  }

  pool = new Pool({ 
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: false,
  });

  // Handle pool errors
  pool.on('error', (err) => {
    console.error('Unexpected database pool error:', err);
  });

  db = drizzle({ client: pool, schema });
  currentDatabaseIndex = index;
  console.log(`Using database: ${DATABASE_LABELS[index] || `Database ${index}`}`);
}

// Check if error is a connection error that should trigger failover
function isConnectionError(error: any): boolean {
  const message = error?.message?.toLowerCase() || "";
  const code = error?.code;

  // Connection-specific errors
  return (
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND" ||
    code === "ETIMEDOUT" ||
    code === "XX000" || // Neon endpoint disabled
    message.includes("endpoint has been disabled") ||
    message.includes("connection") ||
    message.includes("network")
  );
}

// Retry logic for database operations with automatic failover
export async function withDatabaseFailover<T>(
  operation: () => Promise<T>
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < DATABASE_URLS.length; i++) {
    const dbIndex = (currentDatabaseIndex + i) % DATABASE_URLS.length;
    const url = DATABASE_URLS[dbIndex];

    if (!url) continue;

    try {
      // Switch to new database if needed
      if (dbIndex !== currentDatabaseIndex) {
        const oldPool = pool;
        initializeDatabase(dbIndex);
        // Clean up old connection
        await oldPool.end().catch(() => {});
      }

      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Only try next database if it's a connection error
      if (isConnectionError(error)) {
        console.error(`Database connection error on ${DATABASE_LABELS[dbIndex]}: ${(error as Error).message}`);

        // If this is our current database, try reconnecting before failover
        if (dbIndex === currentDatabaseIndex && i === 0) {
          try {
            const oldPool = pool;
            await oldPool.end().catch(() => {});
            initializeDatabase(dbIndex);
            return await operation();
          } catch (reconnectError) {
            console.error(`Reconnection failed on ${DATABASE_LABELS[dbIndex]}`);
            continue;
          }
        }
        continue;
      } else {
        // Application/validation error - don't retry
        throw error;
      }
    }
  }

  throw new Error(
    `All database connections failed. Last error: ${lastError?.message}`
  );
}

// Initialize the primary database on startup
initializeDatabase(0);