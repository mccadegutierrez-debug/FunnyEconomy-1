import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import session from "express-session";
import { parse } from "cookie";
import { z } from "zod";
import { storage } from "./storage";
import {
  setupAuth,
  requireAuth,
  requireAdmin,
  requirePermission,
  logAdminAction,
} from "./auth";
import { GameService } from "./services/gameService";
import { EconomyService } from "./services/economyService";
import { FreemiumService } from "./services/freemiumService";
import { filterMessage } from "./utils/profanityFilter";
import { seedPetData } from "./seed-pet-data";
import rateLimit from "express-rate-limit";

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

  // Seed pet data on startup
  seedPetData().catch(console.error);

  // Apply rate limiting to all API routes
  app.use("/api", apiLimiter);

  // Initialize data on startup
  storage.initializeData().catch(console.error);
  storage.initializeFeatureFlags().catch(console.error);

  // Economy routes
  app.post("/api/economy/deposit", requireAuth, async (req, res) => {
    try {
      const { amount } = req.body;
      const result = await EconomyService.deposit(req.user!.username, amount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/withdraw", requireAuth, async (req, res) => {
    try {
      const { amount } = req.body;
      const result = await EconomyService.withdraw(req.user!.username, amount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/transfer", requireAuth, async (req, res) => {
    try {
      const { targetUsername, amount, message } = req.body;
      const result = await EconomyService.transfer(
        req.user!.username,
        targetUsername,
        amount,
        message,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/rob", requireAuth, async (req, res) => {
    try {
      const { targetUsername, betAmount } = req.body;
      const result = await EconomyService.rob(
        req.user!.username,
        targetUsername,
        betAmount,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/daily", requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.claimDaily(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/work", requireAuth, async (req, res) => {
    try {
      const { jobType } = req.body;
      const result = await EconomyService.work(req.user!.username, jobType);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/beg", requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.beg(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/search", requireAuth, async (req, res) => {
    try {
      const { location } = req.body;
      const result = await EconomyService.search(req.user!.username, location);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // New earning methods
  app.post("/api/economy/fish", requireAuth, async (req, res) => {
    try {
      const { location } = req.body;
      const result = await EconomyService.fish(req.user!.username, location);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/mine", requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.mine(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/vote", requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.vote(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/adventure", requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.adventure(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // New Dank Memer inspired earning methods
  app.post("/api/economy/crime", requireAuth, async (req, res) => {
    try {
      const { crimeType } = req.body;
      const result = await EconomyService.crime(req.user!.username, crimeType);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/hunt", requireAuth, async (req, res) => {
    try {
      const { huntType } = req.body;
      const result = await EconomyService.hunt(req.user!.username, huntType);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/dig", requireAuth, async (req, res) => {
    try {
      const { location } = req.body;
      const result = await EconomyService.dig(req.user!.username, location);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/postmeme", requireAuth, async (req, res) => {
    try {
      const { memeType } = req.body;
      const result = await EconomyService.postmeme(
        req.user!.username,
        memeType,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/highlow", requireAuth, async (req, res) => {
    try {
      const highlowSchema = z.object({
        guess: z.enum(["higher", "lower"]),
        betAmount: z.number().min(10).max(100000),
      });

      const { guess, betAmount } = highlowSchema.parse(req.body);
      const result = await EconomyService.highlow(
        req.user!.username,
        guess,
        betAmount,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/stream", requireAuth, async (req, res) => {
    try {
      const { gameChoice } = req.body;
      const result = await EconomyService.stream(
        req.user!.username,
        gameChoice,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/economy/scratch", requireAuth, async (req, res) => {
    try {
      const result = await EconomyService.scratch(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get(
    "/api/economy/achievements/:username",
    requireAuth,
    async (req, res) => {
      try {
        const { username } = req.params;
        const result = await EconomyService.checkAchievements(username);
        res.json(result);
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Game routes
  app.post("/api/games/blackjack", requireAuth, async (req, res) => {
    try {
      const { bet } = req.body;
      const result = await GameService.playBlackjack(req.user!.username, bet);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/games/slots", requireAuth, async (req, res) => {
    try {
      const { bet } = req.body;
      const result = await GameService.playSlots(req.user!.username, bet);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/games/coinflip", requireAuth, async (req, res) => {
    try {
      const { bet, choice } = req.body;
      const result = await GameService.playCoinflip(
        req.user!.username,
        bet,
        choice,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/games/trivia", requireAuth, async (req, res) => {
    try {
      const result = await GameService.playTrivia(req.user!.username);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/games/trivia", requireAuth, async (req, res) => {
    try {
      const { questionId, answer } = req.body;
      const result = await GameService.submitTriviaAnswer(
        req.user!.username,
        questionId,
        answer,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/games/dice", requireAuth, async (req, res) => {
    try {
      const { bet, prediction } = req.body;
      const result = await GameService.playDice(
        req.user!.username,
        bet,
        prediction,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/games/roulette", requireAuth, async (req, res) => {
    try {
      const { bet, betType } = req.body;
      const result = await GameService.playRoulette(
        req.user!.username,
        bet,
        betType,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/games/crash", requireAuth, async (req, res) => {
    try {
      const { bet, cashoutAt } = req.body;
      const result = await GameService.playCrash(
        req.user!.username,
        bet,
        cashoutAt,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/games/lottery", requireAuth, async (req, res) => {
    try {
      const { bet, numbers } = req.body;
      const result = await GameService.playLottery(
        req.user!.username,
        bet,
        numbers,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/games/mines", requireAuth, async (req, res) => {
    try {
      const { bet, tilesRevealed } = req.body;
      const result = await GameService.playMines(
        req.user!.username,
        bet,
        tilesRevealed,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/games/plinko", requireAuth, async (req, res) => {
    try {
      const { bet, risk } = req.body;
      const result = await GameService.playPlinko(
        req.user!.username,
        bet,
        risk,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Freemium routes
  app.get("/api/freemium/generate", requireAuth, async (req, res) => {
    try {
      const rewards = await FreemiumService.generateRewards(req.user!.username);
      res.json({ rewards });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/freemium/pending", requireAuth, async (req, res) => {
    try {
      const rewards = await FreemiumService.getPendingRewards(
        req.user!.username,
      );
      res.json({ rewards });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/freemium/claim", requireAuth, async (req, res) => {
    try {
      const { rewardIndex } = req.body;
      if (typeof rewardIndex !== "number") {
        throw new Error("rewardIndex is required");
      }
      const result = await FreemiumService.claimReward(
        req.user!.username,
        rewardIndex,
      );
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/freemium/next", requireAuth, async (req, res) => {
    try {
      const nextClaimTime = await FreemiumService.getNextClaimTime(
        req.user!.username,
      );
      res.json({ nextClaimTime });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Shop routes
  app.get("/api/shop/items", requireAuth, async (req, res) => {
    try {
      const items = await storage.getAllItems();
      res.json(items);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Public items endpoint for displaying item metadata without auth
  app.get("/api/public/items", async (req, res) => {
    try {
      const items = await storage.getAllItems();
      // Return only public metadata needed for display
      const publicItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        rarity: item.rarity,
        description: item.description,
      }));
      res.json(publicItems);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/shop/buy", requireAuth, async (req, res) => {
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
      const inventory = (user.inventory as any[]) || [];
      const existingItem = inventory.find(
        (invItem: any) => invItem.itemId === itemId,
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        inventory.push({
          itemId,
          quantity,
          equipped: false,
        });
      }

      await storage.updateUser(user.id, {
        coins: user.coins - totalCost,
        inventory: inventory,
      });

      await storage.createTransaction({
        user: req.user!.username,
        type: "spend",
        amount: totalCost,
        description: `Bought ${quantity}x ${item.name} for ${totalCost} coins`,
        targetUser: null,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        newBalance: user.coins - totalCost,
        item: item.name,
        quantity,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // User routes
  app.get("/api/user/inventory", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get full item details for inventory
      const inventory = [];
      const userInventory = (user.inventory as any[]) || [];
      for (const invItem of userInventory) {
        const item = await storage.getItem(invItem.itemId);
        if (item) {
          inventory.push({
            ...item,
            quantity: invItem.quantity,
            equipped: invItem.equipped,
          });
        }
      }

      res.json(inventory);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/inventory/equip/:itemId", requireAuth, async (req, res) => {
    try {
      const { itemId } = req.params;
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const inventoryItem = user.inventory.find(
        (item: any) => item.itemId === itemId,
      );
      if (!inventoryItem) {
        return res.status(404).json({ error: "Item not found in inventory" });
      }

      const itemDetails = await storage.getItem(itemId);
      if (!itemDetails) {
        return res.status(404).json({ error: "Item details not found" });
      }

      if (itemDetails.type !== "tool" && itemDetails.type !== "powerup") {
        return res
          .status(400)
          .json({ error: "Only tools and powerups can be equipped" });
      }

      // Toggle equipped status
      const updatedInventory = user.inventory.map((item: any) => ({
        ...item,
        equipped:
          item.itemId === itemId ? !inventoryItem.equipped : item.equipped,
      }));

      await storage.updateUser(user.id, {
        inventory: updatedInventory,
      });

      res.json({
        success: true,
        message: inventoryItem.equipped
          ? `${itemDetails.name} unequipped!`
          : `${itemDetails.name} equipped!`,
        equipped: !inventoryItem.equipped,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/inventory/use/:itemId", requireAuth, async (req, res) => {
    try {
      const { itemId } = req.params;
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const inventoryItem = user.inventory.find(
        (item: any) => item.itemId === itemId,
      );
      if (!inventoryItem) {
        return res.status(404).json({ error: "Item not found in inventory" });
      }

      const itemDetails = await storage.getItem(itemId);
      if (!itemDetails) {
        return res.status(404).json({ error: "Item details not found" });
      }

      if (itemDetails.type === "lootbox") {
        // Open lootbox
        const rewards = [
          { name: "Common Coin Pile", coins: 100, rarity: "common" },
          { name: "Rare Gem", coins: 500, rarity: "rare" },
          { name: "Epic Trophy", coins: 1000, rarity: "epic" },
          { name: "Legendary Treasure", coins: 2500, rarity: "legendary" },
        ];

        const random = Math.random();
        let reward;
        if (random < 0.5) reward = rewards[0];
        else if (random < 0.8) reward = rewards[1];
        else if (random < 0.95) reward = rewards[2];
        else reward = rewards[3];

        await storage.updateUser(user.id, {
          coins: user.coins + reward.coins,
          inventory: user.inventory
            .map((item: any) =>
              item.itemId === itemId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item: any) => item.quantity > 0),
        });

        return res.json({
          success: true,
          message: `You opened the ${itemDetails.name} and got ${reward.name}! +${reward.coins} coins!`,
          reward: reward,
        });
      } else if (itemDetails.type === "consumable") {
        // Use consumable
        const effects = itemDetails.effects as any;
        const consumableEffect = effects?.consumableEffect;

        await storage.updateUser(user.id, {
          inventory: user.inventory
            .map((item: any) =>
              item.itemId === itemId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item: any) => item.quantity > 0),
        });

        return res.json({
          success: true,
          message: `You used ${itemDetails.name}! ${consumableEffect?.type || "Effect applied"}!`,
          effect: consumableEffect,
        });
      } else if (
        itemDetails.type === "tool" ||
        itemDetails.type === "powerup"
      ) {
        // Equip instead
        return res
          .status(400)
          .json({ error: "Use the equip endpoint for tools and powerups" });
      }

      res.status(400).json({ error: "This item cannot be used" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/user/transactions", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const transactions = await storage.getUserTransactions(
        req.user!.username,
        limit,
      );
      res.json(transactions);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/user/notifications", requireAuth, async (req, res) => {
    try {
      const notifications = await storage.getUserNotifications(
        req.user!.username,
      );
      res.json(notifications);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post(
    "/api/user/notifications/:id/read",
    requireAuth,
    async (req, res) => {
      try {
        await storage.markNotificationRead(req.params.id);
        res.json({ success: true });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Delete a single notification
  app.delete("/api/user/notifications/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteNotification(req.params.id, req.user!.username);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Clear all notifications for the user
  app.delete("/api/user/notifications", requireAuth, async (req, res) => {
    try {
      await storage.clearAllNotifications(req.user!.username);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.user!.username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
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
        dailyEarn: user.dailyEarn,
      };

      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const profileUpdateSchema = z.object({
        bio: z.string().max(200).optional(),
        avatarUrl: z.string().url().optional().or(z.literal("")),
      });

      const updates = profileUpdateSchema.parse(req.body);
      const user = await storage.getUserByUsername(req.user!.username);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Only allow bio and avatarUrl updates for security
      const allowedUpdates: { bio?: string; avatarUrl?: string } = {};
      if (updates.bio !== undefined) allowedUpdates.bio = updates.bio;
      if (updates.avatarUrl !== undefined)
        allowedUpdates.avatarUrl = updates.avatarUrl;

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
        dailyEarn: updatedUser!.dailyEarn,
      };

      res.json(userProfile);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Public profile route - accessible without authentication
  app.get("/api/user/profile/:username", async (req, res) => {
    try {
      const { username } = req.params;

      // Validate username format
      const usernameSchema = z
        .string()
        .regex(/^[a-zA-Z0-9_]{3,20}$/, "Invalid username format");
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
        adminRole: user.adminRole || "none",
      };

      res.json(publicProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid username format" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Leaderboard route
  app.get("/api/leaderboard", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Admin routes
  app.get(
    "/api/admin/users",
    requirePermission("view_users"),
    async (req, res) => {
      try {
        const allUsers = await storage.getAllUsers();
        const users = allUsers.map((user) => ({
          id: user.id,
          username: user.username,
          coins: user.coins,
          level: user.level,
          banned: user.banned,
          banReason: user.banReason,
          tempBanUntil: user.tempBanUntil,
          createdAt: user.createdAt,
        }));

        res.json(users);
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  app.post(
    "/api/admin/users/:id/ban",
    requirePermission("ban"),
    async (req, res) => {
      try {
        const { reason } = req.body;
        const user = await storage.getUser(req.params.id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Check if user has owners badge - they cannot be banned
        const hasOwnersBadge = await EconomyService.hasOwnersBadge(
          user.username,
        );
        if (hasOwnersBadge) {
          return res
            .status(403)
            .json({ error: "Cannot ban users with owners badge" });
        }

        await storage.updateUser(user.id, {
          banned: true,
          banReason: reason || "No reason provided",
        });

        res.json({ success: true });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Unban user
  app.post(
    "/api/admin/users/:id/unban",
    requirePermission("unban"),
    async (req, res) => {
      try {
        const user = await storage.getUser(req.params.id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        await storage.updateUser(user.id, {
          banned: false,
          banReason: "",
          tempBanUntil: null,
        });

        res.json({ success: true });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Temporary ban user
  app.post(
    "/api/admin/users/:id/tempban",
    requirePermission("tempban"),
    async (req, res) => {
      try {
        const tempBanSchema = z.object({
          reason: z.string().min(1, "Reason is required"),
          duration: z.union([z.number(), z.string()]).transform((val) => {
            const num = typeof val === "string" ? parseInt(val) : val;
            if (isNaN(num) || num <= 0 || num > 8760) {
              // Max 1 year
              throw new Error("Invalid duration (must be 1-8760 hours)");
            }
            return num;
          }),
        });

        const { reason, duration } = tempBanSchema.parse(req.body);
        const user = await storage.getUser(req.params.id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Check if user has owners badge - they cannot be banned
        const hasOwnersBadge = await EconomyService.hasOwnersBadge(
          user.username,
        );
        if (hasOwnersBadge) {
          return res
            .status(403)
            .json({ error: "Cannot ban users with owners badge" });
        }

        const tempBanUntil = new Date();
        tempBanUntil.setHours(tempBanUntil.getHours() + duration);

        await storage.updateUser(user.id, {
          banned: false, // Keep permanent ban false for temp bans
          banReason: reason,
          tempBanUntil,
        });

        res.json({
          success: true,
          message: `User temporarily banned for ${duration} hours`,
        });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Give coins to specific user
  app.post(
    "/api/admin/users/:id/give-coins",
    requireAdmin,
    async (req, res) => {
      try {
        const giveCoinsSchema = z.object({
          amount: z.union([z.number(), z.string()]).transform((val) => {
            const num = typeof val === "string" ? parseInt(val) : val;
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid amount");
            }
            return num;
          }),
        });

        const { amount } = giveCoinsSchema.parse(req.body);

        // Check permissions based on amount
        let requiredPermission = "";
        if (amount <= 1000) {
          requiredPermission = "give_coins_small";
        } else if (amount <= 10000) {
          requiredPermission = "give_coins_medium";
        } else {
          requiredPermission = "give_coins_large";
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
          coins: user.coins + amount,
        });

        await storage.createTransaction({
          user: user.username,
          type: "earn",
          amount: amount,
          description: `Admin gave ${amount} coins`,
          targetUser: null,
          timestamp: new Date(),
        });

        res.json({
          success: true,
          message: `Gave ${amount} coins to ${user.username}`,
        });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Remove coins from specific user
  app.post(
    "/api/admin/users/:id/remove-coins",
    requirePermission("remove_coins"),
    async (req, res) => {
      try {
        const removeCoinsSchema = z.object({
          amount: z.union([z.number(), z.string()]).transform((val) => {
            const num = typeof val === "string" ? parseInt(val) : val;
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid amount");
            }
            return num;
          }),
        });

        const { amount } = removeCoinsSchema.parse(req.body);
        const user = await storage.getUser(req.params.id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Check if user has owners badge - their coins cannot be removed
        const hasOwnersBadge = await EconomyService.hasOwnersBadge(
          user.username,
        );
        if (hasOwnersBadge) {
          return res
            .status(403)
            .json({
              error: "Cannot remove coins from users with owners badge",
            });
        }

        // Calculate new coin amount, ensuring it doesn't go below 0
        const newCoins = Math.max(0, user.coins - amount);
        const actualRemoved = user.coins - newCoins;

        await storage.updateUser(user.id, {
          coins: newCoins,
        });

        await storage.createTransaction({
          user: user.username,
          type: "spend",
          amount: actualRemoved,
          description: `Admin removed ${actualRemoved} coins`,
          targetUser: null,
          timestamp: new Date(),
        });

        res.json({
          success: true,
          message: `Removed ${actualRemoved} coins from ${user.username}`,
          newBalance: newCoins,
        });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Kick user (force disconnect)
  app.post(
    "/api/admin/users/:id/kick",
    requirePermission("kick"),
    async (req, res) => {
      try {
        const { reason } = req.body;
        const user = await storage.getUser(req.params.id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Update user's online status
        await storage.updateUser(user.id, {
          onlineStatus: false,
        });

        // Send kick notification via WebSocket if connected
        // This would need WebSocket instance access - simplified for now

        res.json({ success: true, message: `Kicked user ${user.username}` });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  app.post("/api/admin/command", async (req, res) => {
    try {
      const { command } = req.body;
      const [action, ...params] = command.split(" ");

      // Check permissions based on command danger level
      let requiredPermission = "";
      switch (action) {
        case "resetEconomy":
        case "clearTransactions":
          requiredPermission = "reset_economy";
          break;
        case "giveAll":
          const amount = parseInt(params[0]);
          if (amount > 10000) {
            requiredPermission = "give_all_unlimited"; // Owner only
          } else {
            requiredPermission = "give_all_limited"; // Lead Admin+
          }
          break;
        case "resetUser":
        case "setLevel":
          requiredPermission = "reset_user";
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
        case "giveAll":
          const amount = parseInt(params[0]);
          if (isNaN(amount)) {
            return res.status(400).json({ error: "Invalid amount" });
          }

          // Limit amounts based on admin level
          const maxAmount =
            req.adminRole === "owner"
              ? Infinity
              : req.adminRole === "lead_admin"
                ? 10000
                : 1000;

          if (amount > maxAmount) {
            return res.status(403).json({
              error: `Amount ${amount} exceeds limit ${maxAmount} for ${req.adminRole}`,
            });
          }

          const allUsers = await storage.getAllUsers();
          let affected = 0;

          for (const user of allUsers) {
            if (user && !user.banned) {
              await storage.updateUser(user.id, {
                coins: user.coins + amount,
              });

              await storage.createTransaction({
                user: user.username,
                type: "earn",
                amount,
                description: `Admin command: giveAll ${amount}`,
                targetUser: null,
                timestamp: new Date(),
              });

              affected++;
            }
          }

          res.json({
            success: true,
            message: `Gave ${amount} coins to ${affected} users`,
          });
          break;

        case "resetUser":
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
            achievements: [],
          });

          res.json({
            success: true,
            message: `Reset user ${resetUsername} to default state`,
          });
          break;

        case "setLevel":
          const levelUsername = params[0];
          const newLevel = parseInt(params[1]);
          if (!levelUsername || isNaN(newLevel)) {
            return res
              .status(400)
              .json({ error: "Usage: setLevel <username> <level>" });
          }

          const levelUser = await storage.getUserByUsername(levelUsername);
          if (!levelUser) {
            return res.status(404).json({ error: "User not found" });
          }

          await storage.updateUser(levelUser.id, {
            level: Math.max(1, newLevel),
            xp: Math.max(0, (newLevel - 1) * 1000), // Rough XP calculation
          });

          res.json({
            success: true,
            message: `Set ${levelUsername} to level ${newLevel}`,
          });
          break;

        case "clearInventory":
          const invUsername = params[0];
          if (!invUsername) {
            return res.status(400).json({ error: "Username required" });
          }

          const invUser = await storage.getUserByUsername(invUsername);
          if (!invUser) {
            return res.status(404).json({ error: "User not found" });
          }

          await storage.updateUser(invUser.id, {
            inventory: [],
          });

          res.json({
            success: true,
            message: `Cleared inventory for ${invUsername}`,
          });
          break;

        case "clearAllBans":
          const allUsersForUnban = await storage.getAllUsers();
          let unbanned = 0;

          for (const user of allUsersForUnban) {
            if (user && (user.banned || user.tempBanUntil)) {
              await storage.updateUser(user.id, {
                banned: false,
                banReason: "",
                tempBanUntil: null,
              });
              unbanned++;
            }
          }

          res.json({ success: true, message: `Unbanned ${unbanned} users` });
          break;

        case "serverMessage":
          const message = params.join(" ");
          if (!message) {
            return res.status(400).json({ error: "Message required" });
          }

          // This would broadcast a server message via WebSocket
          // Simplified implementation for now
          res.json({
            success: true,
            message: `Server message sent: ${message}`,
          });
          break;

        default:
          res.status(400).json({ error: "Unknown command" });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Additional admin routes for enhanced functionality
  app.get(
    "/api/admin/items",
    requirePermission("view_items"),
    async (req, res) => {
      try {
        const items = await storage.getAllItems();
        res.json(items);
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  app.post(
    "/api/admin/items",
    requirePermission("manage_items"),
    async (req, res) => {
      try {
        const itemSchema = z.object({
          name: z.string().min(1),
          description: z.string().min(1),
          price: z.number().min(0),
          type: z.enum([
            "tool",
            "collectible",
            "powerup",
            "consumable",
            "lootbox",
          ]),
          rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
          stock: z.number().min(0),
          effects: z
            .object({
              passive: z.object({
                winRateBoost: z.number().default(0),
                coinsPerHour: z.number().default(0),
              }),
              active: z.object({
                useCooldown: z.number().default(0),
                duration: z.number().default(0),
                effect: z.string().default(""),
              }),
            })
            .optional(),
          currentPrice: z.number().optional(),
        });

        const itemData = itemSchema.parse(req.body);
        const item = await storage.createItem({
          ...itemData,
          currentPrice: itemData.currentPrice || itemData.price,
          effects: itemData.effects || {
            passive: { winRateBoost: 0, coinsPerHour: 0 },
            active: { useCooldown: 0, duration: 0, effect: "" },
          },
        });
        res.json(item);
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  app.put(
    "/api/admin/items/:id",
    requirePermission("manage_items"),
    async (req, res) => {
      try {
        const itemSchema = z.object({
          name: z.string().min(1).optional(),
          description: z.string().min(1).optional(),
          price: z.number().min(0).optional(),
          type: z
            .enum(["tool", "collectible", "powerup", "consumable", "lootbox"])
            .optional(),
          rarity: z
            .enum(["common", "uncommon", "rare", "epic", "legendary"])
            .optional(),
          stock: z.number().min(0).optional(),
          currentPrice: z.number().optional(),
        });

        const updates = itemSchema.parse(req.body);
        const item = await storage.updateItem(req.params.id, updates);
        res.json(item);
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  app.delete(
    "/api/admin/items/:id",
    requirePermission("manage_items"),
    async (req, res) => {
      try {
        await storage.deleteItem(req.params.id);
        res.json({ success: true });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Give admin role endpoint
  app.post(
    "/api/admin/users/:id/give-admin",
    requirePermission("give_admin_roles"),
    async (req, res) => {
      try {
        const { adminRole } = req.body;
        const validRoles = [
          "none",
          "junior_admin",
          "admin",
          "senior_admin",
          "lead_admin",
        ];

        if (!validRoles.includes(adminRole)) {
          return res.status(400).json({ error: "Invalid admin role" });
        }

        const targetUser = await storage.getUser(req.params.id);
        if (!targetUser) {
          return res.status(404).json({ error: "User not found" });
        }

        // Check if target user is an owner - owners cannot be demoted
        if (targetUser.adminRole === "owner") {
          return res
            .status(403)
            .json({ error: "Cannot modify owner permissions" });
        }

        // Check if the requesting admin has permission to grant this role
        const adminUser = await storage.getUserByUsername(req.user!.username);
        if (!adminUser) {
          return res.status(404).json({ error: "Admin user not found" });
        }

        // Check if user has owners badge (special permission)
        const hasOwnersBadge = await EconomyService.hasOwnersBadge(
          adminUser.username,
        );

        // Permission levels: owner > lead_admin > senior_admin > admin > junior_admin > none
        const roleHierarchy = {
          owner: 5,
          lead_admin: 4,
          senior_admin: 3,
          admin: 2,
          junior_admin: 1,
          none: 0,
        };

        const adminLevel =
          roleHierarchy[adminUser.adminRole as keyof typeof roleHierarchy] || 0;
        const targetLevel =
          roleHierarchy[adminRole as keyof typeof roleHierarchy] || 0;

        // Special case: Only actual owners can grant owner role (not owners badge holders)
        if (adminRole === "owner" && adminUser.adminRole !== "owner") {
          return res
            .status(403)
            .json({ error: "Only existing owners can grant owner role" });
        }

        // For other admin roles: owners or users with owners badge can grant roles
        if (
          adminLevel <= targetLevel &&
          adminUser.adminRole !== "owner" &&
          !hasOwnersBadge
        ) {
          return res
            .status(403)
            .json({ error: "Insufficient permissions to grant this role" });
        }

        await storage.updateUser(targetUser.id, { adminRole });

        res.json({
          success: true,
          message: `Granted ${adminRole} role to ${targetUser.username}`,
          user: {
            ...targetUser,
            adminRole,
          },
        });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Remove admin role endpoint
  app.post(
    "/api/admin/users/:id/remove-admin",
    requirePermission("remove_admin_roles"),
    async (req, res) => {
      try {
        const targetUser = await storage.getUser(req.params.id);
        if (!targetUser) {
          return res.status(404).json({ error: "User not found" });
        }

        // Check if target user is an owner - owners cannot be demoted
        if (targetUser.adminRole === "owner") {
          return res
            .status(403)
            .json({ error: "Cannot remove owner permissions" });
        }

        // Check admin permissions - only user 'savage' can remove admin roles
        const adminUser = await storage.getUserByUsername(req.user!.username);
        if (!adminUser) {
          return res.status(404).json({ error: "Admin user not found" });
        }

        // Only user 'savage' can remove admin access
        if (adminUser.username !== "savage") {
          return res
            .status(403)
            .json({ error: "Only user 'savage' can remove admin access" });
        }

        await storage.updateUser(targetUser.id, { adminRole: "none" });

        res.json({
          success: true,
          message: `Removed admin role from ${targetUser.username}`,
          user: {
            ...targetUser,
            adminRole: "none",
          },
        });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  app.get(
    "/api/admin/transactions",
    requirePermission("view_transactions"),
    async (req, res) => {
      try {
        const limit = parseInt(req.query.limit as string) || 50;
        const allUsers = await storage.getAllUsers();
        let allTransactions = [];

        for (const user of allUsers) {
          const userTransactions = await storage.getUserTransactions(
            user.username,
            limit,
          );
          allTransactions.push(...userTransactions);
        }

        // Sort by timestamp and limit
        allTransactions.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
        res.json(allTransactions.slice(0, limit));
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  app.get(
    "/api/admin/analytics",
    requirePermission("view_analytics"),
    async (req, res) => {
      try {
        const allUsers = await storage.getAllUsers();
        const allItems = await storage.getAllItems();

        // Calculate analytics
        const totalUsers = allUsers.length;
        const activeUsers = allUsers.filter((u) => !u.banned).length;
        const bannedUsers = allUsers.filter((u) => u.banned).length;
        const totalCoins = allUsers.reduce(
          (sum, u) => sum + u.coins + u.bank,
          0,
        );
        const avgLevel = Math.round(
          allUsers.reduce((sum, u) => sum + u.level, 0) / totalUsers || 0,
        );

        // Recent activity (users created in last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentUsers = allUsers.filter(
          (u) => new Date(u.createdAt) > weekAgo,
        ).length;

        res.json({
          users: {
            total: totalUsers,
            active: activeUsers,
            banned: bannedUsers,
            recent: recentUsers,
          },
          economy: {
            totalCoins,
            avgLevel,
            totalItems: allItems.length,
          },
          system: {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            timestamp: new Date(),
          },
        });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Grant owners badge to specific user
  app.post(
    "/api/admin/users/:username/grant-owners-badge",
    requirePermission("give_admin_roles"),
    async (req, res) => {
      try {
        const username = req.params.username;
        await EconomyService.grantOwnersBadge(username);
        res.json({
          success: true,
          message: `Owners badge granted to ${username}`,
        });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Give pet to user (admin)
  app.post(
    "/api/admin/users/:userId/give-pet",
    requireAdmin,
    async (req, res) => {
      try {
        const givePetSchema = z.object({
          petId: z.string(),
          petName: z.string().max(50).optional(),
        });

        const { petId, petName } = givePetSchema.parse(req.body);
        const pet = await storage.adoptPet(req.params.userId, petId, petName);

        await logAdminAction(req, "give_pet", "pet", pet.id, petName || "Pet", {
          userId: req.params.userId,
          petId,
          petName,
        });

        res.json({
          success: true,
          message: `Pet "${pet.name}" has been given to the user`,
          pet,
        });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  // Pet Management Routes
  app.post("/api/pets/adopt", requireAuth, async (req, res) => {
    try {
      const adoptSchema = z.object({
        petTypeId: z.string(),
        customName: z.string().optional(),
      });

      const { petTypeId, customName } = adoptSchema.parse(req.body);
      
      const result = await storage.adoptPetWithPayment(
        req.user!.username,
        petTypeId,
        customName
      );
      
      res.json({ 
        success: true, 
        pet: result.pet,
        newBalance: result.newBalance 
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("Pet type not found") || errorMessage.includes("User not found")) {
        return res.status(404).json({ error: errorMessage });
      }
      if (errorMessage.includes("Insufficient coins")) {
        return res.status(400).json({ error: errorMessage });
      }
      if (errorMessage.includes("Invalid pet adoption cost")) {
        return res.status(400).json({ error: errorMessage });
      }
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  app.get("/api/pets", requireAuth, async (req, res) => {
    try {
      const pets = await storage.getUserPets(req.user!.id);
      res.json(pets);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/pets/:id", requireAuth, async (req, res) => {
    try {
      const pet = await storage.getPet(req.params.id);
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }
      res.json(pet);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/:id/feed", requireAuth, async (req, res) => {
    try {
      const pet = await storage.feedPet(req.params.id);
      await storage.logPetActivity(req.params.id, "feed", "Fed the pet", {
        xp: 5,
      });
      res.json({ success: true, pet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/:id/clean", requireAuth, async (req, res) => {
    try {
      const pet = await storage.cleanPet(req.params.id);
      await storage.logPetActivity(req.params.id, "clean", "Cleaned the pet", {
        xp: 5,
      });
      res.json({ success: true, pet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/:id/play", requireAuth, async (req, res) => {
    try {
      const pet = await storage.playWithPet(req.params.id);
      await storage.logPetActivity(
        req.params.id,
        "play",
        "Played with the pet",
        { xp: 10 },
      );
      res.json({ success: true, pet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/:id/rest", requireAuth, async (req, res) => {
    try {
      const pet = await storage.restPet(req.params.id);
      await storage.logPetActivity(req.params.id, "rest", "Pet took a rest", {
        xp: 3,
      });
      res.json({ success: true, pet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/:id/train", requireAuth, async (req, res) => {
    try {
      const trainSchema = z.object({
        stat: z.enum(["attack", "defense", "sustainability", "hunting"]),
        points: z.number().min(1).max(100),
      });

      const { stat, points } = trainSchema.parse(req.body);
      const pet = await storage.trainPetStat(req.params.id, stat, points);
      await storage.logPetActivity(
        req.params.id,
        "train",
        `Trained ${stat} by ${points} points`,
      );
      res.json({ success: true, pet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/:id/learn-skill", requireAuth, async (req, res) => {
    try {
      const skillSchema = z.object({
        skillId: z.string(),
      });

      const { skillId } = skillSchema.parse(req.body);
      const pet = await storage.learnSkill(req.params.id, skillId);
      await storage.logPetActivity(
        req.params.id,
        "learn_skill",
        `Learned skill: ${skillId}`,
      );
      res.json({ success: true, pet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/:id/prestige", requireAuth, async (req, res) => {
    try {
      const pet = await storage.prestigePet(req.params.id);
      await storage.logPetActivity(
        req.params.id,
        "prestige",
        "Pet has prestiged!",
      );
      res.json({ success: true, pet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/pets/types", requireAuth, async (req, res) => {
    try {
      const types = await storage.getAllPetTypes();
      res.json(types);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/pets/skills", requireAuth, async (req, res) => {
    try {
      const skills = await storage.getAllPetSkills();
      res.json(skills);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/pets/sitters", requireAuth, async (req, res) => {
    try {
      const sitters = await storage.getAllPetSitters();
      res.json(sitters);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/rooms", requireAuth, async (req, res) => {
    try {
      const roomSchema = z.object({
        name: z.string().min(1).max(50),
      });

      const { name } = roomSchema.parse(req.body);
      const room = await storage.createPetRoom(req.user!.id, name);
      res.json({ success: true, room });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/pets/rooms", requireAuth, async (req, res) => {
    try {
      const rooms = await storage.getUserPetRooms(req.user!.id);
      res.json(rooms);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.patch("/api/pets/rooms/:id", requireAuth, async (req, res) => {
    try {
      const updateSchema = z.object({
        name: z.string().min(1).max(50).optional(),
        floorStyle: z.string().optional(),
        wallStyle: z.string().optional(),
        doorStyle: z.string().optional(),
        windowStyle: z.string().optional(),
        floorDecorations: z.array(z.any()).optional(),
        wallDecorations: z.array(z.any()).optional(),
      });

      const updates = updateSchema.parse(req.body);
      const room = await storage.updatePetRoom(req.params.id, updates);
      res.json({ success: true, room });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/rooms/:id/assign-pet", requireAuth, async (req, res) => {
    try {
      const assignSchema = z.object({
        petId: z.string(),
      });

      const { petId } = assignSchema.parse(req.body);
      const pet = await storage.assignPetToRoom(petId, req.params.id);
      res.json({ success: true, pet });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/rooms/:id/hire-sitter", requireAuth, async (req, res) => {
    try {
      const hireSchema = z.object({
        sitterId: z.string(),
        hours: z.number().min(1).max(72),
      });

      const { sitterId, hours } = hireSchema.parse(req.body);
      const room = await storage.hireSitter(req.params.id, sitterId, hours);
      res.json({ success: true, room });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/breeding", requireAuth, async (req, res) => {
    try {
      const breedingSchema = z.object({
        petId1: z.string(),
        petId2: z.string(),
      });

      const { petId1, petId2 } = breedingSchema.parse(req.body);
      const breeding = await storage.startBreeding(petId1, petId2);
      res.json({ success: true, breeding });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/pets/breeding", requireAuth, async (req, res) => {
    try {
      const breedings = await storage.getActiveBreedings(req.user!.id);
      res.json(breedings);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/breeding/:id/complete", requireAuth, async (req, res) => {
    try {
      const offspring = await storage.completeBreeding(req.params.id);
      res.json({ success: true, offspring });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/:id/hunt", requireAuth, async (req, res) => {
    try {
      const huntSchema = z.object({
        huntType: z.enum(["short", "medium", "long"]),
      });

      const { huntType } = huntSchema.parse(req.body);
      const hunt = await storage.startHunt(req.params.id, huntType);
      await storage.logPetActivity(
        req.params.id,
        "hunt",
        `Started ${huntType} hunt`,
      );
      res.json({ success: true, hunt });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/pets/hunts", requireAuth, async (req, res) => {
    try {
      const hunts = await storage.getActiveHunts(req.user!.id);
      res.json(hunts);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/pets/hunts/:id/complete", requireAuth, async (req, res) => {
    try {
      const result = await storage.completeHunt(req.params.id);
      await storage.logPetActivity(
        result.hunt.petId,
        "hunt_complete",
        `Hunt completed!`,
        result.rewards,
      );
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/pets/:id/activities", requireAuth, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const activities = await storage.getPetActivities(req.params.id, limit);
      res.json(activities);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.post("/api/admin/pets/types", requireAdmin, async (req, res) => {
    try {
      const petTypeSchema = z.object({
        petId: z.string(),
        name: z.string(),
        description: z.string(),
        emoji: z.string(),
        rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
        hungerDecay: z.number(),
        hygieneDecay: z.number(),
        energyDecay: z.number(),
        funDecay: z.number(),
        adoptionCost: z.number(),
      });

      const data = petTypeSchema.parse(req.body);
      const petType = await storage.createCustomPetType(data);

      await logAdminAction(
        req,
        "create_custom_pet_type",
        "pet_type",
        petType.id,
        petType.name,
        {
          petType: data,
        },
      );

      res.json({ success: true, petType });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  app.get("/api/admin/feature-flags", requireAdmin, async (req, res) => {
    try {
      const flags = await storage.getAllFeatureFlags();
      res.json(flags);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put(
    "/api/admin/feature-flags/:featureKey",
    requireAdmin,
    async (req, res) => {
      try {
        const { featureKey } = req.params;
        
        const bodySchema = z.object({
          enabled: z.boolean(),
        });
        
        const { enabled } = bodySchema.parse(req.body);

        const previousFlag = await storage.getFeatureFlag(featureKey);
        if (!previousFlag) {
          return res.status(404).json({ error: "Feature flag not found" });
        }

        const updatedFlag = await storage.updateFeatureFlag(
          featureKey,
          enabled,
          req.user!.username,
        );

        await logAdminAction(
          req,
          "update_feature_flag",
          "feature_flag",
          featureKey,
          updatedFlag.featureName,
          {
            enabled,
            previousEnabled: previousFlag.enabled,
          },
        );

        res.json({ success: true, flag: updatedFlag });
      } catch (error) {
        res.status(400).json({ error: (error as Error).message });
      }
    },
  );

  app.get("/api/feature-flags/:featureKey", async (req, res) => {
    try {
      const { featureKey } = req.params;
      const flag = await storage.getFeatureFlag(featureKey);
      
      if (!flag) {
        return res.status(404).json({ error: "Feature flag not found" });
      }
      
      res.json(flag);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time features with session authentication
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/ws",
  });

  wss.on("connection", (ws: WebSocket, req) => {
    let authenticatedUsername: string | null = null;

    // Extract session from cookies to authenticate user
    const extractUserFromSession = async (req: any): Promise<string | null> => {
      try {
        if (!req.headers.cookie) return null;

        const cookies = parse(req.headers.cookie);
        const sessionId = cookies["connect.sid"];

        if (!sessionId) return null;

        // Extract session ID (remove signature if present)
        const cleanSessionId = sessionId.startsWith("s:")
          ? sessionId.slice(2).split(".")[0]
          : sessionId;

        return new Promise((resolve) => {
          storage.sessionStore.get(cleanSessionId, (err, session: any) => {
            if (
              err ||
              !session ||
              !session.passport ||
              !session.passport.user
            ) {
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

    ws.on("message", async (data: string) => {
      try {
        const message = JSON.parse(data);

        // Handle different message types
        switch (message.type) {
          case "auth":
            // Authenticate user from session
            authenticatedUsername = await extractUserFromSession(req);
            if (authenticatedUsername) {
              ws.send(
                JSON.stringify({
                  type: "auth_success",
                  username: authenticatedUsername,
                }),
              );
            } else {
              ws.send(
                JSON.stringify({
                  type: "auth_error",
                  message: "Not authenticated or session expired",
                }),
              );
            }
            break;

          case "chat":
            // Check if user is authenticated
            if (!authenticatedUsername) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Must be authenticated to send messages",
                }),
              );
              break;
            }

            // Filter message for profanity first
            const filterResult = filterMessage(message.message);
            if (!filterResult.allowed) {
              // Send error back to the sender only
              ws.send(
                JSON.stringify({
                  type: "error",
                  message:
                    filterResult.reason ||
                    "Message blocked due to inappropriate content",
                }),
              );
              break;
            }

            // Store message in database using authenticated username
            const chatMessage = await storage.createChatMessage({
              username: authenticatedUsername,
              message: message.message,
            });

            // Broadcast to all connected clients with the stored message ID
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(
                  JSON.stringify({
                    type: "chat",
                    id: chatMessage.id,
                    username: authenticatedUsername,
                    message: message.message,
                    timestamp: Date.now(),
                  }),
                );
              }
            });
            break;

          case "delete_message":
            // Check if user is authenticated and is "savage"
            if (!authenticatedUsername) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Must be authenticated to delete messages",
                }),
              );
              break;
            }

            if (authenticatedUsername === "savage") {
              await storage.deleteChatMessage(message.messageId);

              // Broadcast deletion to all clients
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(
                    JSON.stringify({
                      type: "message_deleted",
                      messageId: message.messageId,
                      deletedBy: authenticatedUsername,
                    }),
                  );
                }
              });
            } else {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Only savage can delete messages",
                }),
              );
            }
            break;

          case "join":
            ws.send(
              JSON.stringify({
                type: "system",
                message: "Connected to Funny Economy chat!",
              }),
            );
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  return httpServer;
}
