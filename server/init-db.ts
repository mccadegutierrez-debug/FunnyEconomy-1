
import { db } from './db';
import { sql } from 'drizzle-orm';

async function initializeTables() {
  console.log('Initializing trade tables...');

  try {
    // Create trade_offers table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS trade_offers (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        from_user_id VARCHAR NOT NULL,
        to_user_id VARCHAR NOT NULL,
        status VARCHAR DEFAULT 'pending' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    // Create trades table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS trades (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id_1 VARCHAR NOT NULL,
        user_id_2 VARCHAR NOT NULL,
        status VARCHAR DEFAULT 'active' NOT NULL,
        user_1_ready BOOLEAN DEFAULT false NOT NULL,
        user_2_ready BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    // Create trade_items table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS trade_items (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        trade_id VARCHAR NOT NULL,
        user_id VARCHAR NOT NULL,
        item_type VARCHAR NOT NULL,
        item_id VARCHAR,
        quantity INTEGER DEFAULT 1 NOT NULL,
        added_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    console.log('Trade tables created successfully!');
  } catch (error) {
    console.error('Failed to initialize tables:', error);
    throw error;
  }

  process.exit(0);
}

initializeTables();
