import { z } from "zod";
import {
  pgTable,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  text,
  serial,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Drizzle table definitions
export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 20 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  coins: integer("coins").default(500).notNull(),
  bank: integer("bank").default(0).notNull(),
  bankCapacity: integer("bank_capacity").default(10000).notNull(),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  inventory: jsonb("inventory").default([]).notNull(),
  friends: jsonb("friends").default([]).notNull(),
  bio: varchar("bio", { length: 200 }).default("").notNull(),
  avatarUrl: text("avatar_url").default("").notNull(),
  onlineStatus: boolean("online_status").default(false).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  lastActive: timestamp("last_active")
    .default(sql`now()`)
    .notNull(),
  banned: boolean("banned").default(false).notNull(),
  banReason: text("ban_reason").default("").notNull(),
  tempBanUntil: timestamp("temp_ban_until"),
  lastFreemiumClaim: timestamp("last_freemium_claim"),
  lastDailyClaim: timestamp("last_daily_claim"),
  lastWork: timestamp("last_work"),
  lastBeg: timestamp("last_beg"),
  lastSearch: timestamp("last_search"),
  lastRob: timestamp("last_rob"),
  lastFish: timestamp("last_fish"),
  lastMine: timestamp("last_mine"),
  lastVote: timestamp("last_vote"),
  lastAdventure: timestamp("last_adventure"),
  lastCrime: timestamp("last_crime"),
  lastHunt: timestamp("last_hunt"),
  lastDig: timestamp("last_dig"),
  lastPostMeme: timestamp("last_post_meme"),
  lastPostmeme: timestamp("last_postmeme"),
  lastStream: timestamp("last_stream"),
  lastHighLow: timestamp("last_high_low"),
  lastScratch: timestamp("last_scratch"),
  banExpiresAt: timestamp("ban_expires_at"),
  dailyEarn: integer("daily_earn").default(0).notNull(),
  lastIP: varchar("last_ip").default("").notNull(),
  achievements: jsonb("achievements").default([]).notNull(),
  gameStats: jsonb("game_stats")
    .default(sql`'{}'`)
    .notNull(),
  adminRole: varchar("admin_role", {
    enum: [
      "none",
      "junior_admin",
      "admin",
      "senior_admin",
      "lead_admin",
      "owner",
    ],
  })
    .default("none")
    .notNull(),
});

export const items = pgTable("items", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  type: varchar("type", {
    enum: ["tool", "collectible", "powerup", "consumable", "lootbox"],
  }).notNull(),
  rarity: varchar("rarity", {
    enum: ["common", "uncommon", "rare", "epic", "legendary"],
  }).notNull(),
  effects: jsonb("effects")
    .default(sql`'{}'`)
    .notNull(),
  stock: integer("stock")
    .default(sql`2147483647`)
    .notNull(), // Max int for "infinity"
  currentPrice: integer("current_price"),
});

export const transactions = pgTable("transactions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user: varchar("user").notNull(),
  type: varchar("type", {
    enum: [
      "earn",
      "spend",
      "transfer",
      "rob",
      "fine",
      "freemium",
      "fish",
      "mine",
      "vote",
      "adventure",
      "crime",
      "postmeme",
      "stream",
      "highlow",
      "scratch",
    ],
  }).notNull(),
  amount: integer("amount").notNull(),
  targetUser: varchar("target_user"),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp")
    .default(sql`now()`)
    .notNull(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user: varchar("user").notNull(),
  message: text("message").notNull(),
  type: varchar("type", {
    enum: ["trade", "friend", "event", "system", "rob"],
  }).notNull(),
  read: boolean("read").default(false).notNull(),
  timestamp: timestamp("timestamp")
    .default(sql`now()`)
    .notNull(),
});

export const events = pgTable("events", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  type: varchar("type", {
    enum: ["holiday", "double_xp", "double_luck", "double_money", "custom"],
  }).notNull(),
  emoji: varchar("emoji").default("🎉").notNull(),
  active: boolean("active").default(false).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  multipliers: jsonb("multipliers")
    .default(sql`'{}'`)
    .notNull(),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar("username").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp")
    .default(sql`now()`)
    .notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  adminUsername: varchar("admin_username").notNull(),
  adminRole: varchar("admin_role").notNull(),
  action: varchar("action").notNull(), // e.g., "ban_user", "give_coins", "create_item"
  targetType: varchar("target_type"), // e.g., "user", "item", "system"
  targetId: varchar("target_id"), // ID of the affected entity
  targetName: varchar("target_name"), // Name/username of affected entity
  details: jsonb("details")
    .default(sql`'{}'`)
    .notNull(), // Additional action details
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp")
    .default(sql`now()`)
    .notNull(),
});

// Pet System Tables
export const petTypes = pgTable("pet_types", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull().unique(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  emoji: varchar("emoji").notNull(),
  iconPath: varchar("icon_path").notNull(),
  rarity: varchar("rarity", {
    enum: ["common", "uncommon", "rare", "epic", "legendary"],
  }).notNull(),
  hungerDecay: integer("hunger_decay").notNull(),
  hygieneDecay: integer("hygiene_decay").notNull(),
  energyDecay: integer("energy_decay").notNull(),
  funDecay: integer("fun_decay").notNull(),
  adoptionCost: integer("adoption_cost").notNull(),
  isCustom: boolean("is_custom").default(false).notNull(),
});

export const pets = pgTable("pets", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  petTypeId: varchar("pet_type_id").notNull(),
  name: varchar("name").notNull(),
  hunger: integer("hunger").default(100).notNull(),
  hygiene: integer("hygiene").default(100).notNull(),
  energy: integer("energy").default(100).notNull(),
  fun: integer("fun").default(100).notNull(),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  trainingPoints: integer("training_points").default(0).notNull(),
  prestigeLevel: integer("prestige_level").default(0).notNull(),
  attack: integer("attack").default(0).notNull(),
  defense: integer("defense").default(0).notNull(),
  sustainability: integer("sustainability").default(0).notNull(),
  hunting: integer("hunting").default(0).notNull(),
  skills: jsonb("skills").default([]).notNull(),
  lastFed: timestamp("last_fed"),
  lastCleaned: timestamp("last_cleaned"),
  lastPlayed: timestamp("last_played"),
  lastSlept: timestamp("last_slept"),
  roomId: varchar("room_id"),
  adoptedAt: timestamp("adopted_at")
    .default(sql`now()`)
    .notNull(),
  isSick: boolean("is_sick").default(false).notNull(),
  sicknessType: varchar("sickness_type"),
  isDead: boolean("is_dead").default(false).notNull(),
  deathReason: varchar("death_reason"),
  diedAt: timestamp("died_at"),
});

export const petRooms = pgTable("pet_rooms", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  floorStyle: varchar("floor_style").default("wooden").notNull(),
  wallStyle: varchar("wall_style").default("plain").notNull(),
  doorStyle: varchar("door_style").default("wooden").notNull(),
  windowStyle: varchar("window_style"),
  floorDecorations: jsonb("floor_decorations").default([]).notNull(),
  wallDecorations: jsonb("wall_decorations").default([]).notNull(),
  sitterId: varchar("sitter_id"),
  sitterUntil: timestamp("sitter_until"),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const petSkills = pgTable("pet_skills", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  skillId: varchar("skill_id").notNull().unique(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  effect: jsonb("effect")
    .default(sql`'{}'`)
    .notNull(),
  trainingCost: integer("training_cost").notNull(),
  category: varchar("category").notNull(),
});

export const petSitters = pgTable("pet_sitters", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  sitterId: varchar("sitter_id").notNull().unique(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  abilities: jsonb("abilities").default([]).notNull(),
  hourlyRate: integer("hourly_rate").notNull(),
  isPremiumOnly: boolean("is_premium_only").default(false).notNull(),
});

export const petBreeding = pgTable("pet_breeding", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  petId1: varchar("pet_id_1").notNull(),
  petId2: varchar("pet_id_2").notNull(),
  startedAt: timestamp("started_at")
    .default(sql`now()`)
    .notNull(),
  completesAt: timestamp("completes_at").notNull(),
  isSuccessful: boolean("is_successful"),
  offspringId: varchar("offspring_id"),
});

export const petActivities = pgTable("pet_activities", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull(),
  activityType: varchar("activity_type").notNull(),
  description: text("description").notNull(),
  rewards: jsonb("rewards")
    .default(sql`'{}'`)
    .notNull(),
  timestamp: timestamp("timestamp")
    .default(sql`now()`)
    .notNull(),
});

export const petHunts = pgTable("pet_hunts", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull(),
  startedAt: timestamp("started_at")
    .default(sql`now()`)
    .notNull(),
  completesAt: timestamp("completes_at").notNull(),
  huntType: varchar("hunt_type").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  rewards: jsonb("rewards")
    .default(sql`'{}'`)
    .notNull(),
});

export const featureFlags = pgTable("feature_flags", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  featureKey: varchar("feature_key").notNull().unique(),
  featureName: varchar("feature_name").notNull(),
  description: text("description").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
  updatedBy: varchar("updated_by"),
});

// Trading System Tables
export const tradeOffers = pgTable("trade_offers", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").notNull(),
  toUserId: varchar("to_user_id").notNull(),
  status: varchar("status", {
    enum: ["pending", "accepted", "rejected"],
  })
    .default("pending")
    .notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const trades = pgTable("trades", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId1: varchar("user_id_1").notNull(),
  userId2: varchar("user_id_2").notNull(),
  status: varchar("status", {
    enum: ["active", "completed", "cancelled"],
  })
    .default("active")
    .notNull(),
  user1Ready: boolean("user_1_ready").default(false).notNull(),
  user2Ready: boolean("user_2_ready").default(false).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});

export const tradeItems = pgTable("trade_items", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  tradeId: varchar("trade_id").notNull(),
  userId: varchar("user_id").notNull(),
  itemType: varchar("item_type", {
    enum: ["item", "pet", "collectible", "coins"],
  }).notNull(),
  itemId: varchar("item_id"),
  quantity: integer("quantity").default(1).notNull(),
  addedAt: timestamp("added_at")
    .default(sql`now()`)
    .notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  notifications: many(notifications),
  pets: many(pets),
  petRooms: many(petRooms),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.user],
    references: [users.username],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.user],
    references: [users.username],
  }),
}));

export const petTypesRelations = relations(petTypes, ({ many }) => ({
  pets: many(pets),
}));

export const petsRelations = relations(pets, ({ one, many }) => ({
  user: one(users, {
    fields: [pets.userId],
    references: [users.id],
  }),
  petType: one(petTypes, {
    fields: [pets.petTypeId],
    references: [petTypes.id],
  }),
  room: one(petRooms, {
    fields: [pets.roomId],
    references: [petRooms.id],
  }),
  activities: many(petActivities),
  hunts: many(petHunts),
  breedingAsPet1: many(petBreeding, { relationName: "pet1" }),
  breedingAsPet2: many(petBreeding, { relationName: "pet2" }),
}));

export const petRoomsRelations = relations(petRooms, ({ one, many }) => ({
  user: one(users, {
    fields: [petRooms.userId],
    references: [users.id],
  }),
  pets: many(pets),
  sitter: one(petSitters, {
    fields: [petRooms.sitterId],
    references: [petSitters.id],
  }),
}));

export const petSittersRelations = relations(petSitters, ({ many }) => ({
  rooms: many(petRooms),
}));

export const petBreedingRelations = relations(petBreeding, ({ one }) => ({
  pet1: one(pets, {
    fields: [petBreeding.petId1],
    references: [pets.id],
    relationName: "pet1",
  }),
  pet2: one(pets, {
    fields: [petBreeding.petId2],
    references: [pets.id],
    relationName: "pet2",
  }),
  offspring: one(pets, {
    fields: [petBreeding.offspringId],
    references: [pets.id],
  }),
}));

export const petActivitiesRelations = relations(petActivities, ({ one }) => ({
  pet: one(pets, {
    fields: [petActivities.petId],
    references: [pets.id],
  }),
}));

export const petHuntsRelations = relations(petHunts, ({ one }) => ({
  pet: one(pets, {
    fields: [petHunts.petId],
    references: [pets.id],
  }),
}));

export const tradeOffersRelations = relations(tradeOffers, ({ one }) => ({
  fromUser: one(users, {
    fields: [tradeOffers.fromUserId],
    references: [users.id],
  }),
  toUser: one(users, {
    fields: [tradeOffers.toUserId],
    references: [users.id],
  }),
}));

export const tradesRelations = relations(trades, ({ one, many }) => ({
  user1: one(users, {
    fields: [trades.userId1],
    references: [users.id],
    relationName: "user1Trades",
  }),
  user2: one(users, {
    fields: [trades.userId2],
    references: [users.id],
    relationName: "user2Trades",
  }),
  items: many(tradeItems),
}));

export const tradeItemsRelations = relations(tradeItems, ({ one }) => ({
  trade: one(trades, {
    fields: [tradeItems.tradeId],
    references: [trades.id],
  }),
  user: one(users, {
    fields: [tradeItems.userId],
    references: [users.id],
  }),
}));

// Create insert and select schemas from tables
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastActive: true,
});
export const selectUserSchema = createSelectSchema(users);
export const insertItemSchema = createInsertSchema(items).omit({ id: true });
export const selectItemSchema = createSelectSchema(items);
export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  timestamp: true,
});
export const selectTransactionSchema = createSelectSchema(transactions);
export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  timestamp: true,
});
export const selectNotificationSchema = createSelectSchema(notifications);
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});
export const selectAuditLogSchema = createSelectSchema(auditLogs);

// Pet schemas
export const insertPetTypeSchema = createInsertSchema(petTypes).omit({
  id: true,
});
export const selectPetTypeSchema = createSelectSchema(petTypes);
export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  adoptedAt: true,
});
export const selectPetSchema = createSelectSchema(pets);
export const insertPetRoomSchema = createInsertSchema(petRooms).omit({
  id: true,
  createdAt: true,
});
export const selectPetRoomSchema = createSelectSchema(petRooms);
export const insertPetSkillSchema = createInsertSchema(petSkills).omit({
  id: true,
});
export const selectPetSkillSchema = createSelectSchema(petSkills);
export const insertPetSitterSchema = createInsertSchema(petSitters).omit({
  id: true,
});
export const selectPetSitterSchema = createSelectSchema(petSitters);
export const insertPetBreedingSchema = createInsertSchema(petBreeding).omit({
  id: true,
  startedAt: true,
});
export const selectPetBreedingSchema = createSelectSchema(petBreeding);
export const insertPetActivitySchema = createInsertSchema(petActivities).omit({
  id: true,
  timestamp: true,
});
export const selectPetActivitySchema = createSelectSchema(petActivities);
export const insertPetHuntSchema = createInsertSchema(petHunts).omit({
  id: true,
  startedAt: true,
});
export const selectPetHuntSchema = createSelectSchema(petHunts);
export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({
  id: true,
  updatedAt: true,
});
export const selectFeatureFlagSchema = createSelectSchema(featureFlags);
export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
});
export const selectEventSchema = createSelectSchema(events);
export const insertTradeOfferSchema = createInsertSchema(tradeOffers).omit({
  id: true,
  createdAt: true,
});
export const selectTradeOfferSchema = createSelectSchema(tradeOffers);
export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectTradeSchema = createSelectSchema(trades);
export const insertTradeItemSchema = createInsertSchema(tradeItems).omit({
  id: true,
  addedAt: true,
});
export const selectTradeItemSchema = createSelectSchema(tradeItems);

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;

// Base User type from Drizzle
type BaseUser = typeof users.$inferSelect;

// Extend User type with proper JSON field types
export type User = Omit<BaseUser, 'inventory' | 'achievements' | 'gameStats' | 'friends'> & {
  inventory: any[];
  achievements: string[];
  friends: string[];
  gameStats: {
    workCount?: number;
    crimeCount?: number;
    gambleCount?: number;
    petCount?: number;
    adventureCount?: number;
    dailyCount?: number;
    maxCoins?: number;
    timesBroke?: number;
    [key: string]: any;
  };
};

export type Item = typeof items.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Event = typeof events.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// Pet type exports
export type InsertPetType = z.infer<typeof insertPetTypeSchema>;
export type PetType = typeof petTypes.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type Pet = typeof pets.$inferSelect;
export type InsertPetRoom = z.infer<typeof insertPetRoomSchema>;
export type PetRoom = typeof petRooms.$inferSelect;
export type InsertPetSkill = z.infer<typeof insertPetSkillSchema>;
export type PetSkill = typeof petSkills.$inferSelect;
export type InsertPetSitter = z.infer<typeof insertPetSitterSchema>;
export type PetSitter = typeof petSitters.$inferSelect;
export type InsertPetBreeding = z.infer<typeof insertPetBreedingSchema>;
export type PetBreeding = typeof petBreeding.$inferSelect;
export type InsertPetActivity = z.infer<typeof insertPetActivitySchema>;
export type PetActivity = typeof petActivities.$inferSelect;
export type InsertPetHunt = z.infer<typeof insertPetHuntSchema>;
export type PetHunt = typeof petHunts.$inferSelect;
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type SelectEvent = typeof events.$inferSelect;
export type InsertTradeOffer = z.infer<typeof insertTradeOfferSchema>;
export type TradeOffer = typeof tradeOffers.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;
export type InsertTradeItem = z.infer<typeof insertTradeItemSchema>;
export type TradeItem = typeof tradeItems.$inferSelect;
