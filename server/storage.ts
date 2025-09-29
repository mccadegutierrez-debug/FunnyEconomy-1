import { users, items, transactions, notifications, chatMessages, auditLogs, userPets, petRooms, petSitters, petActivities, petSkills, petHunts, petBreeding, type User, type InsertUser, type Item, type Transaction, type Notification, type ChatMessage, type AuditLog, type InsertAuditLog, type UserPet, type InsertUserPet, type PetRoom, type InsertPetRoom, type PetSitter, type InsertPetSitter, type PetActivity, type InsertPetActivity, type PetSkill, type InsertPetSkill, type PetHunt, type InsertPetHunt, type PetBreeding, type InsertPetBreeding } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, isNull } from "drizzle-orm";
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
  createItem(item: Omit<Item, 'id'>): Promise<Item>;
  updateItem(id: string, updates: Partial<Item>): Promise<Item>;
  deleteItem(id: string): Promise<void>;
  
  // Transactions
  createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'> & { timestamp?: Date }): Promise<Transaction>;
  getUserTransactions(username: string, limit?: number): Promise<Transaction[]>;
  
  // Notifications
  createNotification(notification: Omit<Notification, 'id' | 'timestamp'> & { timestamp?: Date }): Promise<Notification>;
  getUserNotifications(username: string): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
  deleteNotification(id: string, username: string): Promise<void>;
  clearAllNotifications(username: string): Promise<void>;
  
  // Chat Messages
  createChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage>;
  deleteChatMessage(id: string): Promise<void>;
  getRecentChatMessages(limit?: number): Promise<ChatMessage[]>;
  
  // Leaderboard
  getLeaderboard(limit?: number): Promise<Array<{username: string, coins: number, level: number}>>;
  
  // Audit Logs
  createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'> & { timestamp?: Date }): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;
  getAuditLogsByAdmin(adminUsername: string, limit?: number): Promise<AuditLog[]>;
  getAuditLogsByAction(action: string, limit?: number): Promise<AuditLog[]>;
  
  // User Pets
  getUserPets(userId: string): Promise<UserPet[]>;
  createUserPet(pet: Omit<UserPet, 'id' | 'adoptedAt'>): Promise<UserPet>;
  updateUserPet(petId: string, updates: Partial<UserPet>): Promise<UserPet>;
  deleteUserPet(petId: string): Promise<void>;
  
  // Custom Pet Types
  createCustomPet(pet: { id: string; name: string; emoji: string; rarity: string; adoptionCost: number; hungerDecay: number; happinessDecay: number; energyDecay: number }): Promise<any>;
  
  // Pet Rooms
  getUserPetRooms(userId: string): Promise<PetRoom[]>;
  createPetRoom(room: InsertPetRoom): Promise<PetRoom>;
  updatePetRoom(roomId: string, updates: Partial<PetRoom>): Promise<PetRoom>;
  deletePetRoom(roomId: string): Promise<void>;
  getPetRoom(roomId: string): Promise<PetRoom | undefined>;
  
  // Pet Sitters
  getAllPetSitters(): Promise<PetSitter[]>;
  getPetSitter(sitterId: string): Promise<PetSitter | undefined>;
  createPetSitter(sitter: InsertPetSitter): Promise<PetSitter>;
  
  // Pet Activities
  getPetActivities(petId: string, limit?: number): Promise<PetActivity[]>;
  createPetActivity(activity: InsertPetActivity): Promise<PetActivity>;
  getUserPetActivities(userId: string, limit?: number): Promise<PetActivity[]>;
  
  // Pet Skills
  getAllPetSkills(): Promise<PetSkill[]>;
  getPetSkill(skillId: string): Promise<PetSkill | undefined>;
  createPetSkill(skill: InsertPetSkill): Promise<PetSkill>;
  
  // Pet Hunts
  createPetHunt(hunt: InsertPetHunt): Promise<PetHunt>;
  getPetHunt(huntId: string): Promise<PetHunt | undefined>;
  updatePetHunt(huntId: string, updates: Partial<PetHunt>): Promise<PetHunt>;
  getActivePetHunts(userId: string): Promise<PetHunt[]>;
  
  // Pet Breeding
  createPetBreeding(breeding: InsertPetBreeding): Promise<PetBreeding>;
  getPetBreeding(breedingId: string): Promise<PetBreeding | undefined>;
  updatePetBreeding(breedingId: string, updates: Partial<PetBreeding>): Promise<PetBreeding>;
  getActivePetBreeding(userId: string): Promise<PetBreeding[]>;
  
  // System
  initializeData(): Promise<void>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers;
  }


  async createUser(userData: InsertUser & { passwordHash: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        username: userData.username,
        passwordHash: userData.passwordHash,
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
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

  async createItem(itemData: Omit<Item, 'id'>): Promise<Item> {
    const [item] = await db
      .insert(items)
      .values(itemData)
      .returning();
    return item;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    const [updatedItem] = await db
      .update(items)
      .set(updates)
      .where(eq(items.id, id))
      .returning();
    
    if (!updatedItem) {
      throw new Error('Item not found');
    }
    
    return updatedItem;
  }

  async deleteItem(id: string): Promise<void> {
    await db.delete(items).where(eq(items.id, id));
  }

  async createTransaction(transactionData: Omit<Transaction, 'id' | 'timestamp'> & { timestamp?: Date }): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values({
        ...transactionData,
        timestamp: transactionData.timestamp || new Date()
      })
      .returning();
    return transaction;
  }

  async getUserTransactions(username: string, limit = 20): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.user, username))
      .orderBy(desc(transactions.timestamp))
      .limit(limit);
  }

  async createNotification(notificationData: Omit<Notification, 'id' | 'timestamp'> & { timestamp?: Date }): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values({
        ...notificationData,
        timestamp: notificationData.timestamp || new Date()
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
    await db
      .delete(notifications)
      .where(eq(notifications.user, username));
  }

  async getLeaderboard(limit = 20): Promise<Array<{username: string, coins: number, level: number}>> {
    const usersData = await db
      .select({
        username: users.username,
        coins: users.coins,
        bank: users.bank,
        level: users.level
      })
      .from(users)
      .where(eq(users.banned, false))
      .limit(limit * 2); // Get more in case we need to filter
    
    return usersData
      .map(user => ({
        username: user.username,
        coins: user.coins + user.bank, // Net worth
        level: user.level
      }))
      .sort((a, b) => b.coins - a.coins)
      .slice(0, limit);
  }

  // Chat message methods
  async createChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values({
        username: message.username,
        message: message.message
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
    // Get existing items to check what's already in the database
    const existingItems = await this.getAllItems();
    const existingItemNames = new Set(existingItems.map(item => item.name));

    // Create sample items
    const sampleItems = [
      // Tools (Equipment that provides passive benefits)
      {
        name: "Fishing Rod",
        description: "Passive +50 coins/hour",
        price: 5000,
        type: 'tool' as const,
        rarity: 'common' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 50 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 2147483647,
        currentPrice: 5000
      },
      {
        name: "Hunting Rifle",
        description: "Passive +75 coins/hour, +5% gambling luck",
        price: 8000,
        type: 'tool' as const,
        rarity: 'uncommon' as const,
        effects: {
          passive: { winRateBoost: 5, coinsPerHour: 75 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 2147483647,
        currentPrice: 8000
      },
      {
        name: "Laptop",
        description: "Work from home! Passive +100 coins/hour",
        price: 15000,
        type: 'tool' as const,
        rarity: 'rare' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 100 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 2147483647,
        currentPrice: 15000
      },
      {
        name: "Golden Pickaxe",
        description: "Epic mining tool! Passive +200 coins/hour, +10% luck",
        price: 50000,
        type: 'tool' as const,
        rarity: 'epic' as const,
        effects: {
          passive: { winRateBoost: 10, coinsPerHour: 200 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 2147483647,
        currentPrice: 50000
      },
      
      // Collectibles (Rare items for prestige and trading)
      {
        name: "Rare Pepe",
        description: "Legendary collectible meme",
        price: 25000,
        type: 'collectible' as const,
        rarity: 'rare' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 100,
        currentPrice: 25000
      },
      {
        name: "Dank Crown",
        description: "Show off your wealth! Ultimate status symbol",
        price: 1000000,
        type: 'collectible' as const,
        rarity: 'legendary' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 1,
        currentPrice: 1000000
      },
      {
        name: "Meme Trophy",
        description: "Award for exceptional meme quality",
        price: 75000,
        type: 'collectible' as const,
        rarity: 'epic' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 25,
        currentPrice: 75000
      },
      {
        name: "Shiny Rock",
        description: "It's shiny... and it's a rock",
        price: 5000,
        type: 'collectible' as const,
        rarity: 'common' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 500,
        currentPrice: 5000
      },
      
      // Consumables (One-time use items with temporary effects)
      {
        name: "Luck Potion",
        description: "+15% win rate for 1 hour",
        price: 2500,
        type: 'consumable' as const,
        rarity: 'uncommon' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 3600000, duration: 3600000, effect: "luck_boost" }
        },
        stock: 50,
        currentPrice: 2500
      },
      {
        name: "Energy Drink",
        description: "Skip all cooldowns for 30 minutes",
        price: 5000,
        type: 'consumable' as const,
        rarity: 'rare' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 1800000, duration: 1800000, effect: "no_cooldowns" }
        },
        stock: 25,
        currentPrice: 5000
      },
      {
        name: "Coin Multiplier",
        description: "2x coin earnings for 2 hours",
        price: 10000,
        type: 'consumable' as const,
        rarity: 'epic' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 7200000, duration: 7200000, effect: "coin_multiplier" }
        },
        stock: 10,
        currentPrice: 10000
      },
      {
        name: "XP Booster",
        description: "Double XP gains for 1 hour",
        price: 3000,
        type: 'consumable' as const,
        rarity: 'uncommon' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 3600000, duration: 3600000, effect: "xp_boost" }
        },
        stock: 30,
        currentPrice: 3000
      },
      
      // Loot Boxes (Mystery containers with random rewards)
      {
        name: "Dank Box",
        description: "Contains 2-5 random items!",
        price: 10000,
        type: 'lootbox' as const,
        rarity: 'epic' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "lootbox" }
        },
        stock: 20,
        currentPrice: 10000
      },
      {
        name: "Starter Pack",
        description: "Perfect for new players! Contains basic items",
        price: 2500,
        type: 'lootbox' as const,
        rarity: 'common' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "starter_lootbox" }
        },
        stock: 100,
        currentPrice: 2500
      },
      {
        name: "Legendary Chest",
        description: "Ultra rare items await! 1% chance legendary",
        price: 50000,
        type: 'lootbox' as const,
        rarity: 'legendary' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "legendary_lootbox" }
        },
        stock: 5,
        currentPrice: 50000
      },
      {
        name: "Mystery Bundle",
        description: "Could contain anything... even a boat!",
        price: 7500,
        type: 'lootbox' as const,
        rarity: 'rare' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "mystery_lootbox" }
        },
        stock: 40,
        currentPrice: 7500
      },

      // Additional Items from dankmemer.lol/items
      
      // Adventure & Exploration Items
      {
        name: "Adventure Ticket",
        description: "Grants access to special adventure areas",
        price: 15000,
        type: 'consumable' as const,
        rarity: 'rare' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 7200000, duration: 0, effect: "adventure_access" }
        },
        stock: 50,
        currentPrice: 15000
      },
      {
        name: "A Plus",
        description: "Epic sellable item with great value",
        price: 200000,
        type: 'collectible' as const,
        rarity: 'epic' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 10,
        currentPrice: 200000
      },
      {
        name: "Australia Ticket",
        description: "Travel to Australia for unique adventures",
        price: 25000,
        type: 'consumable' as const,
        rarity: 'epic' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 86400000, duration: 0, effect: "australia_access" }
        },
        stock: 25,
        currentPrice: 25000
      },

      // Food & Consumables
      {
        name: "Apple",
        description: "A fresh, healthy apple",
        price: 150,
        type: 'consumable' as const,
        rarity: 'common' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 300000, duration: 600000, effect: "health_boost" }
        },
        stock: 1000,
        currentPrice: 150
      },
      {
        name: "Bean",
        description: "Just a simple bean... or is it?",
        price: 50,
        type: 'collectible' as const,
        rarity: 'common' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 2000,
        currentPrice: 50
      },
      {
        name: "Alcohol",
        description: "Makes you feel dizzy but boosts gambling luck",
        price: 2000,
        type: 'consumable' as const,
        rarity: 'uncommon' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 3600000, duration: 1800000, effect: "gambling_boost" }
        },
        stock: 200,
        currentPrice: 2000
      },
      {
        name: "Berries and Cream",
        description: "Delicious treat that provides temporary protection",
        price: 1500,
        type: 'consumable' as const,
        rarity: 'uncommon' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 1800000, duration: 3600000, effect: "protection" }
        },
        stock: 100,
        currentPrice: 1500
      },

      // Tools & Equipment
      {
        name: "Ammo",
        description: "Essential ammunition for hunting adventures",
        price: 500,
        type: 'consumable' as const,
        rarity: 'common' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "hunting_ammo" }
        },
        stock: 500,
        currentPrice: 500
      },
      {
        name: "Ban Hammer",
        description: "Legendary moderation tool",
        price: 500000,
        type: 'tool' as const,
        rarity: 'legendary' as const,
        effects: {
          passive: { winRateBoost: 25, coinsPerHour: 500 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 1,
        currentPrice: 500000
      },
      {
        name: "Laptop",
        description: "Allows remote work for passive income",
        price: 15000,
        type: 'tool' as const,
        rarity: 'rare' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 100 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 100,
        currentPrice: 15000
      },

      // Collectibles & Rare Items
      {
        name: "Alien Sample",
        description: "Mysterious extraterrestrial material",
        price: 75000,
        type: 'collectible' as const,
        rarity: 'epic' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 25,
        currentPrice: 75000
      },
      {
        name: "Ant",
        description: "Tiny but mighty insect",
        price: 100,
        type: 'collectible' as const,
        rarity: 'common' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 1000,
        currentPrice: 100
      },
      {
        name: "Big Brain",
        description: "Intelligence enhancement device",
        price: 50000,
        type: 'tool' as const,
        rarity: 'epic' as const,
        effects: {
          passive: { winRateBoost: 15, coinsPerHour: 150 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 50,
        currentPrice: 50000
      },
      {
        name: "Director's Card",
        description: "VIP access card for exclusive areas",
        price: 100000,
        type: 'collectible' as const,
        rarity: 'legendary' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 5,
        currentPrice: 100000
      },

      // Protection & Security Items
      {
        name: "Anti-Rob Pack",
        description: "Protects your coins from theft",
        price: 10000,
        type: 'consumable' as const,
        rarity: 'rare' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 86400000, duration: 86400000, effect: "rob_protection" }
        },
        stock: 75,
        currentPrice: 10000
      },

      // Special Items & Utilities
      {
        name: "Bank Note",
        description: "Increases bank storage capacity",
        price: 25000,
        type: 'tool' as const,
        rarity: 'rare' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "bank_expansion" }
        },
        stock: 100,
        currentPrice: 25000
      },
      {
        name: "Beaker of the Raid",
        description: "Mysterious liquid with unknown properties",
        price: 150000,
        type: 'collectible' as const,
        rarity: 'legendary' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 3,
        currentPrice: 150000
      },
      {
        name: "Bean Mp3 Player",
        description: "Plays your favorite bean sounds",
        price: 5000,
        type: 'collectible' as const,
        rarity: 'rare' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 150,
        currentPrice: 5000
      },
      {
        name: "Beggar's Bowl",
        description: "Increases earnings from begging",
        price: 1000,
        type: 'tool' as const,
        rarity: 'common' as const,
        effects: {
          passive: { winRateBoost: 5, coinsPerHour: 25 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 300,
        currentPrice: 1000
      },

      // Clothing & Accessories
      {
        name: "Apron",
        description: "Cooking apron that improves work efficiency",
        price: 3000,
        type: 'tool' as const,
        rarity: 'uncommon' as const,
        effects: {
          passive: { winRateBoost: 3, coinsPerHour: 40 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 200,
        currentPrice: 3000
      },

      // Mystery & Chaos Items
      {
        name: "Barrel of Sludge",
        description: "Contains mysterious toxic waste",
        price: 20000,
        type: 'collectible' as const,
        rarity: 'epic' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 30,
        currentPrice: 20000
      },
      {
        name: "Bat Box",
        description: "Home for friendly neighborhood bats",
        price: 8000,
        type: 'collectible' as const,
        rarity: 'uncommon' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 100,
        currentPrice: 8000
      },

      // Special Event Items
      {
        name: "Ahexy's Power",
        description: "Mysterious power artifact from Ahexy",
        price: 125000,
        type: 'collectible' as const,
        rarity: 'legendary' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 5,
        currentPrice: 125000
      },
      {
        name: "Aid's Pickle Paint",
        description: "Special paint made from pickles",
        price: 15000,
        type: 'collectible' as const,
        rarity: 'rare' as const,
        effects: {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 75,
        currentPrice: 15000
      },

      // More Tools
      {
        name: "Trinket",
        description: "Small lucky charm that brings fortune",
        price: 2500,
        type: 'tool' as const,
        rarity: 'uncommon' as const,
        effects: {
          passive: { winRateBoost: 7, coinsPerHour: 30 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        },
        stock: 250,
        currentPrice: 2500
      }
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
        const existingItem = existingItems.find(item => item.name === itemData.name);
        if (existingItem) {
          await this.updateItem(existingItem.id, itemData);
          updatedCount++;
        }
      }
    }

    if (addedCount > 0 || updatedCount > 0) {
      console.log(`Database initialized: ${addedCount} new items added, ${updatedCount} items updated`);
    } else {
      console.log("All sample items are up to date in database");
    }

    // Ensure critical users have owners badge and owner admin role
    const criticalUsers = ['deez', 'savage'];
    for (const username of criticalUsers) {
      const user = await this.getUserByUsername(username);
      if (user) {
        let needsUpdate = false;
        const updateData: any = {};
        
        // Grant owners badge
        const achievements = Array.isArray(user.achievements) ? user.achievements : [];
        if (!achievements.includes('owners')) {
          achievements.push('owners');
          updateData.achievements = achievements;
          needsUpdate = true;
        }
        
        // Grant owner admin role
        if (user.adminRole !== 'owner') {
          updateData.adminRole = 'owner';
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await this.updateUser(user.id, updateData);
          console.log(`Granted owners badge and owner role to ${username}`);
        }
      }
    }
  }

  // Audit Log Methods
  async createAuditLog(logData: Omit<AuditLog, 'id' | 'timestamp'> & { timestamp?: Date }): Promise<AuditLog> {
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

  async getAuditLogsByAdmin(adminUsername: string, limit = 100): Promise<AuditLog[]> {
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

  // User Pets Methods
  async getUserPets(userId: string): Promise<UserPet[]> {
    const pets = await db
      .select()
      .from(userPets)
      .where(eq(userPets.userId, userId))
      .orderBy(desc(userPets.adoptedAt));
    return pets;
  }

  async createUserPet(petData: Omit<UserPet, 'id' | 'adoptedAt'>): Promise<UserPet> {
    const [pet] = await db
      .insert(userPets)
      .values({
        ...petData,
        adoptedAt: new Date(),
      })
      .returning();
    return pet;
  }

  async updateUserPet(petId: string, updates: Partial<UserPet>): Promise<UserPet> {
    const [pet] = await db
      .update(userPets)
      .set(updates)
      .where(eq(userPets.id, petId))
      .returning();
    return pet;
  }

  async deleteUserPet(petId: string): Promise<void> {
    await db
      .delete(userPets)
      .where(eq(userPets.id, petId));
  }

  // Pet Rooms Methods
  async getUserPetRooms(userId: string): Promise<PetRoom[]> {
    const rooms = await db
      .select()
      .from(petRooms)
      .where(eq(petRooms.userId, userId))
      .orderBy(desc(petRooms.createdAt));
    return rooms;
  }

  async createPetRoom(roomData: InsertPetRoom): Promise<PetRoom> {
    const [room] = await db
      .insert(petRooms)
      .values(roomData)
      .returning();
    return room;
  }

  async updatePetRoom(roomId: string, updates: Partial<PetRoom>): Promise<PetRoom> {
    const [room] = await db
      .update(petRooms)
      .set(updates)
      .where(eq(petRooms.id, roomId))
      .returning();
    return room;
  }

  async deletePetRoom(roomId: string): Promise<void> {
    await db
      .delete(petRooms)
      .where(eq(petRooms.id, roomId));
  }

  async getPetRoom(roomId: string): Promise<PetRoom | undefined> {
    const [room] = await db
      .select()
      .from(petRooms)
      .where(eq(petRooms.id, roomId));
    return room || undefined;
  }

  // Pet Sitters Methods
  async getAllPetSitters(): Promise<PetSitter[]> {
    const sitters = await db
      .select()
      .from(petSitters);
    return sitters;
  }

  async getPetSitter(sitterId: string): Promise<PetSitter | undefined> {
    const [sitter] = await db
      .select()
      .from(petSitters)
      .where(eq(petSitters.id, sitterId));
    return sitter || undefined;
  }

  async createPetSitter(sitterData: InsertPetSitter): Promise<PetSitter> {
    const [sitter] = await db
      .insert(petSitters)
      .values(sitterData)
      .returning();
    return sitter;
  }

  // Pet Activities Methods
  async getPetActivities(petId: string, limit = 50): Promise<PetActivity[]> {
    const activities = await db
      .select()
      .from(petActivities)
      .where(eq(petActivities.petId, petId))
      .orderBy(desc(petActivities.timestamp))
      .limit(limit);
    return activities;
  }

  async createPetActivity(activityData: InsertPetActivity): Promise<PetActivity> {
    const [activity] = await db
      .insert(petActivities)
      .values(activityData)
      .returning();
    return activity;
  }

  async getUserPetActivities(userId: string, limit = 100): Promise<PetActivity[]> {
    const activities = await db
      .select({
        id: petActivities.id,
        petId: petActivities.petId,
        activityType: petActivities.activityType,
        description: petActivities.description,
        rewards: petActivities.rewards,
        timestamp: petActivities.timestamp,
      })
      .from(petActivities)
      .innerJoin(userPets, eq(petActivities.petId, userPets.id))
      .where(eq(userPets.userId, userId))
      .orderBy(desc(petActivities.timestamp))
      .limit(limit);
    return activities;
  }

  // Pet Skills Methods
  async getAllPetSkills(): Promise<PetSkill[]> {
    const skills = await db
      .select()
      .from(petSkills);
    return skills;
  }

  async getPetSkill(skillId: string): Promise<PetSkill | undefined> {
    const [skill] = await db
      .select()
      .from(petSkills)
      .where(eq(petSkills.id, skillId));
    return skill || undefined;
  }

  async createPetSkill(skillData: InsertPetSkill): Promise<PetSkill> {
    const [skill] = await db
      .insert(petSkills)
      .values(skillData)
      .returning();
    return skill;
  }

  // Pet Hunts Methods
  async createPetHunt(huntData: InsertPetHunt): Promise<PetHunt> {
    const [hunt] = await db
      .insert(petHunts)
      .values(huntData)
      .returning();
    return hunt;
  }

  async getPetHunt(huntId: string): Promise<PetHunt | undefined> {
    const [hunt] = await db
      .select()
      .from(petHunts)
      .where(eq(petHunts.id, huntId));
    return hunt || undefined;
  }

  async updatePetHunt(huntId: string, updates: Partial<PetHunt>): Promise<PetHunt> {
    const [hunt] = await db
      .update(petHunts)
      .set(updates)
      .where(eq(petHunts.id, huntId))
      .returning();
    return hunt;
  }

  async getActivePetHunts(userId: string): Promise<PetHunt[]> {
    const hunts = await db
      .select({
        id: petHunts.id,
        petId: petHunts.petId,
        startedAt: petHunts.startedAt,
        completesAt: petHunts.completesAt,
        huntType: petHunts.huntType,
        isCompleted: petHunts.isCompleted,
        rewards: petHunts.rewards,
      })
      .from(petHunts)
      .innerJoin(userPets, eq(petHunts.petId, userPets.id))
      .where(and(
        eq(userPets.userId, userId),
        eq(petHunts.isCompleted, false)
      ))
      .orderBy(desc(petHunts.startedAt));
    return hunts;
  }

  // Pet Breeding Methods
  async createPetBreeding(breedingData: InsertPetBreeding): Promise<PetBreeding> {
    const [breeding] = await db
      .insert(petBreeding)
      .values(breedingData)
      .returning();
    return breeding;
  }

  async getPetBreeding(breedingId: string): Promise<PetBreeding | undefined> {
    const [breeding] = await db
      .select()
      .from(petBreeding)
      .where(eq(petBreeding.id, breedingId));
    return breeding || undefined;
  }

  async updatePetBreeding(breedingId: string, updates: Partial<PetBreeding>): Promise<PetBreeding> {
    const [breeding] = await db
      .update(petBreeding)
      .set(updates)
      .where(eq(petBreeding.id, breedingId))
      .returning();
    return breeding;
  }

  async getActivePetBreeding(userId: string): Promise<PetBreeding[]> {
    const breeding = await db
      .select()
      .from(petBreeding)
      .innerJoin(userPets, eq(petBreeding.petId1, userPets.id))
      .where(and(
        eq(userPets.userId, userId),
        isNull(petBreeding.isSuccessful)
      ))
      .orderBy(desc(petBreeding.startedAt));
    return breeding.map(b => b.pet_breeding);
  }

  // Custom Pet Types
  async createCustomPet(pet: { id: string; name: string; emoji: string; rarity: string; adoptionCost: number; hungerDecay: number; happinessDecay: number; energyDecay: number }): Promise<any> {
    // For now, we'll store custom pets as a simple JSON record
    // In a real implementation, you might want a dedicated custom_pets table
    return {
      ...pet,
      type: 'custom',
      createdAt: new Date()
    };
  }
}

export const storage = new DatabaseStorage();
