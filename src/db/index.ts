import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Db = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __db?: Db };

/** Lazy: nothing connects at import time, so `next build` works without a DB. */
export function getDb(): Db {
  if (!globalForDb.__db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    globalForDb.__db = drizzle(new Pool({ connectionString: url, max: 10 }), { schema });
  }
  return globalForDb.__db;
}

export * from "./schema";

/** Lazy proxy so `import { db }` never connects until first use. */
export const db = new Proxy({} as Db, {
  get: (_t, prop) => Reflect.get(getDb(), prop),
});
