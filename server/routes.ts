import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import { parse } from "cookie";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin, requirePermission, logAdminAction } from "./auth";
import { GameService } from "./services/gameService";
import { EconomyService } from "./services/economyService";
import { FreemiumService } from "./services/freemiumService";
import { filterMessage } from "./utils/profanityFilter";
import rateLimit from "express-rate-limit";
import { AVAILABLE_PETS, getPetById, calculateStatDecay } from "@shared/pets-data";
import { seedPetsData } from "./seed-pets-data";

// Pet 2.0 Validation Schemas
const createRoomSchema = z.object({
  name: z.string().min(1).max(50).optional()
});

const updateRoomSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  floorStyle: z.string().optional(),
  wallStyle: z.string().optional(), 
  doorStyle: z.string().optional(),
  windowStyle: z.string().optional(),
  floorDecorations: z.array(z.any()).optional(),
  wallDecorations: z.array(z.any()).optional()
}).strict(); // Prevent additional fields

const hireSitterSchema = z.object({
  sitterId: z.string().min(1),
  hours: z.number().min(1).max(168) // Max 1 week
});

const trainSkillSchema = z.object({
  skillId: z.string().min(1)
});

const removeFromStasisSchema = z.object({
  roomId: z.string().min(1)
});

const startHuntSchema = z.object({
  huntType: z.enum(['basic', 'rare', 'special']).optional()
});

// Rate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Too many requests" },
  standardHeaders: true,
  legacyHeaders: false,
});

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Apply rate limiting to all API routes
  app.use('/api', apiLimiter);

  // Initialize data on startup
  storage.initializeData().catch(console.error);
  
  // Seed pet sitters and skills data
  seedPetsData().catch(console.error);

  // Economy routes
  app.post('/api/economy/deposit', requireAuth, async (req, res) => {
    try {
      const { amount } = req.body;
      const result = await EconomyService.deposit(req.user!.username, amount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/withdraw', requireAuth, async (req, res) => {
    try {
      const { amount } = req.body;
      const result = await EconomyService.withdraw(req.user!.username, amount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/transfer', requireAuth, async (req, res) => {
    try {
      const { targetUsername, amount, message } = req.body;
      const result = await EconomyService.transfer(req.user!.username, targetUsername, amount, message);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/rob', requireAuth, async (req, res) => {
    try {
      const { targetUsername, betAmount } = req.body;
      const result = await EconomyService.rob(req.user!.username, targetUsername, betAmount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/daily', requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.claimDaily(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/work', requireAuth, async (req, res) => {
    try {
      const { jobType } = req.body;
      const result = await EconomyService.work(req.user!.username, jobType);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/beg', requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.beg(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/search', requireAuth, async (req, res) => {
    try {
      const { location } = req.body;
      const result = await EconomyService.search(req.user!.username, location);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // New earning methods
  app.post('/api/economy/fish', requireAuth, async (req, res) => {
    try {
      const { location } = req.body;
      const result = await EconomyService.fish(req.user!.username, location);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/mine', requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.mine(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/vote', requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.vote(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/adventure', requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.adventure(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // New Dank Memer inspired earning methods
  app.post('/api/economy/crime', requireAuth, async (req, res) => {
    try {
      const { crimeType } = req.body;
      const result = await EconomyService.crime(req.user!.username, crimeType);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/hunt', requireAuth, async (req, res) => {
    try {
      const { huntType } = req.body;
      const result = await EconomyService.hunt(req.user!.username, huntType);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/dig', requireAuth, async (req, res) => {
    try {
      const { location } = req.body;
      const result = await EconomyService.dig(req.user!.username, location);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/postmeme', requireAuth, async (req, res) => {
    try {
      const { memeType } = req.body;
      const result = await EconomyService.postmeme(req.user!.username, memeType);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/highlow', requireAuth, async (req, res) => {
    try {
      const highlowSchema = z.object({
        guess: z.enum(['higher', 'lower']),
        betAmount: z.number().min(10).max(100000)
      });
      
      const { guess, betAmount } = highlowSchema.parse(req.body);
      const result = await EconomyService.highlow(req.user!.username, guess, betAmount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/stream', requireAuth, async (req, res) => {
    try {
      const { gameChoice } = req.body;
      const result = await EconomyService.stream(req.user!.username, gameChoice);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/economy/scratch', requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.scratch(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/economy/achievements/:username', requireAuth, async (req, res) => {
    try {
      const { username } = req.params;
      const result = await EconomyService.checkAchievements(username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Game routes
  app.post('/api/games/blackjack', requireAuth, async (req, res) => {
    try {
      const { bet } = req.body;
      const result = await GameService.playBlackjack(req.user!.username, bet);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/games/slots', requireAuth, async (req, res) => {
    try {
      const { bet } = req.body;
      const result = await GameService.playSlots(req.user!.username, bet);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/games/coinflip', requireAuth, async (req, res) => {
    try {
      const { bet, choice } = req.body;
      const result = await GameService.playCoinflip(req.user!.username, bet, choice);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/games/trivia', requireAuth, async (req, res) => {
    try {
      const result = await GameService.playTrivia(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/games/trivia', requireAuth, async (req, res) => {
    try {
      const { questionId, answer } = req.body;
      const result = await GameService.submitTriviaAnswer(req.user!.username, questionId, answer);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/games/dice', requireAuth, async (req, res) => {
    try {
      const { bet, prediction } = req.body;
      const result = await GameService.playDice(req.user!.username, bet, prediction);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/games/roulette', requireAuth, async (req, res) => {
    try {
      const { bet, betType } = req.body;
      const result = await GameService.playRoulette(req.user!.username, bet, betType);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/games/crash', requireAuth, async (req, res) => {
    try {
      const { bet, cashoutAt } = req.body;
      const result = await GameService.playCrash(req.user!.username, bet, cashoutAt);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Freemium routes
  app.get('/api/freemium/generate', requireAuth, async (req, res) => {
    try {
      const rewards = await FreemiumService.generateRewards(req.user!.username);
      res.json({ rewards });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/freemium/pending', requireAuth, async (req, res) => {
    try {
      const rewards = await FreemiumService.getPendingRewards(req.user!.username);
      res.json({ rewards });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/freemium/claim', requireAuth, async (req, res) => {
    try {
      const { rewardIndex } = req.body;
      if (typeof rewardIndex !== 'number') {
        throw new Error("rewardIndex is required");
      }
      const result = await FreemiumService.claimReward(req.user!.username, rewardIndex);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/freemium/next', requireAuth, async (req, res) => {
    try {
      const nextClaimTime = await FreemiumService.getNextClaimTime(req.user!.username);
      res.json({ nextClaimTime });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Shop routes
  app.get('/api/shop/items', requireAuth, async (req, res) => {
    try {
      const items = await storage.getAllItems();
      res.json(items);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Public items endpoint for displaying item metadata without auth
  app.get('/api/public/items', async (req, res) => {
    try {
      const items = await storage.getAllItems();
      // Return only public metadata needed for display
      const publicItems = items.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        description: item.description
      }));
      res.json(publicItems);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/shop/buy', requireAuth, async (req, res) => {
    try {
      const { itemId, quantity = 1 } = req.body;
      const item = await storage.getItem(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const totalCost = item.currentPrice! * quantity;
      if (user.coins < totalCost) {
        return res.status(400).json({ error: "Insufficient coins" });
      }

      // Update user inventory and coins
      const inventory = user.inventory as any[] || [];
      const existingItem = inventory.find((invItem: any) => invItem.itemId === itemId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        inventory.push({
          itemId,
          quantity,
          equipped: false
        });
      }

      await storage.updateUser(user.id, {
        coins: user.coins - totalCost,
        inventory: inventory
      });

      await storage.createTransaction({
        user: req.user!.username,
        type: 'spend',
        amount: totalCost,
        description: `Bought ${quantity}x ${item.name} for ${totalCost} coins`,
        targetUser: null,
        timestamp: new Date()
      });

      res.json({ 
        success: true, 
        newBalance: user.coins - totalCost,
        item: item.name,
        quantity 
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // User routes
  app.get('/api/user/inventory', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get full item details for inventory
      const inventory = [];
      const userInventory = user.inventory as any[] || [];
      for (const invItem of userInventory) {
        const item = await storage.getItem(invItem.itemId);
        if (item) {
          inventory.push({
            ...item,
            quantity: invItem.quantity,
            equipped: invItem.equipped
          });
        }
      }

      res.json(inventory);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/user/transactions', requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const transactions = await storage.getUserTransactions(req.user!.username, limit);
      res.json(transactions);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/user/notifications', requireAuth, async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(req.user!.username);
      res.json(notifications);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/user/notifications/:id/read', requireAuth, async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Delete a single notification
  app.delete('/api/user/notifications/:id', requireAuth, async (req, res) => {
    try {
      await storage.deleteNotification(req.params.id, req.user!.username);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Clear all notifications for the user
  app.delete('/api/user/notifications', requireAuth, async (req, res) => {
    try {
      await storage.clearAllNotifications(req.user!.username);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/user/profile', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Whitelist only needed profile fields
      const userProfile = {
        id: user.id,
        username: user.username,
        coins: user.coins,
        bank: user.bank,
        bankCapacity: user.bankCapacity,
        level: user.level,
        xp: user.xp,
        inventory: user.inventory,
        friends: user.friends,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        onlineStatus: user.onlineStatus,
        createdAt: user.createdAt || new Date(),
        lastActive: user.lastActive || new Date(),
        achievements: user.achievements,
        gameStats: user.gameStats,
        dailyEarn: user.dailyEarn
      };
      
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/user/profile', requireAuth, async (req, res) => {
    try {
      const profileUpdateSchema = z.object({
        bio: z.string().max(200).optional(),
        avatarUrl: z.string().url().optional().or(z.literal(""))
      });
      
      const updates = profileUpdateSchema.parse(req.body);
      const user = await storage.getUserByUsername(req.user!.username);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Only allow bio and avatarUrl updates for security
      const allowedUpdates: { bio?: string; avatarUrl?: string } = {};
      if (updates.bio !== undefined) allowedUpdates.bio = updates.bio;
      if (updates.avatarUrl !== undefined) allowedUpdates.avatarUrl = updates.avatarUrl;
      
      await storage.updateUser(user.id, allowedUpdates);
      
      const updatedUser = await storage.getUserByUsername(req.user!.username);
      
      // Return whitelisted profile fields
      const userProfile = {
        id: updatedUser!.id,
        username: updatedUser!.username,
        coins: updatedUser!.coins,
        bank: updatedUser!.bank,
        bankCapacity: updatedUser!.bankCapacity,
        level: updatedUser!.level,
        xp: updatedUser!.xp,
        inventory: updatedUser!.inventory,
        friends: updatedUser!.friends,
        bio: updatedUser!.bio,
        avatarUrl: updatedUser!.avatarUrl,
        onlineStatus: updatedUser!.onlineStatus,
        createdAt: updatedUser!.createdAt || new Date(),
        lastActive: updatedUser!.lastActive || new Date(),
        achievements: updatedUser!.achievements,
        gameStats: updatedUser!.gameStats,
        dailyEarn: updatedUser!.dailyEarn
      };
      
      res.json(userProfile);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Public profile route - accessible without authentication
  app.get('/api/user/profile/:username', async (req, res) => {
    try {
      const { username } = req.params;
      
      // Validate username format
      const usernameSchema = z.string().regex(/^[a-zA-Z0-9_]{3,20}$/, "Invalid username format");
      const validatedUsername = usernameSchema.parse(username);
      
      const user = await storage.getUserByUsername(validatedUsername);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Filter out private information for public viewing
      const publicProfile = {
        id: user.id,
        username: user.username,
        level: user.level,
        xp: user.xp,
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        createdAt: (user.createdAt || new Date()).toISOString(),
        lastActive: (user.lastActive || new Date()).toISOString(),
        achievements: user.achievements || [],
        gameStats: user.gameStats || {},
        onlineStatus: user.onlineStatus || false,
        // Show total net worth but not exact coin/bank breakdown for privacy
        netWorth: (user.coins || 0) + (user.bank || 0),
        // Only show public inventory items (no quantities for privacy)
        publicInventory: Array.isArray(user.inventory) 
          ? user.inventory.map((item: any) => ({ itemId: item.itemId }))
          : [],
        // Include admin role for badge display
        adminRole: user.adminRole || 'none'
      };

      res.json(publicProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid username format" });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Leaderboard route
  app.get('/api/leaderboard', requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Pets routes
  app.get('/api/pets/user', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const pets = await storage.getUserPets(user.id);
      res.json(pets);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/pets/adopt', requireAuth, async (req, res) => {
    try {
      const { petId } = req.body;
      
      const petType = getPetById(petId);
      if (!petType) {
        return res.status(404).json({ error: "Pet type not found" });
      }

      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.coins < petType.adoptionCost) {
        return res.status(400).json({ error: "Insufficient coins" });
      }

      // Check if user already owns this pet
      const existingPets = await storage.getUserPets(user.id);
      const alreadyOwned = existingPets.some(pet => pet.petId === petId);
      
      if (alreadyOwned) {
        return res.status(400).json({ error: "You already own this pet" });
      }

      // Deduct adoption cost
      await storage.updateUser(user.id, {
        coins: user.coins - petType.adoptionCost
      });

      // Create adoption transaction
      await storage.createTransaction({
        user: user.username,
        type: 'spend',
        amount: petType.adoptionCost,
        description: `Adopted ${petType.name}`,
        targetUser: null
      });

      // Create the pet
      const pet = await storage.createUserPet({
        userId: user.id,
        petId: petId,
        petName: petType.name,
        hunger: 100,
        hygiene: 100,
        energy: 100,
        fun: 100,
        level: 1,
        xp: 0,
        lastFed: new Date(),
        lastCleaned: new Date(),
        lastPlayed: new Date(),
        lastSlept: new Date(),
        roomId: null, // Pet goes to stasis initially
        inStasis: true,
        thawingUntil: null,
        skills: [],
        isCurrentPet: false,
        isSick: false,
        sicknessType: null,
        huntingUntil: null,
        huntLevel: 1,
        breedingPartnerId: null,
        breedingUntil: null,
        skin: 'default',
        friendlyTo: [],
        hostileTo: []
      });

      res.json(pet);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/pets/:petId/feed', requireAuth, async (req, res) => {
    try {
      const { petId } = req.params;
      
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPets = await storage.getUserPets(user.id);
      const pet = userPets.find(p => p.id === petId);
      
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      const updatedPet = await storage.updateUserPet(petId, {
        hunger: 100,
        lastFed: new Date()
      });

      res.json(updatedPet);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/pets/:petId/clean', requireAuth, async (req, res) => {
    try {
      const { petId } = req.params;
      
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPets = await storage.getUserPets(user.id);
      const pet = userPets.find(p => p.id === petId);
      
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      const updatedPet = await storage.updateUserPet(petId, {
        hygiene: 100,
        lastCleaned: new Date()
      });

      res.json(updatedPet);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/pets/:petId/play', requireAuth, async (req, res) => {
    try {
      const { petId } = req.params;
      
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPets = await storage.getUserPets(user.id);
      const pet = userPets.find(p => p.id === petId);
      
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      const updatedPet = await storage.updateUserPet(petId, {
        fun: 100,
        lastPlayed: new Date()
      });

      res.json(updatedPet);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/pets/:petId/sleep', requireAuth, async (req, res) => {
    try {
      const { petId } = req.params;
      
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPets = await storage.getUserPets(user.id);
      const pet = userPets.find(p => p.id === petId);
      
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      const updatedPet = await storage.updateUserPet(petId, {
        energy: 100,
        lastSlept: new Date()
      });

      res.json(updatedPet);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Pet Rooms API routes
  app.get('/api/pets/rooms', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const rooms = await storage.getUserPetRooms(user.id);
      res.json(rooms);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/pets/rooms', requireAuth, async (req, res) => {
    try {
      const validatedData = createRoomSchema.parse(req.body);
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userRooms = await storage.getUserPetRooms(user.id);
      if (userRooms.length >= 10) {
        return res.status(400).json({ error: "Maximum 10 rooms allowed" });
      }

      const room = await storage.createPetRoom({
        userId: user.id,
        name: validatedData.name || `Room ${userRooms.length + 1}`,
        floorStyle: 'wooden',
        wallStyle: 'plain',
        doorStyle: 'wooden_door',
        windowStyle: 'basic_window',
        floorDecorations: [],
        wallDecorations: [],
        sitterId: null,
        sitterUntil: null
      });

      res.json(room);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.patch('/api/pets/rooms/:roomId', requireAuth, async (req, res) => {
    try {
      const { roomId } = req.params;
      const validatedUpdates = updateRoomSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const room = await storage.getPetRoom(roomId);
      if (!room || room.userId !== user.id) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Only allow updates to safe fields - explicitly exclude protected fields
      const safeUpdates = {
        ...(validatedUpdates.name && { name: validatedUpdates.name }),
        ...(validatedUpdates.floorStyle && { floorStyle: validatedUpdates.floorStyle }),
        ...(validatedUpdates.wallStyle && { wallStyle: validatedUpdates.wallStyle }),
        ...(validatedUpdates.doorStyle && { doorStyle: validatedUpdates.doorStyle }),
        ...(validatedUpdates.windowStyle && { windowStyle: validatedUpdates.windowStyle }),
        ...(validatedUpdates.floorDecorations && { floorDecorations: validatedUpdates.floorDecorations }),
        ...(validatedUpdates.wallDecorations && { wallDecorations: validatedUpdates.wallDecorations })
      };

      const updatedRoom = await storage.updatePetRoom(roomId, safeUpdates);
      res.json(updatedRoom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Pet Sitters API routes
  app.get('/api/pets/sitters', requireAuth, async (req, res) => {
    try {
      const sitters = await storage.getAllPetSitters();
      res.json(sitters);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/pets/rooms/:roomId/sitter', requireAuth, async (req, res) => {
    try {
      const { roomId } = req.params;
      const validatedData = hireSitterSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const room = await storage.getPetRoom(roomId);
      if (!room || room.userId !== user.id) {
        return res.status(404).json({ error: "Room not found" });
      }

      const sitter = await storage.getPetSitter(validatedData.sitterId);
      if (!sitter) {
        return res.status(404).json({ error: "Sitter not found" });
      }

      const totalCost = sitter.hourlyRate * validatedData.hours;
      if (user.coins < totalCost) {
        return res.status(400).json({ error: "Insufficient coins" });
      }

      const sitterUntil = new Date();
      sitterUntil.setHours(sitterUntil.getHours() + validatedData.hours);

      await storage.updateUser(user.id, {
        coins: user.coins - totalCost
      });

      const updatedRoom = await storage.updatePetRoom(roomId, {
        sitterId: validatedData.sitterId,
        sitterUntil: sitterUntil
      });

      res.json(updatedRoom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Pet Skills API routes
  app.get('/api/pets/skills', requireAuth, async (req, res) => {
    try {
      const skills = await storage.getAllPetSkills();
      res.json(skills);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/pets/:petId/train-skill', requireAuth, async (req, res) => {
    try {
      const { petId } = req.params;
      const validatedData = trainSkillSchema.parse(req.body);

      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPets = await storage.getUserPets(user.id);
      const pet = userPets.find(p => p.id === petId);
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      const skill = await storage.getPetSkill(validatedData.skillId);
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }

      if (user.coins < skill.trainingCost) {
        return res.status(400).json({ error: "Insufficient coins" });
      }

      const currentSkills = pet.skills as string[];
      if (currentSkills.includes(validatedData.skillId)) {
        return res.status(400).json({ error: "Pet already has this skill" });
      }

      await storage.updateUser(user.id, {
        coins: user.coins - skill.trainingCost
      });

      const updatedPet = await storage.updateUserPet(petId, {
        skills: [...currentSkills, validatedData.skillId]
      });

      await storage.createPetActivity({
        petId: petId,
        activityType: 'trained',
        description: `Learned the ${skill.name} skill`,
        rewards: []
      });

      res.json(updatedPet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Pet Activities API routes
  app.get('/api/pets/:petId/activities', requireAuth, async (req, res) => {
    try {
      const { petId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPets = await storage.getUserPets(user.id);
      const pet = userPets.find(p => p.id === petId);
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      const activities = await storage.getPetActivities(petId, limit);
      res.json(activities);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/pets/activities', requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const activities = await storage.getUserPetActivities(user.id, limit);
      res.json(activities);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Pet Stasis API routes
  app.post('/api/pets/:petId/stasis', requireAuth, async (req, res) => {
    try {
      const { petId } = req.params;
      
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPets = await storage.getUserPets(user.id);
      const pet = userPets.find(p => p.id === petId);
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      const updatedPet = await storage.updateUserPet(petId, {
        roomId: null,
        inStasis: true
      });

      res.json(updatedPet);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/pets/:petId/remove-from-stasis', requireAuth, async (req, res) => {
    try {
      const { petId } = req.params;
      const validatedData = removeFromStasisSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPets = await storage.getUserPets(user.id);
      const pet = userPets.find(p => p.id === petId);
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      const room = await storage.getPetRoom(validatedData.roomId);
      if (!room || room.userId !== user.id) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Check room capacity (max 5 pets per room)
      const roomPets = await storage.getUserPets(user.id);
      const petsInRoom = roomPets.filter(p => p.roomId === validatedData.roomId);
      if (petsInRoom.length >= 5) {
        return res.status(400).json({ error: "Room is full (max 5 pets)" });
      }

      // Set thawing time (6 hours)
      const thawingUntil = new Date();
      thawingUntil.setHours(thawingUntil.getHours() + 6);

      const updatedPet = await storage.updateUserPet(petId, {
        roomId: validatedData.roomId,
        inStasis: false,
        thawingUntil: thawingUntil
      });

      res.json(updatedPet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Pet Hunting API routes
  app.post('/api/pets/:petId/hunt', requireAuth, async (req, res) => {
    try {
      const { petId } = req.params;
      const validatedData = startHuntSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userPets = await storage.getUserPets(user.id);
      const pet = userPets.find(p => p.id === petId);
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      if (pet.huntingUntil && new Date() < pet.huntingUntil) {
        return res.status(400).json({ error: "Pet is already hunting" });
      }

      const completesAt = new Date();
      completesAt.setHours(completesAt.getHours() + 1); // 1 hour hunt

      const hunt = await storage.createPetHunt({
        petId: petId,
        completesAt: completesAt,
        huntType: validatedData.huntType || 'basic',
        isCompleted: false,
        rewards: []
      });

      await storage.updateUserPet(petId, {
        huntingUntil: completesAt
      });

      res.json(hunt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/pets/hunts', requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const hunts = await storage.getActivePetHunts(user.id);
      res.json(hunts);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Admin routes
  app.get('/api/admin/users', requirePermission('view_users'), async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const users = allUsers.map(user => ({
        id: user.id,
        username: user.username,
        coins: user.coins,
        level: user.level,
        banned: user.banned,
        banReason: user.banReason,
        tempBanUntil: user.tempBanUntil,
        createdAt: user.createdAt
      }));
      
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/admin/users/:id/ban', requirePermission('ban'), async (req, res) => {
    try {
      const { reason } = req.body;
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user has owners badge - they cannot be banned
      const hasOwnersBadge = await EconomyService.hasOwnersBadge(user.username);
      if (hasOwnersBadge) {
        return res.status(403).json({ error: "Cannot ban users with owners badge" });
      }

      await storage.updateUser(user.id, {
        banned: true,
        banReason: reason || "No reason provided"
      });

      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Unban user
  app.post('/api/admin/users/:id/unban', requirePermission('unban'), async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await storage.updateUser(user.id, {
        banned: false,
        banReason: "",
        tempBanUntil: null
      });

      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Temporary ban user
  app.post('/api/admin/users/:id/tempban', requirePermission('tempban'), async (req, res) => {
    try {
      const tempBanSchema = z.object({
        reason: z.string().min(1, "Reason is required"),
        duration: z.union([z.number(), z.string()]).transform(val => {
          const num = typeof val === 'string' ? parseInt(val) : val;
          if (isNaN(num) || num <= 0 || num > 8760) { // Max 1 year
            throw new Error('Invalid duration (must be 1-8760 hours)');
          }
          return num;
        })
      });

      const { reason, duration } = tempBanSchema.parse(req.body);
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user has owners badge - they cannot be banned
      const hasOwnersBadge = await EconomyService.hasOwnersBadge(user.username);
      if (hasOwnersBadge) {
        return res.status(403).json({ error: "Cannot ban users with owners badge" });
      }

      const tempBanUntil = new Date();
      tempBanUntil.setHours(tempBanUntil.getHours() + duration);

      await storage.updateUser(user.id, {
        banned: false, // Keep permanent ban false for temp bans
        banReason: reason,
        tempBanUntil
      });

      res.json({ success: true, message: `User temporarily banned for ${duration} hours` });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Give coins to specific user
  app.post('/api/admin/users/:id/give-coins', requireAdmin, async (req, res) => {
    try {
      const giveCoinsSchema = z.object({
        amount: z.union([z.number(), z.string()]).transform(val => {
          const num = typeof val === 'string' ? parseInt(val) : val;
          if (isNaN(num) || num <= 0) {
            throw new Error('Invalid amount');
          }
          return num;
        })
      });

      const { amount } = giveCoinsSchema.parse(req.body);
      
      // Check permissions based on amount
      let requiredPermission = '';
      if (amount <= 1000) {
        requiredPermission = 'give_coins_small';
      } else if (amount <= 10000) {
        requiredPermission = 'give_coins_medium';
      } else {
        requiredPermission = 'give_coins_large';
      }

      // Verify permission for the coin amount
      const permissionCheck = requirePermission(requiredPermission);
      await new Promise((resolve, reject) => {
        permissionCheck(req, res, (err: any) => {
          if (err) reject(err);
          else resolve(undefined);
        });
      });

      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await storage.updateUser(user.id, {
        coins: user.coins + amount
      });

      await storage.createTransaction({
        user: user.username,
        type: 'earn',
        amount: amount,
        description: `Admin gave ${amount} coins`,
        targetUser: null,
        timestamp: new Date()
      });

      res.json({ success: true, message: `Gave ${amount} coins to ${user.username}` });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Remove coins from specific user
  app.post('/api/admin/users/:id/remove-coins', requirePermission('remove_coins'), async (req, res) => {
    try {
      const removeCoinsSchema = z.object({
        amount: z.union([z.number(), z.string()]).transform(val => {
          const num = typeof val === 'string' ? parseInt(val) : val;
          if (isNaN(num) || num <= 0) {
            throw new Error('Invalid amount');
          }
          return num;
        })
      });

      const { amount } = removeCoinsSchema.parse(req.body);
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user has owners badge - their coins cannot be removed
      const hasOwnersBadge = await EconomyService.hasOwnersBadge(user.username);
      if (hasOwnersBadge) {
        return res.status(403).json({ error: "Cannot remove coins from users with owners badge" });
      }

      // Calculate new coin amount, ensuring it doesn't go below 0
      const newCoins = Math.max(0, user.coins - amount);
      const actualRemoved = user.coins - newCoins;

      await storage.updateUser(user.id, {
        coins: newCoins
      });

      await storage.createTransaction({
        user: user.username,
        type: 'spend',
        amount: actualRemoved,
        description: `Admin removed ${actualRemoved} coins`,
        targetUser: null,
        timestamp: new Date()
      });

      res.json({ 
        success: true, 
        message: `Removed ${actualRemoved} coins from ${user.username}`,
        newBalance: newCoins
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Kick user (force disconnect)
  app.post('/api/admin/users/:id/kick', requirePermission('kick'), async (req, res) => {
    try {
      const { reason } = req.body;
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user's online status
      await storage.updateUser(user.id, {
        onlineStatus: false
      });

      // Send kick notification via WebSocket if connected
      // This would need WebSocket instance access - simplified for now
      
      res.json({ success: true, message: `Kicked user ${user.username}` });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/admin/command', async (req, res) => {
    try {
      const { command } = req.body;
      const [action, ...params] = command.split(' ');

      // Check permissions based on command danger level
      let requiredPermission = '';
      switch (action) {
        case 'resetEconomy':
        case 'clearTransactions':
          requiredPermission = 'reset_economy';
          break;
        case 'giveAll':
          const amount = parseInt(params[0]);
          if (amount > 10000) {
            requiredPermission = 'give_all_unlimited'; // Owner only
          } else {
            requiredPermission = 'give_all_limited'; // Lead Admin+
          }
          break;
        case 'resetUser':
        case 'setLevel':
          requiredPermission = 'reset_user';
          break;
        default:
          return res.status(400).json({ error: "Unknown command" });
      }

      // Verify permission for the specific command
      const permissionCheck = requirePermission(requiredPermission);
      await new Promise((resolve, reject) => {
        permissionCheck(req, res, (err: any) => {
          if (err) reject(err);
          else resolve(undefined);
        });
      });

      switch (action) {
        case 'giveAll':
          const amount = parseInt(params[0]);
          if (isNaN(amount)) {
            return res.status(400).json({ error: "Invalid amount" });
          }

          // Limit amounts based on admin level  
          const maxAmount = req.adminRole === 'owner' ? Infinity : 
                           req.adminRole === 'lead_admin' ? 10000 : 1000;
          
          if (amount > maxAmount) {
            return res.status(403).json({ 
              error: `Amount ${amount} exceeds limit ${maxAmount} for ${req.adminRole}` 
            });
          }

          const allUsers = await storage.getAllUsers();
          let affected = 0;
          
          for (const user of allUsers) {
            if (user && !user.banned) {
              await storage.updateUser(user.id, {
                coins: user.coins + amount
              });
              
              await storage.createTransaction({
                user: user.username,
                type: 'earn',
                amount,
                description: `Admin command: giveAll ${amount}`,
                targetUser: null,
                timestamp: new Date()
              });
              
              affected++;
            }
          }

          res.json({ success: true, message: `Gave ${amount} coins to ${affected} users` });
          break;

        case 'resetUser':
          const resetUsername = params[0];
          if (!resetUsername) {
            return res.status(400).json({ error: "Username required" });
          }

          const resetUser = await storage.getUserByUsername(resetUsername);
          if (!resetUser) {
            return res.status(404).json({ error: "User not found" });
          }

          await storage.updateUser(resetUser.id, {
            coins: 500,
            bank: 0,
            level: 1,
            xp: 0,
            inventory: [],
            achievements: []
          });

          res.json({ success: true, message: `Reset user ${resetUsername} to default state` });
          break;

        case 'setLevel':
          const levelUsername = params[0];
          const newLevel = parseInt(params[1]);
          if (!levelUsername || isNaN(newLevel)) {
            return res.status(400).json({ error: "Usage: setLevel <username> <level>" });
          }

          const levelUser = await storage.getUserByUsername(levelUsername);
          if (!levelUser) {
            return res.status(404).json({ error: "User not found" });
          }

          await storage.updateUser(levelUser.id, {
            level: Math.max(1, newLevel),
            xp: Math.max(0, (newLevel - 1) * 1000) // Rough XP calculation
          });

          res.json({ success: true, message: `Set ${levelUsername} to level ${newLevel}` });
          break;

        case 'clearInventory':
          const invUsername = params[0];
          if (!invUsername) {
            return res.status(400).json({ error: "Username required" });
          }

          const invUser = await storage.getUserByUsername(invUsername);
          if (!invUser) {
            return res.status(404).json({ error: "User not found" });
          }

          await storage.updateUser(invUser.id, {
            inventory: []
          });

          res.json({ success: true, message: `Cleared inventory for ${invUsername}` });
          break;

        case 'clearAllBans':
          const allUsersForUnban = await storage.getAllUsers();
          let unbanned = 0;
          
          for (const user of allUsersForUnban) {
            if (user && (user.banned || user.tempBanUntil)) {
              await storage.updateUser(user.id, {
                banned: false,
                banReason: "",
                tempBanUntil: null
              });
              unbanned++;
            }
          }

          res.json({ success: true, message: `Unbanned ${unbanned} users` });
          break;

        case 'serverMessage':
          const message = params.join(' ');
          if (!message) {
            return res.status(400).json({ error: "Message required" });
          }

          // This would broadcast a server message via WebSocket
          // Simplified implementation for now
          res.json({ success: true, message: `Server message sent: ${message}` });
          break;

        default:
          res.status(400).json({ error: "Unknown command" });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Additional admin routes for enhanced functionality
  app.get('/api/admin/items', requirePermission('view_items'), async (req, res) => {
    try {
      const items = await storage.getAllItems();
      res.json(items);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post('/api/admin/items', requirePermission('manage_items'), async (req, res) => {
    try {
      const itemSchema = z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        price: z.number().min(0),
        type: z.enum(['tool', 'collectible', 'powerup', 'consumable', 'lootbox']),
        rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
        stock: z.number().min(0),
        effects: z.object({
          passive: z.object({
            winRateBoost: z.number().default(0),
            coinsPerHour: z.number().default(0)
          }),
          active: z.object({
            useCooldown: z.number().default(0),
            duration: z.number().default(0),
            effect: z.string().default("")
          })
        }).optional(),
        currentPrice: z.number().optional()
      });

      const itemData = itemSchema.parse(req.body);
      const item = await storage.createItem({
        ...itemData,
        currentPrice: itemData.currentPrice || itemData.price,
        effects: itemData.effects || {
          passive: { winRateBoost: 0, coinsPerHour: 0 },
          active: { useCooldown: 0, duration: 0, effect: "" }
        }
      });
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.put('/api/admin/items/:id', requirePermission('manage_items'), async (req, res) => {
    try {
      const itemSchema = z.object({
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        price: z.number().min(0).optional(),
        type: z.enum(['tool', 'collectible', 'powerup', 'consumable', 'lootbox']).optional(),
        rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']).optional(),
        stock: z.number().min(0).optional(),
        currentPrice: z.number().optional()
      });

      const updates = itemSchema.parse(req.body);
      const item = await storage.updateItem(req.params.id, updates);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.delete('/api/admin/items/:id', requirePermission('manage_items'), async (req, res) => {
    try {
      await storage.deleteItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Pet management endpoints
  app.post('/api/admin/pets', requirePermission('manage_pets'), async (req, res) => {
    try {
      const petSchema = z.object({
        name: z.string().min(1).max(50),
        emoji: z.string().min(1).max(10),
        rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']),
        adoptionCost: z.number().min(0),
        hungerDecay: z.number().min(0).max(100),
        happinessDecay: z.number().min(0).max(100),
        energyDecay: z.number().min(0).max(100)
      });

      const petData = petSchema.parse(req.body);
      
      // Generate unique pet ID
      const petId = `pet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create new pet object
      const newPet = {
        id: petId,
        ...petData
      };

      // Store pet in database as a custom pet
      const customPet = await storage.createCustomPet(newPet);

      // Log admin action
      await logAdminAction(req.user!.username, 'create_pet', { 
        petId,
        petName: petData.name,
        petRarity: petData.rarity 
      });

      res.json({ 
        success: true, 
        message: `Pet "${petData.name}" created successfully!`,
        pet: customPet 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid pet data", details: error.errors });
      }
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Give pet to user endpoint
  app.post('/api/admin/users/:id/give-pet', requirePermission('manage_pets'), async (req, res) => {
    try {
      const petSchema = z.object({
        petId: z.string().min(1),
        petName: z.string().max(50).optional()
      });
      
      const { petId, petName } = petSchema.parse(req.body);

      const targetUser = await storage.getUser(req.params.id);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if pet type exists
      const petType = getPetById(petId);
      if (!petType) {
        return res.status(400).json({ error: "Invalid pet type" });
      }

      // Create the pet
      const pet = await storage.createUserPet({
        userId: targetUser.id,
        petId: petId,
        petName: petName || petType.name,
        hunger: 100,
        hygiene: 100,
        energy: 100,
        fun: 100,
        level: 1,
        xp: 0,
        lastFed: new Date(),
        lastCleaned: new Date(),
        lastPlayed: new Date(),
        lastSlept: new Date(),
        roomId: null,
        inStasis: true,
        thawingUntil: null,
        skills: [],
        isCurrentPet: false,
        isSick: false,
        sicknessType: null,
        huntingUntil: null,
        huntLevel: 1,
        breedingPartnerId: null,
        breedingUntil: null,
        skin: 'default',
        friendlyTo: [],
        hostileTo: []
      });

      // Log admin action
      await logAdminAction({
        adminUsername: req.user!.username,
        adminRole: req.adminRole || 'unknown',
        action: 'give_pet',
        targetType: 'user',
        targetId: targetUser.id,
        targetName: targetUser.username,
        details: { petId, petName: petName || petType.name, petType: petType.name },
        req
      });

      res.json({ 
        success: true, 
        message: `Gave ${petType.name} to ${targetUser.username}`,
        pet 
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Give admin role endpoint
  app.post('/api/admin/users/:id/give-admin', requirePermission('give_admin_roles'), async (req, res) => {
    try {
      const { adminRole } = req.body;
      const validRoles = ['none', 'junior_admin', 'admin', 'senior_admin', 'lead_admin'];
      
      if (!validRoles.includes(adminRole)) {
        return res.status(400).json({ error: "Invalid admin role" });
      }

      const targetUser = await storage.getUser(req.params.id);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if target user is an owner - owners cannot be demoted
      if (targetUser.adminRole === 'owner') {
        return res.status(403).json({ error: "Cannot modify owner permissions" });
      }

      // Check if the requesting admin has permission to grant this role
      const adminUser = await storage.getUserByUsername(req.user!.username);
      if (!adminUser) {
        return res.status(404).json({ error: "Admin user not found" });
      }

      // Check if user has owners badge (special permission)
      const hasOwnersBadge = await EconomyService.hasOwnersBadge(adminUser.username);

      // Permission levels: owner > lead_admin > senior_admin > admin > junior_admin > none
      const roleHierarchy = {
        'owner': 5,
        'lead_admin': 4,
        'senior_admin': 3,
        'admin': 2,
        'junior_admin': 1,
        'none': 0
      };

      const adminLevel = roleHierarchy[adminUser.adminRole as keyof typeof roleHierarchy] || 0;
      const targetLevel = roleHierarchy[adminRole as keyof typeof roleHierarchy] || 0;

      // Special case: Only actual owners can grant owner role (not owners badge holders)
      if (adminRole === 'owner' && adminUser.adminRole !== 'owner') {
        return res.status(403).json({ error: "Only existing owners can grant owner role" });
      }

      // For other admin roles: owners or users with owners badge can grant roles
      if (adminLevel <= targetLevel && adminUser.adminRole !== 'owner' && !hasOwnersBadge) {
        return res.status(403).json({ error: "Insufficient permissions to grant this role" });
      }

      await storage.updateUser(targetUser.id, { adminRole });

      res.json({ 
        success: true, 
        message: `Granted ${adminRole} role to ${targetUser.username}`,
        user: {
          ...targetUser,
          adminRole
        }
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Remove admin role endpoint
  app.post('/api/admin/users/:id/remove-admin', requirePermission('remove_admin_roles'), async (req, res) => {
    try {
      const targetUser = await storage.getUser(req.params.id);
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if target user is an owner - owners cannot be demoted
      if (targetUser.adminRole === 'owner') {
        return res.status(403).json({ error: "Cannot remove owner permissions" });
      }

      // Check admin permissions - only user 'savage' can remove admin roles
      const adminUser = await storage.getUserByUsername(req.user!.username);
      if (!adminUser) {
        return res.status(404).json({ error: "Admin user not found" });
      }

      // Only user 'savage' can remove admin access
      if (adminUser.username !== 'savage') {
        return res.status(403).json({ error: "Only user 'savage' can remove admin access" });
      }

      await storage.updateUser(targetUser.id, { adminRole: 'none' });

      res.json({ 
        success: true, 
        message: `Removed admin role from ${targetUser.username}`,
        user: {
          ...targetUser,
          adminRole: 'none'
        }
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/admin/transactions', requirePermission('view_transactions'), async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const allUsers = await storage.getAllUsers();
      let allTransactions = [];
      
      for (const user of allUsers) {
        const userTransactions = await storage.getUserTransactions(user.username, limit);
        allTransactions.push(...userTransactions);
      }
      
      // Sort by timestamp and limit
      allTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.json(allTransactions.slice(0, limit));
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get('/api/admin/analytics', requirePermission('view_analytics'), async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const allItems = await storage.getAllItems();
      
      // Calculate analytics
      const totalUsers = allUsers.length;
      const activeUsers = allUsers.filter(u => !u.banned).length;
      const bannedUsers = allUsers.filter(u => u.banned).length;
      const totalCoins = allUsers.reduce((sum, u) => sum + u.coins + u.bank, 0);
      const avgLevel = Math.round(allUsers.reduce((sum, u) => sum + u.level, 0) / totalUsers || 0);
      
      // Recent activity (users created in last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentUsers = allUsers.filter(u => new Date(u.createdAt) > weekAgo).length;
      
      res.json({
        users: {
          total: totalUsers,
          active: activeUsers,
          banned: bannedUsers,
          recent: recentUsers
        },
        economy: {
          totalCoins,
          avgLevel,
          totalItems: allItems.length
        },
        system: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          timestamp: new Date()
        }
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Grant owners badge to specific user
  app.post('/api/admin/users/:username/grant-owners-badge', requirePermission('give_admin_roles'), async (req, res) => {
    try {
      const username = req.params.username;
      await EconomyService.grantOwnersBadge(username);
      res.json({ 
        success: true, 
        message: `Owners badge granted to ${username}` 
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time features with session authentication
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws'
  });
  
  wss.on('connection', (ws: WebSocket, req) => {
    let authenticatedUsername: string | null = null;
    
    // Extract session from cookies to authenticate user
    const extractUserFromSession = async (req: any): Promise<string | null> => {
      try {
        if (!req.headers.cookie) return null;
        
        const cookies = parse(req.headers.cookie);
        const sessionId = cookies['connect.sid'];
        
        if (!sessionId) return null;
        
        // Extract session ID (remove signature if present)
        const cleanSessionId = sessionId.startsWith('s:') ? sessionId.slice(2).split('.')[0] : sessionId;
        
        return new Promise((resolve) => {
          storage.sessionStore.get(cleanSessionId, (err, session: any) => {
            if (err || !session || !session.passport || !session.passport.user) {
              resolve(null);
            } else {
              resolve(session.passport.user.username);
            }
          });
        });
      } catch (error) {
        return null;
      }
    };
    
    ws.on('message', async (data: string) => {
      try {
        const message = JSON.parse(data);
        
        // Handle different message types
        switch (message.type) {
          case 'auth':
            // Authenticate user from session
            authenticatedUsername = await extractUserFromSession(req);
            if (authenticatedUsername) {
              ws.send(JSON.stringify({
                type: 'auth_success',
                username: authenticatedUsername
              }));
            } else {
              ws.send(JSON.stringify({
                type: 'auth_error',
                message: 'Not authenticated or session expired'
              }));
            }
            break;
            
          case 'chat':
            // Check if user is authenticated
            if (!authenticatedUsername) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Must be authenticated to send messages'
              }));
              break;
            }
            
            // Filter message for profanity first
            const filterResult = filterMessage(message.message);
            if (!filterResult.allowed) {
              // Send error back to the sender only
              ws.send(JSON.stringify({
                type: 'error',
                message: filterResult.reason || "Message blocked due to inappropriate content"
              }));
              break;
            }
            
            // Store message in database using authenticated username
            const chatMessage = await storage.createChatMessage({
              username: authenticatedUsername,
              message: message.message
            });
            
            // Broadcast to all connected clients with the stored message ID
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'chat',
                  id: chatMessage.id,
                  username: authenticatedUsername,
                  message: message.message,
                  timestamp: Date.now()
                }));
              }
            });
            break;
            
          case 'delete_message':
            // Check if user is authenticated and is "savage"
            if (!authenticatedUsername) {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Must be authenticated to delete messages'
              }));
              break;
            }
            
            if (authenticatedUsername === 'savage') {
              await storage.deleteChatMessage(message.messageId);
              
              // Broadcast deletion to all clients
              wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    type: 'message_deleted',
                    messageId: message.messageId,
                    deletedBy: authenticatedUsername
                  }));
                }
              });
            } else {
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Only savage can delete messages'
              }));
            }
            break;
            
          case 'join':
            ws.send(JSON.stringify({
              type: 'system',
              message: 'Connected to Funny Economy chat!'
            }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return httpServer;
}
