import { z } from "zod";
import { pgTable, varchar, integer, boolean, timestamp, jsonb, text, serial } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


// Drizzle table definitions
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  lastActive: timestamp("last_active").default(sql`now()`).notNull(),
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
  gameStats: jsonb("game_stats").default(sql`'{}'`).notNull(),
  adminRole: varchar("admin_role", { enum: ['none', 'junior_admin', 'admin', 'senior_admin', 'lead_admin', 'owner'] }).default('none').notNull(),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  type: varchar("type", { enum: ['tool', 'collectible', 'powerup', 'consumable', 'lootbox'] }).notNull(),
  rarity: varchar("rarity", { enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'] }).notNull(),
  effects: jsonb("effects").default(sql`'{}'`).notNull(),
  stock: integer("stock").default(sql`2147483647`).notNull(), // Max int for "infinity"
  currentPrice: integer("current_price"),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user: varchar("user").notNull(),
  type: varchar("type", { enum: ['earn', 'spend', 'transfer', 'rob', 'fine', 'freemium', 'fish', 'mine', 'vote', 'adventure', 'crime', 'postmeme', 'stream', 'highlow', 'scratch'] }).notNull(),
  amount: integer("amount").notNull(),
  targetUser: varchar("target_user"),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").default(sql`now()`).notNull(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  user: varchar("user").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { enum: ['trade', 'friend', 'event', 'system', 'rob'] }).notNull(),
  read: boolean("read").default(false).notNull(),
  timestamp: timestamp("timestamp").default(sql`now()`).notNull(),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  multipliers: jsonb("multipliers").default(sql`'{}'`).notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").default(sql`now()`).notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminUsername: varchar("admin_username").notNull(),
  adminRole: varchar("admin_role").notNull(),
  action: varchar("action").notNull(), // e.g., "ban_user", "give_coins", "create_item"
  targetType: varchar("target_type"), // e.g., "user", "item", "system"
  targetId: varchar("target_id"), // ID of the affected entity
  targetName: varchar("target_name"), // Name/username of affected entity
  details: jsonb("details").default(sql`'{}'`).notNull(), // Additional action details
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").default(sql`now()`).notNull(),
});

export const userPets = pgTable("user_pets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  petId: varchar("pet_id").notNull(),
  petName: varchar("pet_name").notNull(),
  hunger: integer("hunger").default(100).notNull(), // 0-100
  hygiene: integer("hygiene").default(100).notNull(), // 0-100
  energy: integer("energy").default(100).notNull(), // 0-100
  fun: integer("fun").default(100).notNull(), // 0-100
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  lastFed: timestamp("last_fed").default(sql`now()`).notNull(),
  lastCleaned: timestamp("last_cleaned").default(sql`now()`).notNull(),
  lastPlayed: timestamp("last_played").default(sql`now()`).notNull(),
  lastSlept: timestamp("last_slept").default(sql`now()`).notNull(),
  adoptedAt: timestamp("adopted_at").default(sql`now()`).notNull(),
  // New Pets 2.0 fields
  roomId: varchar("room_id"), // null = in stasis
  inStasis: boolean("in_stasis").default(false).notNull(),
  thawingUntil: timestamp("thawing_until"), // 6 hour thawing when removed from stasis
  skills: jsonb("skills").default([]).notNull(), // Array of skill IDs
  isCurrentPet: boolean("is_current_pet").default(false).notNull(),
  isSick: boolean("is_sick").default(false).notNull(),
  sicknessType: varchar("sickness_type"), // type of sickness if any
  huntingUntil: timestamp("hunting_until"), // when pet returns from hunting
  huntLevel: integer("hunt_level").default(1).notNull(),
  breedingPartnerId: varchar("breeding_partner_id"), // ID of partner pet
  breedingUntil: timestamp("breeding_until"), // when breeding attempt completes
  skin: varchar("skin").default("default").notNull(), // cosmetic skin
  friendlyTo: jsonb("friendly_to").default([]).notNull(), // Array of pet IDs they're friendly to
  hostileTo: jsonb("hostile_to").default([]).notNull(), // Array of pet IDs they're hostile to
});

export const petRooms = pgTable("pet_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: varchar("name").notNull(),
  floorStyle: varchar("floor_style").default("wooden").notNull(),
  wallStyle: varchar("wall_style").default("plain").notNull(),
  doorStyle: varchar("door_style").default("wooden").notNull(),
  windowStyle: varchar("window_style").default("basic").notNull(),
  floorDecorations: jsonb("floor_decorations").default([]).notNull(), // Array of decoration objects
  wallDecorations: jsonb("wall_decorations").default([]).notNull(), // Array of decoration objects
  sitterId: varchar("sitter_id"), // Active pet sitter
  sitterUntil: timestamp("sitter_until"), // When sitter contract expires
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const petSitters = pgTable("pet_sitters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  abilities: jsonb("abilities").default([]).notNull(), // Array of ability descriptions
  hourlyRate: integer("hourly_rate").notNull(), // Coins per hour
  isPremiumOnly: boolean("is_premium_only").default(false).notNull(),
});

export const petActivities = pgTable("pet_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull(),
  activityType: varchar("activity_type").notNull(), // 'fed', 'cleaned', 'played', 'slept', 'bred', 'hunted', 'fought', 'got_sick', 'cured'
  description: text("description").notNull(),
  rewards: jsonb("rewards").default([]).notNull(), // Array of reward objects
  timestamp: timestamp("timestamp").default(sql`now()`).notNull(),
});

export const petSkills = pgTable("pet_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  effect: jsonb("effect").default(sql`'{}'`).notNull(), // Skill effect data
  trainingCost: integer("training_cost").notNull(), // Cost to train this skill
  category: varchar("category").notNull(), // 'combat', 'care', 'breeding', 'earning'
});

export const petHunts = pgTable("pet_hunts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull(),
  startedAt: timestamp("started_at").default(sql`now()`).notNull(),
  completesAt: timestamp("completes_at").notNull(),
  huntType: varchar("hunt_type").notNull(), // 'basic', 'rare', 'special'
  isCompleted: boolean("is_completed").default(false).notNull(),
  rewards: jsonb("rewards").default([]).notNull(), // Rewards found during hunt
});

export const petBreeding = pgTable("pet_breeding", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petId1: varchar("pet_id_1").notNull(),
  petId2: varchar("pet_id_2").notNull(),
  startedAt: timestamp("started_at").default(sql`now()`).notNull(),
  completesAt: timestamp("completes_at").notNull(),
  isSuccessful: boolean("is_successful"),
  offspring: jsonb("offspring").default([]).notNull(), // Array of offspring data
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  notifications: many(notifications),
  pets: many(userPets),
  petRooms: many(petRooms),
}));

export const userPetsRelations = relations(userPets, ({ one, many }) => ({
  user: one(users, {
    fields: [userPets.userId],
    references: [users.id],
  }),
  room: one(petRooms, {
    fields: [userPets.roomId],
    references: [petRooms.id],
  }),
  activities: many(petActivities),
  hunts: many(petHunts),
}));

export const petRoomsRelations = relations(petRooms, ({ one, many }) => ({
  user: one(users, {
    fields: [petRooms.userId],
    references: [users.id],
  }),
  pets: many(userPets),
  sitter: one(petSitters, {
    fields: [petRooms.sitterId],
    references: [petSitters.id],
  }),
}));

export const petSittersRelations = relations(petSitters, ({ many }) => ({
  rooms: many(petRooms),
}));

export const petActivitiesRelations = relations(petActivities, ({ one }) => ({
  pet: one(userPets, {
    fields: [petActivities.petId],
    references: [userPets.id],
  }),
}));

export const petHuntsRelations = relations(petHunts, ({ one }) => ({
  pet: one(userPets, {
    fields: [petHunts.petId],
    references: [userPets.id],
  }),
}));

export const petBreedingRelations = relations(petBreeding, ({ one }) => ({
  pet1: one(userPets, {
    fields: [petBreeding.petId1],
    references: [userPets.id],
  }),
  pet2: one(userPets, {
    fields: [petBreeding.petId2],
    references: [userPets.id],
  }),
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

// Create insert and select schemas from tables
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastActive: true });
export const selectUserSchema = createSelectSchema(users);
export const insertItemSchema = createInsertSchema(items).omit({ id: true });
export const selectItemSchema = createSelectSchema(items);
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, timestamp: true });
export const selectTransactionSchema = createSelectSchema(transactions);
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, timestamp: true });
export const selectNotificationSchema = createSelectSchema(notifications);
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, timestamp: true });
export const selectAuditLogSchema = createSelectSchema(auditLogs);
export const insertUserPetSchema = createInsertSchema(userPets).omit({ id: true, adoptedAt: true });
export const selectUserPetSchema = createSelectSchema(userPets);
export const insertPetRoomSchema = createInsertSchema(petRooms).omit({ id: true, createdAt: true });
export const selectPetRoomSchema = createSelectSchema(petRooms);
export const insertPetSitterSchema = createInsertSchema(petSitters).omit({ id: true });
export const selectPetSitterSchema = createSelectSchema(petSitters);
export const insertPetActivitySchema = createInsertSchema(petActivities).omit({ id: true, timestamp: true });
export const selectPetActivitySchema = createSelectSchema(petActivities);
export const insertPetSkillSchema = createInsertSchema(petSkills).omit({ id: true });
export const selectPetSkillSchema = createSelectSchema(petSkills);
export const insertPetHuntSchema = createInsertSchema(petHunts).omit({ id: true, startedAt: true });
export const selectPetHuntSchema = createSelectSchema(petHunts);
export const insertPetBreedingSchema = createInsertSchema(petBreeding).omit({ id: true, startedAt: true });
export const selectPetBreedingSchema = createSelectSchema(petBreeding);

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Event = typeof events.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertUserPet = z.infer<typeof insertUserPetSchema>;
export type UserPet = typeof userPets.$inferSelect;
export type InsertPetRoom = z.infer<typeof insertPetRoomSchema>;
export type PetRoom = typeof petRooms.$inferSelect;
export type InsertPetSitter = z.infer<typeof insertPetSitterSchema>;
export type PetSitter = typeof petSitters.$inferSelect;
export type InsertPetActivity = z.infer<typeof insertPetActivitySchema>;
export type PetActivity = typeof petActivities.$inferSelect;
export type InsertPetSkill = z.infer<typeof insertPetSkillSchema>;
export type PetSkill = typeof petSkills.$inferSelect;
export type InsertPetHunt = z.infer<typeof insertPetHuntSchema>;
export type PetHunt = typeof petHunts.$inferSelect;
export type InsertPetBreeding = z.infer<typeof insertPetBreedingSchema>;
export type PetBreeding = typeof petBreeding.$inferSelect;
