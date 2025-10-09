import {
  users,
  items,
  transactions,
  notifications,
  chatMessages,
  auditLogs,
  pets,
  petTypes,
  petRooms,
  petSkills,
  petSitters,
  petBreeding,
  petHunts,
  petActivities,
  featureFlags,
  events,
  tradeOffers,
  trades,
  tradeItems,
  type User,
  type InsertUser,
  type Item,
  type Transaction,
  type Notification,
  type ChatMessage,
  type AuditLog,
  type InsertAuditLog,
  type Pet,
  type InsertPet,
  type PetType,
  type InsertPetType,
  type PetRoom,
  type InsertPetRoom,
  type PetSkill,
  type PetSitter,
  type PetBreeding,
  type InsertPetBreeding,
  type PetHunt,
  type InsertPetHunt,
  type PetActivity,
  type InsertPetActivity,
  type FeatureFlag,
  type InsertEvent,
  type SelectEvent,
  type TradeOffer,
  type Trade,
  type TradeItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, isNull, lt, gte, sql } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser & { passwordHash: string }): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Items
  getItem(id: string): Promise<Item | undefined>;
  getAllItems(): Promise<Item[]>;
  createItem(item: Omit<Item, "id">): Promise<Item>;
  updateItem(id: string, updates: Partial<Item>): Promise<Item>;
  deleteItem(id: string): Promise<void>;

  // Transactions
  createTransaction(
    transaction: Omit<Transaction, "id" | "timestamp"> & { timestamp?: Date },
  ): Promise<Transaction>;
  getUserTransactions(username: string, limit?: number): Promise<Transaction[]>;

  // Notifications
  createNotification(
    notification: Omit<Notification, "id" | "timestamp"> & { timestamp?: Date },
  ): Promise<Notification>;
  getUserNotifications(username: string): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
  deleteNotification(id: string, username: string): Promise<void>;
  clearAllNotifications(username: string): Promise<void>;

  // Chat Messages
  createChatMessage(
    message: Omit<ChatMessage, "id" | "timestamp">,
  ): Promise<ChatMessage>;
  deleteChatMessage(id: string): Promise<void>;
  getRecentChatMessages(limit?: number): Promise<ChatMessage[]>;

  // Leaderboard
  getLeaderboard(
    limit?: number,
  ): Promise<Array<{ username: string; coins: number; level: number }>>;

  // Audit Logs
  createAuditLog(
    log: Omit<AuditLog, "id" | "timestamp"> & { timestamp?: Date },
  ): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;
  getAuditLogsByAdmin(
    adminUsername: string,
    limit?: number,
  ): Promise<AuditLog[]>;
  getAuditLogsByAction(action: string, limit?: number): Promise<AuditLog[]>;

  // Pet Management
  adoptPet(
    userId: string,
    petTypeId: string,
    customName?: string,
  ): Promise<Pet>;
  adoptPetWithPayment(
    username: string,
    petTypeId: string,
    customName?: string,
  ): Promise<{ pet: Pet; newBalance: number; transaction: Transaction }>;
  getUserPets(userId: string): Promise<Pet[]>;
  getAllPets(): Promise<Pet[]>;
  getPet(petId: string): Promise<Pet | undefined>;
  updatePet(petId: string, updates: Partial<Pet>): Promise<Pet>;
  deletePet(petId: string): Promise<void>;

  // Pet Care
  feedPet(petId: string): Promise<Pet>;
  cleanPet(petId: string): Promise<Pet>;
  playWithPet(petId: string): Promise<Pet>;
  restPet(petId: string): Promise<Pet>;
  calculateStatDecay(pet: Pet, petType: PetType): Pet;

  // Pet Training
  trainPetStat(
    petId: string,
    stat: "attack" | "defense" | "sustainability" | "hunting",
    points: number,
  ): Promise<Pet>;
  addPetXP(petId: string, xp: number): Promise<Pet>;
  prestigePet(petId: string): Promise<Pet>;
  learnSkill(petId: string, skillId: string): Promise<Pet>;

  // Pet Rooms
  createPetRoom(userId: string, name: string): Promise<PetRoom>;
  getUserPetRooms(userId: string): Promise<PetRoom[]>;
  updatePetRoom(roomId: string, updates: Partial<PetRoom>): Promise<PetRoom>;
  deletePetRoom(roomId: string): Promise<void>;
  assignPetToRoom(petId: string, roomId: string): Promise<Pet>;
  hireSitter(roomId: string, sitterId: string, hours: number): Promise<PetRoom>;

  // Pet Types/Skills/Sitters
  getAllPetTypes(): Promise<PetType[]>;
  getAllPetSkills(): Promise<PetSkill[]>;
  getAllPetSitters(): Promise<PetSitter[]>;
  createCustomPetType(data: InsertPetType): Promise<PetType>;

  // Pet Breeding
  startBreeding(petId1: string, petId2: string): Promise<PetBreeding>;
  completeBreeding(breedingId: string): Promise<Pet>;
  getActiveBreedings(userId: string): Promise<PetBreeding[]>;

  // Pet Hunting
  startHunt(petId: string, huntType: string): Promise<PetHunt>;
  completeHunt(huntId: string): Promise<{ rewards: any; hunt: PetHunt }>;
  getActiveHunts(userId: string): Promise<PetHunt[]>;

  // Pet Activities
  logPetActivity(
    petId: string,
    activityType: string,
    description: string,
    rewards?: any,
  ): Promise<PetActivity>;
  getPetActivities(petId: string, limit?: number): Promise<PetActivity[]>;

  // Feature Flags
  getAllFeatureFlags(): Promise<FeatureFlag[]>;
  getFeatureFlag(featureKey: string): Promise<FeatureFlag | undefined>;
  isFeatureEnabled(featureKey: string): Promise<boolean>;
  updateFeatureFlag(
    featureKey: string,
    enabled: boolean,
    updatedBy: string,
  ): Promise<FeatureFlag>;
  initializeFeatureFlags(): Promise<void>;

  // Events
  getAllEvents(): Promise<SelectEvent[]>;
  getActiveEvents(): Promise<SelectEvent[]>;
  getEvent(id: string): Promise<SelectEvent | undefined>;
  createEvent(event: InsertEvent): Promise<SelectEvent>;
  updateEvent(id: string, updates: Partial<SelectEvent>): Promise<SelectEvent>;
  deleteEvent(id: string): Promise<void>;
  activateEvent(id: string): Promise<SelectEvent>;
  deactivateEvent(id: string): Promise<SelectEvent>;

  // Trading System
  createTradeOffer(fromUserId: string, toUserId: string): Promise<any>;
  getTradeOffers(userId: string): Promise<any[]>;
  acceptTradeOffer(offerId: string): Promise<any>;
  rejectTradeOffer(offerId: string): Promise<void>;
  createTrade(userId1: string, userId2: string): Promise<any>;
  getTrade(tradeId: string): Promise<any | undefined>;
  getActiveTrade(userId1: string, userId2: string): Promise<any | undefined>;
  addTradeItem(
    tradeId: string,
    userId: string,
    itemType: "item" | "pet" | "collectible" | "coins",
    itemId: string | null,
    quantity: number,
  ): Promise<any>;
  removeTradeItem(tradeItemId: string): Promise<void>;
  getTradeItems(tradeId: string): Promise<any[]>;
  markTradeReady(tradeId: string, userId: string): Promise<any>;
  executeTrade(tradeId: string): Promise<{ success: boolean; message: string }>;
  cancelTrade(tradeId: string): Promise<void>;

  // System
  initializeData(): Promise<void>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    // Use MemoryStore with long TTL for persistent sessions across restarts
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
      ttl: 2592000000, // 30 days (matching cookie maxAge)
      stale: false,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return (user as User) || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (user) {
      // Ensure inventory is always an array
      if (!Array.isArray(user.inventory)) {
        user.inventory = [];
      }
      // Ensure achievements is always an array
      if (!Array.isArray(user.achievements)) {
        user.achievements = [];
      }
    }

    return (user as User) || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers as User[];
  }

  async createUser(
    userData: InsertUser & { passwordHash: string },
  ): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        username: userData.username,
        passwordHash: userData.passwordHash,
      })
      .returning();
    return user as User;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser as User;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getItem(id: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async getAllItems(): Promise<Item[]> {
    return await db.select().from(items);
  }

  async createItem(itemData: Omit<Item, "id">): Promise<Item> {
    const [item] = await db.insert(items).values(itemData).returning();
    return item;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    const [updatedItem] = await db
      .update(items)
      .set(updates)
      .where(eq(items.id, id))
      .returning();

    if (!updatedItem) {
      throw new Error("Item not found");
    }

    return updatedItem;
  }

  async deleteItem(id: string): Promise<void> {
    await db.delete(items).where(eq(items.id, id));
  }

  async createTransaction(
    transactionData: Omit<Transaction, "id" | "timestamp"> & {
      timestamp?: Date;
    },
  ): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values({
        ...transactionData,
        timestamp: transactionData.timestamp || new Date(),
      })
      .returning();
    return transaction;
  }

  async getUserTransactions(
    username: string,
    limit = 20,
  ): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.user, username))
      .orderBy(desc(transactions.timestamp))
      .limit(limit);
  }

  async createNotification(
    notificationData: Omit<Notification, "id" | "timestamp"> & {
      timestamp?: Date;
    },
  ): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values({
        ...notificationData,
        timestamp: notificationData.timestamp || new Date(),
      })
      .returning();
    return notification;
  }

  async getUserNotifications(username: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.user, username))
      .orderBy(desc(notifications.timestamp))
      .limit(50);
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));
  }

  async deleteNotification(id: string, username: string): Promise<void> {
    await db
      .delete(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.user, username)));
  }

  async clearAllNotifications(username: string): Promise<void> {
    await db.delete(notifications).where(eq(notifications.user, username));
  }

  async getLeaderboard(
    limit = 20,
  ): Promise<Array<{ username: string; coins: number; level: number }>> {
    const usersData = await db
      .select({
        username: users.username,
        coins: users.coins,
        bank: users.bank,
        level: users.level,
      })
      .from(users)
      .where(eq(users.banned, false))
      .limit(limit * 2); // Get more in case we need to filter

    return usersData
      .map((user) => ({
        username: user.username,
        coins: user.coins + user.bank, // Net worth
        level: user.level,
      }))
      .sort((a, b) => b.coins - a.coins)
      .slice(0, limit);
  }

  // Chat message methods
  async createChatMessage(
    message: Omit<ChatMessage, "id" | "timestamp">,
  ): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values({
        username: message.username,
        message: message.message,
      })
      .returning();
    return chatMessage;
  }

  async deleteChatMessage(id: string): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.id, id));
  }

  async getRecentChatMessages(limit = 50): Promise<ChatMessage[]> {
    const messages = await db
      .select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
    return messages.reverse(); // Return in chronological order
  }

  async initializeData(): Promise<void> {
    // Initialize trade storage
    const tradeOffers = await db.get("trade_offers");
    if (!tradeOffers) {
      await db.set("trade_offers", []);
    }

    const trades = await db.get("trades");
    if (!trades) {
      await db.set("trades", []);
    }

    const tradeItems = await db.get("trade_items");
    if (!tradeItems) {
      await db.set("trade_items", []);
    }

    // Get existing items to check what's already in the database
    const existingItems = await this.getAllItems();
    const existingItemNames = new Set(existingItems.map((item) => item.name));

    // Create sample items
    const sampleItems = [
      // Tools (Equipment that provides passive benefits)
      {
        name: "Shovel",
        description:
          "A sturdy shovel for digging. Required to dig for treasure!",
        price: 500,
        type: "tool" as const,
        rarity: "common" as const,
        effects: {},
        stock: 2147483647,
        currentPrice: 500,
      },
      {
        name: "Fishing Rod",
        description: "A reliable fishing rod. Required to catch fish!",
        price: 750,
        type: "tool" as const,
        rarity: "common" as const,
        effects: {},
        stock: 2147483647,
        currentPrice: 750,
      },
      {
        name: "Hunting Rifle",
        description: "A powerful hunting rifle. Required to hunt animals!",
        price: 1200,
        type: "tool" as const,
        rarity: "uncommon" as const,
        effects: {},
        stock: 2147483647,
        currentPrice: 1200,
      },
      {
        name: "Laptop",
        description: "Work from home! Passive +100 coins/hour",
        price: 15000,
        type: "tool" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 100 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 2147483647,
        currentPrice: 15000,
      },
      {
        name: "Golden Pickaxe",
        description: "Epic mining tool! Passive +200 coins/hour, +10% luck",
        price: 50000,
        type: "tool" as const,
        rarity: "epic" as const,
        effects: {
          passive: { winRateBoost: 10, coinsPerHour: 200 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 2147483647,
        currentPrice: 50000,
      },

      // Collectibles (Rare items for prestige and trading)
      {
        name: "Rare Pepe",
        description: "Legendary collectible meme",
        price: 25000,
        type: "collectible" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 100,
        currentPrice: 25000,
      },
      {
        name: "Dank Crown",
        description: "Show off your wealth! Ultimate status symbol",
        price: 1000000,
        type: "collectible" as const,
        rarity: "legendary" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 1,
        currentPrice: 1000000,
      },
      {
        name: "Meme Trophy",
        description: "Award for exceptional meme quality",
        price: 75000,
        type: "collectible" as const,
        rarity: "epic" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 25,
        currentPrice: 75000,
      },
      {
        name: "Shiny Rock",
        description: "It's shiny... and it's a rock",
        price: 5000,
        type: "collectible" as const,
        rarity: "common" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 500,
        currentPrice: 5000,
      },

      // Consumables (One-time use items with temporary effects)
      {
        name: "Luck Potion",
        description: "Increases win rate for 1 hour",
        price: 2500,
        type: "consumable" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: {
            useCooldown: 3600000,
            duration: 3600000,
            effect: "luck_boost",
          },
        },
        stock: 25,
        currentPrice: 2500,
      },
      {
        name: "Energy Drink",
        description: "Skip all cooldowns for 30 minutes",
        price: 5000,
        type: "consumable" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: {
            useCooldown: 1800000,
            duration: 1800000,
            effect: "no_cooldowns",
          },
        },
        stock: 25,
        currentPrice: 5000,
      },
      {
        name: "Coin Multiplier",
        description: "2x coin earnings for 2 hours",
        price: 10000,
        type: "consumable" as const,
        rarity: "epic" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: {
            useCooldown: 7200000,
            duration: 7200000,
            effect: "coin_multiplier",
          },
        },
        stock: 10,
        currentPrice: 10000,
      },
      {
        name: "XP Booster",
        description: "Double XP gains for 1 hour",
        price: 3000,
        type: "consumable" as const,
        rarity: "uncommon" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: {
            useCooldown: 3600000,
            duration: 3600000,
            effect: "xp_boost",
          },
        },
        stock: 30,
        currentPrice: 3000,
      },

      // Loot Boxes (Mystery containers with random rewards)
      {
        name: "Dank Box",
        description: "Contains 2-5 random items!",
        price: 10000,
        type: "lootbox" as const,
        rarity: "epic" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "lootbox" },
        },
        stock: 20,
        currentPrice: 10000,
      },
      {
        name: "Starter Pack",
        description: "Perfect for new players! Contains basic items",
        price: 2500,
        type: "lootbox" as const,
        rarity: "common" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "starter_lootbox" },
        },
        stock: 100,
        currentPrice: 2500,
      },
      {
        name: "Legendary Chest",
        description: "Ultra rare items await! 1% chance legendary",
        price: 50000,
        type: "lootbox" as const,
        rarity: "legendary" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "legendary_lootbox" },
        },
        stock: 5,
        currentPrice: 50000,
      },
      {
        name: "Mystery Bundle",
        description: "Could contain anything... even a boat!",
        price: 7500,
        type: "lootbox" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "mystery_lootbox" },
        },
        stock: 40,
        currentPrice: 7500,
      },

      // Additional Items from dankmemer.lol/items

      // Adventure & Exploration Items
      {
        name: "Adventure Ticket",
        description: "Grants access to special adventure areas",
        price: 15000,
        type: "consumable" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: {
            useCooldown: 7200000,
            duration: 0,
            effect: "adventure_access",
          },
        },
        stock: 50,
        currentPrice: 15000,
      },
      {
        name: "A Plus",
        description: "Epic sellable item with great value",
        price: 200000,
        type: "collectible" as const,
        rarity: "epic" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 10,
        currentPrice: 200000,
      },
      {
        name: "Australia Ticket",
        description: "Travel to Australia for unique adventures",
        price: 25000,
        type: "consumable" as const,
        rarity: "epic" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: {
            useCooldown: 86400000,
            duration: 0,
            effect: "australia_access",
          },
        },
        stock: 25,
        currentPrice: 25000,
      },

      // Food & Consumables
      {
        name: "Apple",
        description: "A fresh, healthy apple",
        price: 150,
        type: "consumable" as const,
        rarity: "common" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: {
            useCooldown: 300000,
            duration: 600000,
            effect: "health_boost",
          },
        },
        stock: 1000,
        currentPrice: 150,
      },
      {
        name: "Bean",
        description: "Just a simple bean... or is it?",
        price: 50,
        type: "collectible" as const,
        rarity: "common" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 2000,
        currentPrice: 50,
      },
      {
        name: "Alcohol",
        description: "Makes you feel dizzy but boosts gambling luck",
        price: 2000,
        type: "consumable" as const,
        rarity: "uncommon" as const,
        effects: {
          passive: { winRateBoost: 0.2, coinsPerHour: 0 },
          active: {
            useCooldown: 3600000,
            duration: 1800000,
            effect: "gambling_boost",
          },
        },
        stock: 200,
        currentPrice: 2000,
      },
      {
        name: "Berries and Cream",
        description: "Delicious treat that provides temporary protection",
        price: 1500,
        type: "consumable" as const,
        rarity: "uncommon" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: {
            useCooldown: 1800000,
            duration: 3600000,
            effect: "protection",
          },
        },
        stock: 100,
        currentPrice: 1500,
      },

      // Tools & Equipment
      {
        name: "Ammo",
        description: "Essential ammunition for hunting adventures",
        price: 500,
        type: "consumable" as const,
        rarity: "common" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "hunting_ammo" },
        },
        stock: 500,
        currentPrice: 500,
      },
      {
        name: "Ban Hammer",
        description: "Legendary moderation tool",
        price: 500000,
        type: "tool" as const,
        rarity: "legendary" as const,
        effects: {
          passive: { winRateBoost: 25, coinsPerHour: 500 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 1,
        currentPrice: 500000,
      },
      {
        name: "Laptop",
        description: "Allows remote work for passive income",
        price: 15000,
        type: "tool" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 100 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 100,
        currentPrice: 15000,
      },

      // Collectibles & Rare Items
      {
        name: "Alien Sample",
        description: "Mysterious extraterrestrial material",
        price: 75000,
        type: "collectible" as const,
        rarity: "epic" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 25,
        currentPrice: 75000,
      },
      {
        name: "Ant",
        description: "Tiny but mighty insect",
        price: 100,
        type: "collectible" as const,
        rarity: "common" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 1000,
        currentPrice: 100,
      },
      {
        name: "Big Brain",
        description: "Intelligence enhancement device",
        price: 50000,
        type: "tool" as const,
        rarity: "epic" as const,
        effects: {
          passive: { winRateBoost: 15, coinsPerHour: 150 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 50,
        currentPrice: 50000,
      },
      {
        name: "Director's Card",
        description: "VIP access card for exclusive areas",
        price: 100000,
        type: "collectible" as const,
        rarity: "legendary" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 5,
        currentPrice: 100000,
      },

      // Protection & Security Items
      {
        name: "Anti-Rob Pack",
        description: "Protects your coins from theft",
        price: 10000,
        type: "consumable" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: {
            useCooldown: 86400000,
            duration: 86400000,
            effect: "rob_protection",
          },
        },
        stock: 75,
        currentPrice: 10000,
      },

      // Special Items & Utilities
      {
        name: "Bank Note",
        description: "Increases bank storage capacity",
        price: 25000,
        type: "tool" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "bank_expansion" },
        },
        stock: 100,
        currentPrice: 25000,
      },
      {
        name: "Beaker of the Raid",
        description: "Mysterious liquid with unknown properties",
        price: 150000,
        type: "collectible" as const,
        rarity: "legendary" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 3,
        currentPrice: 150000,
      },
      {
        name: "Bean Mp3 Player",
        description: "Plays your favorite bean sounds",
        price: 5000,
        type: "collectible" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 150,
        currentPrice: 5000,
      },
      {
        name: "Beggar's Bowl",
        description: "Increases earnings from begging",
        price: 1000,
        type: "tool" as const,
        rarity: "common" as const,
        effects: {
          passive: { winRateBoost: 5, coinsPerHour: 25 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 300,
        currentPrice: 1000,
      },

      // Clothing & Accessories
      {
        name: "Apron",
        description: "Cooking apron that improves work efficiency",
        price: 3000,
        type: "tool" as const,
        rarity: "uncommon" as const,
        effects: {
          passive: { winRateBoost: 3, coinsPerHour: 40 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 200,
        currentPrice: 3000,
      },

      // Mystery & Chaos Items
      {
        name: "Barrel of Sludge",
        description: "Contains mysterious toxic waste",
        price: 20000,
        type: "collectible" as const,
        rarity: "epic" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 30,
        currentPrice: 20000,
      },
      {
        name: "Bat Box",
        description: "Home for friendly neighborhood bats",
        price: 8000,
        type: "collectible" as const,
        rarity: "uncommon" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 100,
        currentPrice: 8000,
      },

      // Special Event Items
      {
        name: "Ahexy's Power",
        description: "Mysterious power artifact from Ahexy",
        price: 125000,
        type: "collectible" as const,
        rarity: "legendary" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 5,
        currentPrice: 125000,
      },
      {
        name: "Aid's Pickle Paint",
        description: "Special paint made from pickles",
        price: 15000,
        type: "collectible" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 75,
        currentPrice: 15000,
      },

      // More Tools
      {
        name: "Trinket",
        description: "Small lucky charm that brings fortune",
        price: 2500,
        type: "tool" as const,
        rarity: "uncommon" as const,
        effects: {
          passive: { winRateBoost: 7, coinsPerHour: 30 },
          active: { useCooldown: 0, duration: 0, effect: "" },
        },
        stock: 250,
        currentPrice: 2500,
      },
      {
        name: "Lucky Charm",
        description: "Permanent +20% win rate boost",
        price: 5000,
        type: "equipment" as const,
        rarity: "epic" as const,
        effects: {
          passive: { winRateBoost: 0.2, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "none" },
        },
        stock: 10,
        currentPrice: 5000,
      },
      {
        name: "Four Leaf Clover",
        description: "Permanent +20% win rate boost",
        price: 3000,
        type: "equipment" as const,
        rarity: "rare" as const,
        effects: {
          passive: { winRateBoost: 0.2, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "none" },
        },
        stock: 20,
        currentPrice: 3000,
      },
    ];

    // Upsert items - add new ones and update existing ones to ensure consistency
    let addedCount = 0;
    let updatedCount = 0;

    for (const itemData of sampleItems) {
      if (!existingItemNames.has(itemData.name)) {
        // Item doesn't exist, create it
        await this.createItem(itemData);
        addedCount++;
      } else {
        // Item exists, update it to ensure consistency across environments
        const existingItem = existingItems.find(
          (item) => item.name === itemData.name,
        );
        if (existingItem) {
          await this.updateItem(existingItem.id, itemData);
          updatedCount++;
        }
      }
    }

    // Database initialization completed silently

    // Ensure critical users have owners badge and owner admin role
    const criticalUsers = ["tacoking15", "urmomsfav", "savage"];
    for (const username of criticalUsers) {
      const user = await this.getUserByUsername(username);
      if (user) {
        let needsUpdate = false;
        const updateData: any = {};

        // Grant owners badge
        const achievements = Array.isArray(user.achievements)
          ? user.achievements
          : [];
        if (!achievements.includes("owners")) {
          achievements.push("owners");
          updateData.achievements = achievements;
          needsUpdate = true;
        }

        // Grant owner admin role
        if (user.adminRole !== "owner") {
          updateData.adminRole = "owner";
          needsUpdate = true;
        }

        if (needsUpdate) {
          await this.updateUser(user.id, updateData);
          // Granted owners badge and owner role
        }
      }
    }
  }

  // Audit Log Methods
  async createAuditLog(
    logData: Omit<AuditLog, "id" | "timestamp"> & { timestamp?: Date },
  ): Promise<AuditLog> {
    const [auditLog] = await db
      .insert(auditLogs)
      .values({
        adminUsername: logData.adminUsername,
        adminRole: logData.adminRole,
        action: logData.action,
        targetType: logData.targetType,
        targetId: logData.targetId,
        targetName: logData.targetName,
        details: logData.details,
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
        timestamp: logData.timestamp || new Date(),
      })
      .returning();
    return auditLog;
  }

  async getAuditLogs(limit = 100): Promise<AuditLog[]> {
    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.timestamp))
      .limit(limit);
    return logs;
  }

  async getAuditLogsByAdmin(
    adminUsername: string,
    limit = 100,
  ): Promise<AuditLog[]> {
    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.adminUsername, adminUsername))
      .orderBy(desc(auditLogs.timestamp))
      .limit(limit);
    return logs;
  }

  async getAuditLogsByAction(action: string, limit = 100): Promise<AuditLog[]> {
    const logs = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.action, action))
      .orderBy(desc(auditLogs.timestamp))
      .limit(limit);
    return logs;
  }

  async adoptPet(
    userId: string,
    petTypeId: string,
    customName?: string,
  ): Promise<Pet> {
    const [petType] = await db
      .select()
      .from(petTypes)
      .where(eq(petTypes.petId, petTypeId));
    if (!petType) {
      throw new Error("Pet type not found");
    }

    const name = customName || petType.name;
    const [pet] = await db
      .insert(pets)
      .values({
        userId,
        petTypeId: petType.id,
        name,
      })
      .returning();
    return pet;
  }

  async adoptPetWithPayment(
    username: string,
    petTypeId: string,
    customName?: string,
  ): Promise<{ pet: Pet; newBalance: number; transaction: Transaction }> {
    return await db.transaction(async (tx) => {
      const [petType] = await tx
        .select()
        .from(petTypes)
        .where(eq(petTypes.petId, petTypeId));

      if (!petType) {
        throw new Error("Pet type not found");
      }

      if (!Number.isFinite(petType.adoptionCost) || petType.adoptionCost < 0) {
        throw new Error("Invalid pet adoption cost");
      }

      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.username, username));

      if (!user) {
        throw new Error("User not found");
      }

      const updatedUsers = await tx
        .update(users)
        .set({ coins: sql`${users.coins} - ${petType.adoptionCost}` })
        .where(
          and(
            eq(users.id, user.id),
            gte(users.coins, petType.adoptionCost)
          )
        )
        .returning();

      if (updatedUsers.length === 0) {
        throw new Error(
          `Insufficient coins. You need ${petType.adoptionCost} coins to adopt this pet.`
        );
      }

      const updatedUser = updatedUsers[0];

      const name = customName || petType.name;
      const [pet] = await tx
        .insert(pets)
        .values({
          userId: user.id,
          petTypeId: petType.id,
          name,
        })
        .returning();

      const [transactionRecord] = await tx
        .insert(transactions)
        .values({
          user: username,
          type: "spend",
          amount: petType.adoptionCost,
          description: `Adopted ${petType.name} for ${petType.adoptionCost} coins`,
          targetUser: null,
          timestamp: new Date(),
        })
        .returning();

      return {
        pet,
        newBalance: updatedUser.coins,
        transaction: transactionRecord,
      };
    });
  }

  async getUserPets(userId: string): Promise<Pet[]> {
    return await db.select().from(pets).where(eq(pets.userId, userId));
  }

  async getAllPets(): Promise<Pet[]> {
    return await db.select().from(pets);
  }

  async getPet(petId: string): Promise<Pet | undefined> {
    const [pet] = await db.select().from(pets).where(eq(pets.id, petId));
    return pet || undefined;
  }

  async updatePet(petId: string, updates: Partial<Pet>): Promise<Pet> {
    const [updatedPet] = await db
      .update(pets)
      .set(updates)
      .where(eq(pets.id, petId))
      .returning();

    if (!updatedPet) {
      throw new Error("Pet not found");
    }

    return updatedPet;
  }

  async deletePet(petId: string): Promise<void> {
    await db.delete(pets).where(eq(pets.id, petId));
  }

  calculateStatDecay(pet: Pet, petType: PetType): Pet {
    const now = new Date();
    const timeSinceLastFed = pet.lastFed
      ? (now.getTime() - pet.lastFed.getTime()) / 1000 / 60 / 60
      : 0;
    const timeSinceLastCleaned = pet.lastCleaned
      ? (now.getTime() - pet.lastCleaned.getTime()) / 1000 / 60 / 60
      : 0;
    const timeSinceLastPlayed = pet.lastPlayed
      ? (now.getTime() - pet.lastPlayed.getTime()) / 1000 / 60 / 60
      : 0;
    const timeSinceLastSlept = pet.lastSlept
      ? (now.getTime() - pet.lastSlept.getTime()) / 1000 / 60 / 60
      : 0;

    return {
      ...pet,
      hunger: Math.max(
        0,
        pet.hunger - Math.floor(timeSinceLastFed * petType.hungerDecay),
      ),
      hygiene: Math.max(
        0,
        pet.hygiene - Math.floor(timeSinceLastCleaned * petType.hygieneDecay),
      ),
      fun: Math.max(
        0,
        pet.fun - Math.floor(timeSinceLastPlayed * petType.funDecay),
      ),
      energy: Math.max(
        0,
        pet.energy - Math.floor(timeSinceLastSlept * petType.energyDecay),
      ),
    };
  }

  async checkAndHandlePetDeath(pet: Pet): Promise<boolean> {
    if (pet.isDead) return false;

    const shouldDie = pet.hunger === 0 && pet.energy === 0;

    if (shouldDie) {
      await this.updatePet(pet.id, {
        isDead: true,
        deathReason: "Starvation and exhaustion",
        diedAt: new Date(),
      });

      const user = await this.getUser(pet.userId);
      if (user) {
        await this.createNotification({
          user: user.username,
          type: "system",
          message: `💀 ${pet.name} has passed away from starvation and exhaustion. Remember to feed and rest your pets!`,
          read: false,
        });
      }

      return true;
    }

    return false;
  }

  async feedPet(petId: string): Promise<Pet> {
    const pet = await this.getPet(petId);
    if (!pet) throw new Error("Pet not found");

    const updates: Partial<Pet> = {
      hunger: Math.min(100, pet.hunger + 25),
      lastFed: new Date(),
    };

    if (Math.random() < 0.33) {
      const bonusPoints = Math.floor(Math.random() * 3) + 3;
      updates.trainingPoints = pet.trainingPoints + bonusPoints;
    }

    const updatedPet = await this.updatePet(petId, updates);
    await this.addPetXP(petId, 5);
    return updatedPet;
  }

  async cleanPet(petId: string): Promise<Pet> {
    const pet = await this.getPet(petId);
    if (!pet) throw new Error("Pet not found");

    const updates: Partial<Pet> = {
      hygiene: Math.min(100, pet.hygiene + 30),
      lastCleaned: new Date(),
    };

    if (Math.random() < 0.33) {
      const bonusPoints = Math.floor(Math.random() * 3) + 3;
      updates.trainingPoints = pet.trainingPoints + bonusPoints;
    }

    const updatedPet = await this.updatePet(petId, updates);
    await this.addPetXP(petId, 5);
    return updatedPet;
  }

  async playWithPet(petId: string): Promise<Pet> {
    const pet = await this.getPet(petId);
    if (!pet) throw new Error("Pet not found");

    const updates: Partial<Pet> = {
      fun: Math.min(100, pet.fun + 20),
      lastPlayed: new Date(),
    };

    if (Math.random() < 0.33) {
      const bonusPoints = Math.floor(Math.random() * 3) + 3;
      updates.trainingPoints = pet.trainingPoints + bonusPoints;
    }

    const updatedPet = await this.updatePet(petId, updates);
    await this.addPetXP(petId, 10);
    return updatedPet;
  }

  async restPet(petId: string): Promise<Pet> {
    const pet = await this.getPet(petId);
    if (!pet) throw new Error("Pet not found");

    const updates: Partial<Pet> = {
      energy: Math.min(100, pet.energy + 40),
      lastSlept: new Date(),
    };

    if (Math.random() < 0.33) {
      const bonusPoints = Math.floor(Math.random() * 3) + 3;
      updates.trainingPoints = pet.trainingPoints + bonusPoints;
    }

    const updatedPet = await this.updatePet(petId, updates);
    await this.addPetXP(petId, 3);
    return updatedPet;
  }

  async trainPetStat(
    petId: string,
    stat: "attack" | "defense" | "sustainability" | "hunting",
    points: number,
  ): Promise<Pet> {
    const pet = await this.getPet(petId);
    if (!pet) throw new Error("Pet not found");

    if (pet.trainingPoints < points) {
      throw new Error("Not enough training points");
    }

    const updates: Partial<Pet> = {
      trainingPoints: pet.trainingPoints - points,
    };

    updates[stat] = (pet[stat] || 0) + points;

    return await this.updatePet(petId, updates);
  }

  async addPetXP(petId: string, xp: number): Promise<Pet> {
    const pet = await this.getPet(petId);
    if (!pet) throw new Error("Pet not found");

    const newXP = pet.xp + xp;
    const xpNeeded = pet.level * 100;

    if (newXP >= xpNeeded) {
      const newLevel = pet.level + 1;
      return await this.updatePet(petId, {
        xp: newXP - xpNeeded,
        level: newLevel,
        trainingPoints: pet.trainingPoints + 100,
      });
    } else {
      return await this.updatePet(petId, { xp: newXP });
    }
  }

  async prestigePet(petId: string): Promise<Pet> {
    const pet = await this.getPet(petId);
    if (!pet) throw new Error("Pet not found");

    if (pet.level < 100) {
      throw new Error("Pet must be level 100 to prestige");
    }

    return await this.updatePet(petId, {
      level: 1,
      xp: 0,
      prestigeLevel: pet.prestigeLevel + 1,
      trainingPoints: pet.trainingPoints + 50,
    });
  }

  async learnSkill(petId: string, skillId: string): Promise<Pet> {
    const pet = await this.getPet(petId);
    if (!pet) throw new Error("Pet not found");

    const [skill] = await db
      .select()
      .from(petSkills)
      .where(eq(petSkills.skillId, skillId));
    if (!skill) throw new Error("Skill not found");

    const skills = Array.isArray(pet.skills) ? pet.skills : [];
    if (skills.includes(skillId)) {
      throw new Error("Pet already knows this skill");
    }

    skills.push(skillId);

    return await this.updatePet(petId, { skills });
  }

  async createPetRoom(userId: string, name: string): Promise<PetRoom> {
    const existingRooms = await db
      .select()
      .from(petRooms)
      .where(eq(petRooms.userId, userId));
    if (existingRooms.length >= 10) {
      throw new Error("Maximum of 10 rooms per user");
    }

    const [room] = await db
      .insert(petRooms)
      .values({ userId, name })
      .returning();
    return room;
  }

  async getUserPetRooms(userId: string): Promise<PetRoom[]> {
    return await db.select().from(petRooms).where(eq(petRooms.userId, userId));
  }

  async updatePetRoom(
    roomId: string,
    updates: Partial<PetRoom>,
  ): Promise<PetRoom> {
    const [updatedRoom] = await db
      .update(petRooms)
      .set(updates)
      .where(eq(petRooms.id, roomId))
      .returning();

    if (!updatedRoom) {
      throw new Error("Room not found");
    }

    return updatedRoom;
  }

  async deletePetRoom(roomId: string): Promise<void> {
    await db.update(pets).set({ roomId: null }).where(eq(pets.roomId, roomId));

    await db.delete(petRooms).where(eq(petRooms.id, roomId));
  }

  async assignPetToRoom(petId: string, roomId: string): Promise<Pet> {
    const petsInRoom = await db
      .select()
      .from(pets)
      .where(eq(pets.roomId, roomId));
    if (petsInRoom.length >= 5) {
      throw new Error("Maximum of 5 pets per room");
    }

    return await this.updatePet(petId, { roomId });
  }

  async hireSitter(
    roomId: string,
    sitterId: string,
    hours: number,
  ): Promise<PetRoom> {
    const [sitter] = await db
      .select()
      .from(petSitters)
      .where(eq(petSitters.id, sitterId));
    if (!sitter) throw new Error("Sitter not found");

    const sitterUntil = new Date(Date.now() + hours * 60 * 60 * 1000);

    return await this.updatePetRoom(roomId, { sitterId, sitterUntil });
  }

  async getAllPetTypes(): Promise<PetType[]> {
    return await db.select().from(petTypes);
  }

  async getAllPetSkills(): Promise<PetSkill[]> {
    return await db.select().from(petSkills);
  }

  async getAllPetSitters(): Promise<PetSitter[]> {
    return await db.select().from(petSitters);
  }

  async createCustomPetType(data: InsertPetType): Promise<PetType> {
    const [petType] = await db
      .insert(petTypes)
      .values({ ...data, isCustom: true })
      .returning();
    return petType;
  }

  async startBreeding(petId1: string, petId2: string): Promise<PetBreeding> {
    const pet1 = await this.getPet(petId1);
    const pet2 = await this.getPet(petId2);

    if (!pet1 || !pet2) {
      throw new Error("One or both pets not found");
    }

    if (petId1 === petId2) {
      throw new Error("Cannot breed a pet with itself");
    }

    if (pet1.userId !== pet2.userId) {
      throw new Error("Both pets must belong to the same user");
    }

    const completesAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [breeding] = await db
      .insert(petBreeding)
      .values({
        petId1,
        petId2,
        completesAt,
      })
      .returning();

    return breeding;
  }

  async completeBreeding(breedingId: string): Promise<Pet> {
    const [breeding] = await db
      .select()
      .from(petBreeding)
      .where(eq(petBreeding.id, breedingId));
    if (!breeding) throw new Error("Breeding not found");

    if (new Date() < breeding.completesAt) {
      throw new Error("Breeding not yet complete");
    }

    const pet1 = await this.getPet(breeding.petId1);
    const pet2 = await this.getPet(breeding.petId2);

    if (!pet1 || !pet2) {
      throw new Error("Parent pets not found");
    }

    let baseSuccessRate = 0.7;

    const pet1Skills = Array.isArray(pet1.skills) ? pet1.skills : [];
    const pet2Skills = Array.isArray(pet2.skills) ? pet2.skills : [];
    const hasBreederSkill = pet1Skills.includes("breeder") || pet2Skills.includes("breeder");

    if (hasBreederSkill) {
      baseSuccessRate = baseSuccessRate * 1.15;
    }

    const isSuccessful = Math.random() < baseSuccessRate;

    if (isSuccessful) {
      const offspring = await this.adoptPet(
        pet1.userId,
        pet1.petTypeId,
        `${pet1.name} Jr.`,
      );

      await db
        .update(petBreeding)
        .set({ isSuccessful: true, offspringId: offspring.id })
        .where(eq(petBreeding.id, breedingId));

      return offspring;
    } else {
      await db
        .update(petBreeding)
        .set({ isSuccessful: false })
        .where(eq(petBreeding.id, breedingId));

      throw new Error("Breeding failed");
    }
  }

  async getActiveBreedings(userId: string): Promise<PetBreeding[]> {
    const userPets = await this.getUserPets(userId);
    const petIds = userPets.map((p) => p.id);

    if (petIds.length === 0) return [];

    return await db
      .select()
      .from(petBreeding)
      .where(
        and(
          isNull(petBreeding.isSuccessful),
          gte(petBreeding.completesAt, new Date()),
        ),
      );
  }

  async startHunt(petId: string, huntType: string): Promise<PetHunt> {
    const pet = await this.getPet(petId);
    if (!pet) throw new Error("Pet not found");

    // Check for 1-hour cooldown
    const recentHunts = await db
      .select()
      .from(petHunts)
      .where(eq(petHunts.petId, petId))
      .orderBy(desc(petHunts.createdAt))
      .limit(1);

    if (recentHunts.length > 0) {
      const lastHunt = recentHunts[0];
      const now = Date.now();
      const lastHuntTime = new Date(lastHunt.createdAt).getTime();
      const cooldown = 60 * 60 * 1000; // 1 hour

      if (now - lastHuntTime < cooldown) {
        const remaining = cooldown - (now - lastHuntTime);
        const minutesRemaining = Math.ceil(remaining / (60 * 1000));
        throw new Error(
          `Hunt cooldown: ${minutesRemaining} minutes remaining`,
        );
      }
    }

    const duration = huntType === "short" ? 1 : huntType === "medium" ? 4 : 8;
    const completesAt = new Date(Date.now() + duration * 60 * 60 * 1000);

    const [hunt] = await db
      .insert(petHunts)
      .values({
        petId,
        huntType,
        completesAt,
      })
      .returning();

    return hunt;
  }

  async completeHunt(huntId: string): Promise<{ rewards: any; hunt: PetHunt }> {
    const [hunt] = await db
      .select()
      .from(petHunts)
      .where(eq(petHunts.id, huntId));
    if (!hunt) throw new Error("Hunt not found");

    if (new Date() < hunt.completesAt) {
      throw new Error("Hunt not yet complete");
    }

    if (hunt.isCompleted) {
      throw new Error("Hunt already completed");
    }

    const pet = await this.getPet(hunt.petId);
    if (!pet) throw new Error("Pet not found");

    const baseReward =
      hunt.huntType === "short" ? 100 : hunt.huntType === "medium" ? 400 : 1000;
    const huntingBonus = 1 + pet.hunting / 100;
    const coins = Math.floor(baseReward * huntingBonus);
    const xp =
      hunt.huntType === "short" ? 20 : hunt.huntType === "medium" ? 80 : 200;

    const rewards = { coins, xp };

    await db
      .update(petHunts)
      .set({ isCompleted: true, rewards })
      .where(eq(huntId, hunt.id));

    if (Math.random() < 0.33) {
      const bonusPoints = Math.floor(Math.random() * 5) + 5;
      await this.updatePet(hunt.petId, {
        trainingPoints: pet.trainingPoints + bonusPoints,
      });
    }

    await this.addPetXP(hunt.petId, xp);

    return { rewards, hunt };
  }

  async getActiveHunts(userId: string): Promise<PetHunt[]> {
    const userPets = await this.getUserPets(userId);
    const petIds = userPets.map((p) => p.id);

    if (petIds.length === 0) return [];

    return await db
      .select()
      .from(petHunts)
      .where(
        and(
          eq(petHunts.isCompleted, false),
          gte(petHunts.completesAt, new Date()),
        ),
      );
  }

  async logPetActivity(
    petId: string,
    activityType: string,
    description: string,
    rewards?: any,
  ): Promise<PetActivity> {
    const [activity] = await db
      .insert(petActivities)
      .values({
        petId,
        activityType,
        description,
        rewards: rewards || {},
      })
      .returning();

    return activity;
  }

  async getPetActivities(petId: string, limit = 20): Promise<PetActivity[]> {
    return await db
      .select()
      .from(petActivities)
      .where(eq(petActivities.petId, petId))
      .orderBy(desc(petActivities.timestamp))
      .limit(limit);
  }

  async getAllFeatureFlags(): Promise<FeatureFlag[]> {
    return await db.select().from(featureFlags);
  }

  async getFeatureFlag(featureKey: string): Promise<FeatureFlag | undefined> {
    const [flag] = await db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.featureKey, featureKey));
    return flag || undefined;
  }

  async isFeatureEnabled(featureKey: string): Promise<boolean> {
    const flag = await this.getFeatureFlag(featureKey);
    return flag?.enabled ?? true;
  }

  async updateFeatureFlag(
    featureKey: string,
    enabled: boolean,
    updatedBy: string,
  ): Promise<FeatureFlag> {
    const [updatedFlag] = await db
      .update(featureFlags)
      .set({ enabled, updatedBy, updatedAt: new Date() })
      .where(eq(featureFlags.featureKey, featureKey))
      .returning();

    if (!updatedFlag) {
      throw new Error("Feature flag not found");
    }

    return updatedFlag;
  }

  async initializeFeatureFlags(): Promise<void> {
    const existingFlags = await this.getAllFeatureFlags();
    const existingKeys = new Set(existingFlags.map((f) => f.featureKey));

    const defaultFlags = [
      {
        featureKey: "pets",
        featureName: "Pet System",
        description: "Enable or disable the pet adoption and management system",
        enabled: true,
      },
      {
        featureKey: "games",
        featureName: "Game System",
        description: "Enable or disable games like blackjack, slots, coinflip, etc.",
        enabled: true,
      },
      {
        featureKey: "economy",
        featureName: "Economy System",
        description: "Enable or disable economy features like work, daily, beg, etc.",
        enabled: true,
      },
      {
        featureKey: "chat",
        featureName: "Chat System",
        description: "Enable or disable the global chat feature",
        enabled: true,
      },
      {
        featureKey: "leaderboard",
        featureName: "Leaderboard",
        description: "Enable or disable the leaderboard feature",
        enabled: true,
      },
      {
        featureKey: "shop",
        featureName: "Shop System",
        description: "Enable or disable the shop and inventory features",
        enabled: true,
      },
      {
        featureKey: "freemium",
        featureName: "Freemium Rewards",
        description: "Enable or disable the freemium reward system",
        enabled: true,
      },
    ];

    for (const flag of defaultFlags) {
      if (!existingKeys.has(flag.featureKey)) {
        await db.insert(featureFlags).values(flag);
        // Created feature flag
      }
    }
  }

  // Events Management
  async getAllEvents(): Promise<SelectEvent[]> {
    return await db.select().from(events).orderBy(desc(events.createdAt));
  }

  async getActiveEvents(): Promise<SelectEvent[]> {
    const now = new Date();
    return await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.active, true),
          lt(events.startDate, now),
          gte(events.endDate, now)
        )
      );
  }

  async getEvent(id: string): Promise<SelectEvent | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(eventData: InsertEvent): Promise<SelectEvent> {
    const [event] = await db.insert(events).values(eventData).returning();
    if (!event) {
      throw new Error("Failed to create event");
    }
    return event;
  }

  async updateEvent(id: string, updates: Partial<SelectEvent>): Promise<SelectEvent> {
    const [event] = await db
      .update(events)
      .set(updates)
      .where(eq(events.id, id))
      .returning();

    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async activateEvent(id: string): Promise<SelectEvent> {
    const [event] = await db
      .update(events)
      .set({ active: true })
      .where(eq(events.id, id))
      .returning();

    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  async deactivateEvent(id: string): Promise<SelectEvent> {
    const [event] = await db
      .update(events)
      .set({ active: false })
      .where(eq(events.id, id))
      .returning();

    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  // Trading System Implementation
  async createTradeOffer(fromUserId: string, toUserId: string): Promise<TradeOffer> {
    const [offer] = await db
      .insert(tradeOffers)
      .values({
        fromUserId,
        toUserId,
        status: "pending",
      })
      .returning();

    if (!offer) {
      throw new Error("Failed to create trade offer");
    }
    return offer;
  }

  async getTradeOffers(userId: string): Promise<TradeOffer[]> {
    return await db
      .select()
      .from(tradeOffers)
      .where(
        and(
          eq(tradeOffers.toUserId, userId),
          eq(tradeOffers.status, "pending")
        )
      )
      .orderBy(desc(tradeOffers.createdAt));
  }

  async acceptTradeOffer(offerId: string): Promise<TradeOffer> {
    const [offer] = await db
      .update(tradeOffers)
      .set({ status: "accepted" })
      .where(eq(tradeOffers.id, offerId))
      .returning();

    if (!offer) {
      throw new Error("Trade offer not found");
    }
    return offer;
  }

  async rejectTradeOffer(offerId: string): Promise<void> {
    await db
      .update(tradeOffers)
      .set({ status: "rejected" })
      .where(eq(tradeOffers.id, offerId));
  }

  async createTrade(userId1: string, userId2: string): Promise<Trade> {
    const [trade] = await db
      .insert(trades)
      .values({
        userId1,
        userId2,
        status: "active",
        user1Ready: false,
        user2Ready: false,
      })
      .returning();

    if (!trade) {
      throw new Error("Failed to create trade");
    }
    return trade;
  }

  async getTrade(tradeId: string): Promise<Trade | undefined> {
    const [trade] = await db
      .select()
      .from(trades)
      .where(eq(trades.id, tradeId));
    return trade || undefined;
  }

  async getActiveTrade(userId1: string, userId2: string): Promise<Trade | undefined> {
    const [trade] = await db
      .select()
      .from(trades)
      .where(
        and(
          eq(trades.status, "active"),
          sql`(${trades.userId1} = ${userId1} AND ${trades.userId2} = ${userId2}) OR (${trades.userId1} = ${userId2} AND ${trades.userId2} = ${userId1})`
        )
      );
    return trade || undefined;
  }

  async addTradeItem(
    tradeId: string,
    userId: string,
    itemType: "item" | "pet" | "collectible" | "coins",
    itemId: string | null,
    quantity: number
  ): Promise<TradeItem> {
    const [tradeItem] = await db
      .insert(tradeItems)
      .values({
        tradeId,
        userId,
        itemType,
        itemId,
        quantity,
      })
      .returning();

    if (!tradeItem) {
      throw new Error("Failed to add trade item");
    }

    await db
      .update(trades)
      .set({ 
        updatedAt: new Date(),
        user1Ready: false,
        user2Ready: false,
      })
      .where(eq(trades.id, tradeId));

    return tradeItem;
  }

  async removeTradeItem(tradeItemId: string): Promise<void> {
    const [item] = await db
      .select()
      .from(tradeItems)
      .where(eq(tradeItems.id, tradeItemId));

    if (item) {
      await db
        .update(trades)
        .set({ 
          updatedAt: new Date(),
          user1Ready: false,
          user2Ready: false,
        })
        .where(eq(trades.id, item.tradeId));
    }

    await db
      .delete(tradeItems)
      .where(eq(tradeItems.id, tradeItemId));
  }

  async getTradeItems(tradeId: string): Promise<TradeItem[]> {
    return await db
      .select()
      .from(tradeItems)
      .where(eq(tradeItems.tradeId, tradeId))
      .orderBy(desc(tradeItems.addedAt));
  }

  async markTradeReady(tradeId: string, userId: string): Promise<Trade> {
    const trade = await this.getTrade(tradeId);
    if (!trade) {
      throw new Error("Trade not found");
    }

    const isUser1 = trade.userId1 === userId;
    const updateField = isUser1 ? { user1Ready: true } : { user2Ready: true };

    const [updatedTrade] = await db
      .update(trades)
      .set({ ...updateField, updatedAt: new Date() })
      .where(eq(trades.id, tradeId))
      .returning();

    if (!updatedTrade) {
      throw new Error("Failed to update trade");
    }

    return updatedTrade;
  }

  async executeTrade(tradeId: string): Promise<{ success: boolean; message: string }> {
    const trade = await this.getTrade(tradeId);
    if (!trade) {
      return { success: false, message: "Trade not found" };
    }

    if (!trade.user1Ready || !trade.user2Ready) {
      return { success: false, message: "Both users must accept the trade" };
    }

    const items = await this.getTradeItems(tradeId);
    const user1 = await this.getUser(trade.userId1);
    const user2 = await this.getUser(trade.userId2);

    if (!user1 || !user2) {
      return { success: false, message: "User not found" };
    }

    const user1Items = items.filter(item => item.userId === trade.userId1);
    const user2Items = items.filter(item => item.userId === trade.userId2);

    try {
      for (const item of user1Items) {
        if (item.itemType === "coins") {
          if (user1.coins < item.quantity) {
            return { success: false, message: `${user1.username} has insufficient coins` };
          }
          await this.updateUser(user1.id, { coins: user1.coins - item.quantity });
          await this.updateUser(user2.id, { coins: user2.coins + item.quantity });

          await this.createTransaction({
            user: user1.username,
            type: "transfer",
            amount: -item.quantity,
            targetUser: user2.username,
            description: `Trade: Sent ${item.quantity} coins to ${user2.username}`,
          });
        } else if (item.itemType === "pet" && item.itemId) {
          const pet = await this.getPet(item.itemId);
          if (!pet || pet.userId !== user1.id) {
            return { success: false, message: `Invalid pet in trade` };
          }
          await this.updatePet(item.itemId, { userId: user2.id });
        } else if (item.itemId) {
          const userInventory = user1.inventory as any[];
          const itemIndex = userInventory.findIndex(
            (inv: any) => inv.itemId === item.itemId && inv.quantity >= item.quantity
          );
          if (itemIndex === -1) {
            return { success: false, message: `${user1.username} doesn't have the required items` };
          }

          userInventory[itemIndex].quantity -= item.quantity;
          if (userInventory[itemIndex].quantity <= 0) {
            userInventory.splice(itemIndex, 1);
          }

          const user2Inventory = user2.inventory as any[];
          const existingItemIndex = user2Inventory.findIndex(
            (inv: any) => inv.itemId === item.itemId
          );
          if (existingItemIndex >= 0) {
            user2Inventory[existingItemIndex].quantity += item.quantity;
          } else {
            user2Inventory.push({ itemId: item.itemId, quantity: item.quantity });
          }

          await this.updateUser(user1.id, { inventory: userInventory });
          await this.updateUser(user2.id, { inventory: user2Inventory });
        }
      }

      for (const item of user2Items) {
        if (item.itemType === "coins") {
          if (user2.coins < item.quantity) {
            return { success: false, message: `${user2.username} has insufficient coins` };
          }
          await this.updateUser(user2.id, { coins: user2.coins - item.quantity });
          await this.updateUser(user1.id, { coins: user1.coins + item.quantity });

          await this.createTransaction({
            user: user2.username,
            type: "transfer",
            amount: -item.quantity,
            targetUser: user1.username,
            description: `Trade: Sent ${item.quantity} coins to ${user1.username}`,
          });
        } else if (item.itemType === "pet" && item.itemId) {
          const pet = await this.getPet(item.itemId);
          if (!pet || pet.userId !== user2.id) {
            return { success: false, message: `Invalid pet in trade` };
          }
          await this.updatePet(item.itemId, { userId: user1.id });
        } else if (item.itemId) {
          const userInventory = user2.inventory as any[];
          const itemIndex = userInventory.findIndex(
            (inv: any) => inv.itemId === item.itemId && inv.quantity >= item.quantity
          );
          if (itemIndex === -1) {
            return { success: false, message: `${user2.username} doesn't have the required items` };
          }

          userInventory[itemIndex].quantity -= item.quantity;
          if (userInventory[itemIndex].quantity <= 0) {
            userInventory.splice(itemIndex, 1);
          }

          const user1Inventory = user1.inventory as any[];
          const existingItemIndex = user1Inventory.findIndex(
            (inv: any) => inv.itemId === item.itemId
          );
          if (existingItemIndex >= 0) {
            user1Inventory[existingItemIndex].quantity += item.quantity;
          } else {
            user1Inventory.push({ itemId: item.itemId, quantity: item.quantity });
          }

          await this.updateUser(user2.id, { inventory: userInventory });
          await this.updateUser(user1.id, { inventory: user1Inventory });
        }
      }

      await db
        .update(trades)
        .set({ status: "completed", updatedAt: new Date() })
        .where(eq(trades.id, tradeId));

      return { success: true, message: "Trade completed successfully!" };
    } catch (error) {
      return { success: false, message: `Trade failed: ${(error as Error).message}` };
    }
  }

  async cancelTrade(tradeId: string): Promise<void> {
    await db
      .update(trades)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(trades.id, tradeId));

    await db
      .delete(tradeItems)
      .where(eq(tradeItems.tradeId, tradeId));
  }
}

export const storage = new DatabaseStorage();