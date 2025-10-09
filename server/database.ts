// Replit Database wrapper for Funny Economy
class ReplitDatabase {
  private store = new Map<string, any>();
  private cache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();
  private CACHE_TTL = 30000; // 30 seconds

  async get(key: string): Promise<any> {
    // Check cache first
    if (this.cache.has(key)) {
      const expiry = this.cacheExpiry.get(key) || 0;
      if (Date.now() < expiry) {
        return this.cache.get(key);
      }
    }

    try {
      // Use in-memory store for server-side persistence
      const value = this.store.get(key);

      // Cache the result
      if (value !== undefined) {
        this.cache.set(key, value);
        this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
      }

      return value;
    } catch (error) {
      console.error(`Database get error for key ${key}:`, error);
      return undefined;
    }
  }

  async set(key: string, value: any): Promise<void> {
    try {
      // Store in memory
      this.store.set(key, value);

      // Update cache
      this.cache.set(key, value);
      this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
    } catch (error) {
      console.error(`Database set error for key ${key}:`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      this.store.delete(key);
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
    } catch (error) {
      console.error(`Database delete error for key ${key}:`, error);
    }
  }

  async list(prefix: string = ""): Promise<string[]> {
    try {
      const keys: string[] = [];
      const allKeys = Array.from(this.store.keys());
      for (const key of allKeys) {
        if (key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return keys;
    } catch (error) {
      console.error(`Database list error for prefix ${prefix}:`, error);
      return [];
    }
  }

  // Helper method to clear expired cache entries
  clearExpiredCache(): void {
    const now = Date.now();
    const entries = Array.from(this.cacheExpiry.entries());
    for (const [key, expiry] of entries) {
      if (now >= expiry) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
  }

  // Mock execute for Replit Database compatibility
  async execute(query: string): Promise<any> {
    console.log("Executing SQL:", query);
    // In a real Replit Database scenario, you would use the actual database client here.
    // For this example, we'll just simulate the execution and assume it succeeds.
    return Promise.resolve();
  }
}

export const db = new ReplitDatabase();

// Clear expired cache every 5 minutes
setInterval(() => {
  db.clearExpiredCache();
}, 300000);

// Placeholder for sql tag function if not already defined
// In a real environment, this would likely come from a database library
const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += values[i] + strings[i + 1];
  }
  return result;
};

export async function createTables() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      coins INTEGER DEFAULT 500,
      bank INTEGER DEFAULT 0,
      bank_capacity INTEGER DEFAULT 5000,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      inventory TEXT DEFAULT '[]',
      friends TEXT DEFAULT '[]',
      bio TEXT DEFAULT '',
      avatar_url TEXT DEFAULT '',
      online_status BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      achievements TEXT DEFAULT '[]',
      game_stats TEXT DEFAULT '{}',
      daily_earn TEXT DEFAULT '{}',
      banned BOOLEAN DEFAULT false,
      ban_reason TEXT DEFAULT '',
      temp_ban_until TIMESTAMP,
      admin_role TEXT DEFAULT 'none'
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS trade_offers (
      id TEXT PRIMARY KEY,
      from_user_id TEXT NOT NULL,
      to_user_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (from_user_id) REFERENCES users(id),
      FOREIGN KEY (to_user_id) REFERENCES users(id)
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY,
      user_id_1 TEXT NOT NULL,
      user_id_2 TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      user_1_ready BOOLEAN DEFAULT false,
      user_2_ready BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id_1) REFERENCES users(id),
      FOREIGN kEY (user_id_2) REFERENCES users(id)
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS trade_items (
      id TEXT PRIMARY KEY,
      trade_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      item_id TEXT,
      quantity INTEGER DEFAULT 1,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trade_id) REFERENCES trades(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}