import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Connects to Neon Postgres Database using serverless HTTP client.
 * Pass process.env.DATABASE_URL or Neon connection string.
 */
export function createNeonClient(databaseUrl?: string) {
  const connectionString = databaseUrl || process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('⚠️ [Neon DB] DATABASE_URL no definida. Usando cliente simulado.');
    return null;
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

export * from './schema';
