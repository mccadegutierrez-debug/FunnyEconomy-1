
import { storage } from "../storage";
import type { User } from "@shared/schema";

interface DupeDetectionResult {
  isDuplicate: boolean;
  reason?: string;
  suspiciousActivity?: boolean;
}

interface InventorySnapshot {
  userId: string;
  inventory: any[];
  timestamp: Date;
  transactionId?: string;
}

// In-memory cache for recent inventory snapshots (last 100 operations per user)
const inventoryHistory = new Map<string, InventorySnapshot[]>();
const MAX_HISTORY_PER_USER = 100;

// Track suspicious rapid transactions
const transactionTimestamps = new Map<string, number[]>();
const RAPID_TRANSACTION_THRESHOLD = 5; // 5 transactions in 10 seconds is suspicious
const RAPID_TRANSACTION_WINDOW = 10000; // 10 seconds

export class AntiDupeService {
  // Validate inventory integrity before any transaction
  static async validateInventory(userId: string, user: User): Promise<DupeDetectionResult> {
    try {
      const inventory = user.inventory as any[];
      
      // Check for duplicate item entries (same itemId appearing twice)
      const itemIds = inventory.map(item => item.itemId);
      const uniqueItemIds = new Set(itemIds);
      
      if (itemIds.length !== uniqueItemIds.size) {
        return {
          isDuplicate: true,
          reason: "Duplicate item entries detected in inventory",
          suspiciousActivity: true
        };
      }

      // Check for negative quantities
      const hasNegativeQuantity = inventory.some(item => item.quantity < 0);
      if (hasNegativeQuantity) {
        return {
          isDuplicate: true,
          reason: "Negative item quantities detected",
          suspiciousActivity: true
        };
      }

      // Check for impossibly high quantities (over 1 million of any item)
      const hasExcessiveQuantity = inventory.some(item => item.quantity > 1000000);
      if (hasExcessiveQuantity) {
        return {
          isDuplicate: true,
          reason: "Excessive item quantities detected",
          suspiciousActivity: true
        };
      }

      return { isDuplicate: false };
    } catch (error) {
      console.error("[AntiDupe] Inventory validation error:", error);
      return {
        isDuplicate: true,
        reason: "Inventory validation failed",
        suspiciousActivity: true
      };
    }
  }

  // Take a snapshot of inventory before modification
  static async snapshotInventory(userId: string, user: User, transactionId?: string): Promise<void> {
    const snapshot: InventorySnapshot = {
      userId,
      inventory: JSON.parse(JSON.stringify(user.inventory || [])),
      timestamp: new Date(),
      transactionId
    };

    if (!inventoryHistory.has(userId)) {
      inventoryHistory.set(userId, []);
    }

    const history = inventoryHistory.get(userId)!;
    history.push(snapshot);

    // Keep only recent history
    if (history.length > MAX_HISTORY_PER_USER) {
      history.shift();
    }
  }

  // Detect rapid suspicious transactions
  static async detectRapidTransactions(userId: string): Promise<boolean> {
    const now = Date.now();
    
    if (!transactionTimestamps.has(userId)) {
      transactionTimestamps.set(userId, []);
    }

    const timestamps = transactionTimestamps.get(userId)!;
    
    // Clean old timestamps outside the window
    const recentTimestamps = timestamps.filter(ts => now - ts < RAPID_TRANSACTION_WINDOW);
    transactionTimestamps.set(userId, recentTimestamps);

    // Add current timestamp
    recentTimestamps.push(now);

    // Check if threshold exceeded
    return recentTimestamps.length > RAPID_TRANSACTION_THRESHOLD;
  }

  // Validate item purchase
  static async validatePurchase(
    user: User,
    itemId: string,
    quantity: number,
    cost: number
  ): Promise<DupeDetectionResult> {
    // Check if user has enough coins
    if (user.coins < cost) {
      return {
        isDuplicate: true,
        reason: "Insufficient coins for purchase",
        suspiciousActivity: true
      };
    }

    // Check for reasonable purchase quantity
    if (quantity <= 0 || quantity > 1000) {
      return {
        isDuplicate: true,
        reason: "Invalid purchase quantity",
        suspiciousActivity: true
      };
    }

    // Validate inventory before purchase
    const inventoryCheck = await this.validateInventory(user.id, user);
    if (inventoryCheck.isDuplicate) {
      return inventoryCheck;
    }

    // Check for rapid transactions
    const isRapid = await this.detectRapidTransactions(user.id);
    if (isRapid) {
      return {
        isDuplicate: true,
        reason: "Suspicious rapid transaction pattern detected",
        suspiciousActivity: true
      };
    }

    return { isDuplicate: false };
  }

  // Validate trade
  static async validateTrade(
    user: User,
    tradeItems: any[]
  ): Promise<DupeDetectionResult> {
    const inventory = user.inventory as any[];

    // Validate each trade item
    for (const tradeItem of tradeItems) {
      if (tradeItem.itemType === "item" && tradeItem.itemId) {
        const inventoryItem = inventory.find(item => item.itemId === tradeItem.itemId);
        
        if (!inventoryItem) {
          return {
            isDuplicate: true,
            reason: "Attempting to trade non-existent item",
            suspiciousActivity: true
          };
        }

        if (inventoryItem.quantity < tradeItem.quantity) {
          return {
            isDuplicate: true,
            reason: "Attempting to trade more items than owned",
            suspiciousActivity: true
          };
        }
      }
    }

    // Check for rapid trading
    const isRapid = await this.detectRapidTransactions(user.id);
    if (isRapid) {
      return {
        isDuplicate: true,
        reason: "Suspicious rapid trading pattern detected",
        suspiciousActivity: true
      };
    }

    return { isDuplicate: false };
  }

  // Normalize inventory (remove duplicates and fix quantities)
  static normalizeInventory(inventory: any[]): any[] {
    const normalized = new Map<string, any>();

    for (const item of inventory) {
      if (!item.itemId) continue;

      if (normalized.has(item.itemId)) {
        // Merge quantities if duplicate found
        const existing = normalized.get(item.itemId);
        existing.quantity = Math.max(0, existing.quantity + item.quantity);
      } else {
        normalized.set(item.itemId, {
          itemId: item.itemId,
          quantity: Math.max(0, item.quantity),
          equipped: item.equipped || false
        });
      }
    }

    return Array.from(normalized.values());
  }

  // Flag user for suspicious activity
  static async flagSuspiciousUser(userId: string, username: string, reason: string): Promise<void> {
    try {
      const user = await storage.getUser(userId);
      if (!user) return;

      // Create audit log
      await storage.createAuditLog({
        adminUsername: "SYSTEM",
        adminRole: "system",
        action: "flag_suspicious_activity",
        targetType: "user",
        targetId: userId,
        targetName: username,
        details: {
          reason,
          timestamp: new Date().toISOString(),
          autoFlagged: true
        }
      });

      // Create notification for admins
      const allUsers = await storage.getAllUsers();
      const admins = allUsers.filter(u => 
        u.adminRole && u.adminRole !== "none"
      );

      for (const admin of admins) {
        await storage.createNotification({
          user: admin.username,
          type: "system",
          message: `⚠️ ANTI-DUPE: User ${username} flagged for suspicious activity: ${reason}`,
          read: false
        });
      }

      console.log(`[AntiDupe] Flagged user ${username} (${userId}): ${reason}`);
    } catch (error) {
      console.error("[AntiDupe] Error flagging user:", error);
    }
  }

  // Clean up old data periodically
  static cleanup(): void {
    const now = Date.now();
    
    // Clean old transaction timestamps (older than 1 hour)
    for (const [userId, timestamps] of transactionTimestamps.entries()) {
      const recent = timestamps.filter(ts => now - ts < 3600000);
      if (recent.length === 0) {
        transactionTimestamps.delete(userId);
      } else {
        transactionTimestamps.set(userId, recent);
      }
    }

    // Clean old inventory snapshots (older than 24 hours)
    for (const [userId, snapshots] of inventoryHistory.entries()) {
      const recent = snapshots.filter(s => 
        now - s.timestamp.getTime() < 86400000
      );
      if (recent.length === 0) {
        inventoryHistory.delete(userId);
      } else {
        inventoryHistory.set(userId, recent);
      }
    }
  }
}

// Run cleanup every hour
setInterval(() => {
  AntiDupeService.cleanup();
}, 3600000);
