import { storage } from "../storage";

// In-memory storage for pending freemium rewards
const pendingRewards = new Map<string, { rewards: any[]; expiresAt: number }>();

export class FreemiumService {
  // Generate 3 different rewards for the user to choose from
  static async generateRewards(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const freemiumCooldown = 12 * 60 * 60 * 1000; // 12 hours

    if (user.lastFreemiumClaim) {
      const lastClaimTime = new Date(user.lastFreemiumClaim).getTime();
      if (now - lastClaimTime < freemiumCooldown) {
        const remaining = freemiumCooldown - (now - lastClaimTime);
        const hoursRemaining = Math.ceil(remaining / (60 * 60 * 1000));
        throw new Error(
          `Freemium cooldown: ${hoursRemaining} hours remaining`,
        );
      }
    }

    // Check if user already has pending rewards
    const existing = pendingRewards.get(username);
    if (existing && existing.expiresAt > now) {
      return existing.rewards;
    }

    // Get loot table
    const lootTable = (await storage.db?.get("freemium:loot")) || {
      coins: { weight: 40, min: 100, max: 500 },
      common: { weight: 25 },
      uncommon: { weight: 15 },
      rare: { weight: 10 },
      epic: { weight: 5 },
      legendary: { weight: 5 },
    };

    // Generate 3 different rewards
    const rewards = [];
    const usedRewardTypes = new Set<string>();

    for (let i = 0; i < 3; i++) {
      let reward = await this.generateSingleReward(lootTable, usedRewardTypes);
      rewards.push(reward);
    }

    // Store rewards with 5 minute expiration
    pendingRewards.set(username, {
      rewards,
      expiresAt: now + 5 * 60 * 1000,
    });

    return rewards;
  }

  private static async generateSingleReward(
    lootTable: any,
    usedTypes: Set<string>,
  ) {
    const items = await storage.getAllItems();

    // Weighted random selection
    const totalWeight = Object.values(lootTable).reduce(
      (sum: number, item: any) => sum + item.weight,
      0,
    );
    let random = Math.random() * totalWeight;

    let selectedReward = "coins";
    for (const [reward, data] of Object.entries(lootTable)) {
      random -= (data as any).weight;
      if (random <= 0) {
        selectedReward = reward;
        break;
      }
    }

    let result: any = { type: selectedReward };

    if (selectedReward === "coins") {
      const coinData = lootTable.coins as any;
      const amount =
        coinData.min +
        Math.floor(Math.random() * (coinData.max - coinData.min + 1));

      result = {
        type: "coins",
        amount,
        rarity: "coins",
        icon: "💰",
        name: `${amount} Coins`,
        description: `Receive ${amount} coins`,
      };
    } else {
      // Item reward
      const rarityItems = items.filter(
        (item) => item.rarity === selectedReward,
      );

      if (rarityItems.length === 0) {
        // Fallback to coins if no items of that rarity
        const amount = 250;
        result = {
          type: "coins",
          amount,
          rarity: "coins",
          icon: "💰",
          name: `${amount} Coins`,
          description: `Receive ${amount} coins`,
        };
      } else {
        const selectedItem =
          rarityItems[Math.floor(Math.random() * rarityItems.length)];

        result = {
          type: "item",
          item: selectedItem,
          rarity: selectedReward,
          icon: selectedItem.icon || "✨",
          name: selectedItem.name,
          description: selectedItem.description,
        };
      }
    }

    usedTypes.add(`${result.type}-${result.rarity}`);
    return result;
  }

  // Claim a specific reward by index
  static async claimReward(username: string, rewardIndex: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    // Get pending rewards
    const pending = pendingRewards.get(username);
    if (!pending || pending.expiresAt < Date.now()) {
      throw new Error("No pending rewards found. Please generate new rewards.");
    }

    if (rewardIndex < 0 || rewardIndex >= pending.rewards.length) {
      throw new Error("Invalid reward index");
    }

    const selectedReward = pending.rewards[rewardIndex];
    const now = Date.now();

    // Apply the reward
    if (selectedReward.type === "coins") {
      await storage.updateUser(user.id, {
        coins: user.coins + selectedReward.amount,
        lastFreemiumClaim: new Date(now),
      });

      await storage.createTransaction({
        user: username,
        type: "freemium",
        amount: selectedReward.amount,
        description: `Freemium reward: ${selectedReward.amount} coins`,
      });

      selectedReward.newBalance = user.coins + selectedReward.amount;
    } else {
      // Item reward - ensure inventory is an array
      const inventory = Array.isArray(user.inventory) ? user.inventory : [];
      const existingItem = inventory.find(
        (item) => item.itemId === selectedReward.item.id,
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        inventory.push({
          itemId: selectedReward.item.id,
          quantity: 1,
          equipped: false,
        });
      }

      await storage.updateUser(user.id, {
        inventory: inventory,
        lastFreemiumClaim: new Date(now),
      });

      await storage.createTransaction({
        user: username,
        type: "freemium",
        amount: 0,
        description: `Freemium reward: ${selectedReward.item.name} (${selectedReward.rarity})`,
      });
    }

    // Clear pending rewards
    pendingRewards.delete(username);

    return selectedReward;
  }

  private static async openLootbox(user: any, lootbox: any) {
    const items = await storage.getAllItems();
    const nonLootboxItems = items.filter((item) => item.type !== "lootbox");

    const numItems = 2 + Math.floor(Math.random() * 4); // 2-5 items
    const lootboxContents = [];

    // Ensure inventory is an array
    const inventory = Array.isArray(user.inventory) ? user.inventory : [];

    for (let i = 0; i < numItems; i++) {
      // Weighted selection favoring common items
      const random = Math.random();
      let selectedRarity = "common";

      if (random < 0.05) selectedRarity = "legendary";
      else if (random < 0.15) selectedRarity = "epic";
      else if (random < 0.3) selectedRarity = "rare";
      else if (random < 0.5) selectedRarity = "uncommon";

      const rarityItems = nonLootboxItems.filter(
        (item) => item.rarity === selectedRarity,
      );
      if (rarityItems.length === 0) continue;

      const selectedItem =
        rarityItems[Math.floor(Math.random() * rarityItems.length)];

      // Add to user inventory
      const existingItem = inventory.find(
        (item: any) => item.itemId === selectedItem.id,
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        inventory.push({
          itemId: selectedItem.id,
          quantity: 1,
          equipped: false,
        });
      }

      lootboxContents.push(selectedItem);
    }

    return lootboxContents;
  }

  // Get time until next claim
  static async getNextClaimTime(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) return null;

    if (!user.lastFreemiumClaim) return 0; // Can claim now

    const freemiumCooldown = 12 * 60 * 60 * 1000; // 12 hours
    const lastClaimTime = new Date(user.lastFreemiumClaim).getTime();
    const nextClaimTime = lastClaimTime + freemiumCooldown;
    const now = Date.now();

    return Math.max(0, nextClaimTime - now);
  }

  // Get pending rewards for a user
  static async getPendingRewards(username: string) {
    const pending = pendingRewards.get(username);
    if (!pending || pending.expiresAt < Date.now()) {
      return null;
    }
    return pending.rewards;
  }
}
