import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import rateLimit from "express-rate-limit";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

// Extend session data interface
declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
    adminAuthTime?: string | null;
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // 5 attempts per window
    message: { error: "Too many authentication attempts, try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Admin key rate limiter - more restrictive
  const adminAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Only 3 admin authentication attempts per window
    message: { error: "Too many admin authentication attempts, try again later" },
    standardHeaders: true,
    legacyHeaders: false,
  });

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.passwordHash))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        if (user.banned) {
          return done(null, false, { message: `Account banned: ${user.banReason}` });
        }
        
        // Update last active and online status
        await storage.updateUser(user.id, { 
          onlineStatus: true,
          lastActive: new Date()
        });
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Admin authentication endpoint
  app.post("/api/admin/authenticate", adminAuthLimiter, async (req, res) => {
    try {
      const { adminKey } = req.body;
      
      if (!adminKey) {
        return res.status(400).json({ error: "Admin key is required" });
      }
      
      const serverAdminKey = process.env.ADMIN_KEY;
      if (!serverAdminKey) {
        return res.status(500).json({ error: "Admin system not configured" });
      }
      
      if (adminKey !== serverAdminKey) {
        return res.status(403).json({ error: "Invalid admin key" });
      }
      
      // Store admin authentication in session
      if (req.session) {
        req.session.isAdmin = true;
        req.session.adminAuthTime = new Date().toISOString();
      }
      
      res.json({ 
        success: true, 
        message: "Admin authentication successful",
        adminAuthTime: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req, res) => {
    if (req.session) {
      req.session.isAdmin = false;
      req.session.adminAuthTime = null;
    }
    res.json({ success: true, message: "Admin session terminated" });
  });

  app.post("/api/register", authLimiter, async (req, res, next) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ error: "Username must be 3-20 characters" });
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ error: "Username can only contain letters, numbers, and underscores" });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = await storage.createUser({
        username,
        passwordHash: await hashPassword(password),
      });

      // Create welcome transaction
      await storage.createTransaction({
        user: user.username,
        type: 'earn',
        amount: 500,
        targetUser: null,
        description: 'Welcome bonus! 🎉',
        timestamp: new Date()
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ 
          id: user.id, 
          username: user.username,
          coins: user.coins,
          level: user.level,
          xp: user.xp 
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", authLimiter, (req, res, next) => {
    passport.authenticate("local", (err: any, user: SelectUser, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.json({
          id: user.id,
          username: user.username,
          coins: user.coins,
          level: user.level,
          xp: user.xp
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    if (req.user) {
      // Update online status
      storage.updateUser(req.user.id, { onlineStatus: false });
    }

    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.sendStatus(401);
    }

    res.json({
      id: req.user.id,
      username: req.user.username,
      coins: req.user.coins,
      bank: req.user.bank,
      bankCapacity: req.user.bankCapacity,
      level: req.user.level,
      xp: req.user.xp,
      inventory: req.user.inventory,
      friends: req.user.friends,
      bio: req.user.bio,
      avatarUrl: req.user.avatarUrl,
      achievements: req.user.achievements,
      gameStats: req.user.gameStats,
      lastFreemiumClaim: req.user.lastFreemiumClaim,
      lastDailyClaim: req.user.lastDailyClaim
    });
  });
}

// Middleware to check if user is authenticated
export function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const user = req.user;
  
  // Check for permanent ban
  if (user.banned) {
    return res.status(403).json({ 
      error: "Account banned", 
      reason: user.banReason || "No reason provided" 
    });
  }

  // Check for temporary ban
  if (user.tempBanUntil && new Date(user.tempBanUntil) > new Date()) {
    const banUntil = new Date(user.tempBanUntil);
    return res.status(403).json({ 
      error: "Account temporarily banned", 
      reason: user.banReason || "Temporary ban",
      banUntil: banUntil.toISOString()
    });
  }

  // If tempBanUntil has expired, clear it
  if (user.tempBanUntil && new Date(user.tempBanUntil) <= new Date()) {
    // Clear expired temporary ban
    storage.updateUser(user.id, { tempBanUntil: null, banReason: "" });
  }

  return next();
}

// Middleware to check if user is admin (session-based)
export function requireAdmin(req: any, res: any, next: any) {
  // Check if admin session exists and is valid
  if (!req.session || !req.session.isAdmin) {
    return res.status(403).json({ error: "Admin authentication required" });
  }
  
  // Check session timeout (24 hours)
  if (req.session.adminAuthTime) {
    const authTime = new Date(req.session.adminAuthTime);
    const now = new Date();
    const hoursSinceAuth = (now.getTime() - authTime.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceAuth > 24) {
      req.session.isAdmin = false;
      req.session.adminAuthTime = null;
      return res.status(403).json({ error: "Admin session expired. Please re-authenticate." });
    }
  }
  
  return next();
}

// Legacy admin key check (fallback for backward compatibility)
export function requireAdminKey(req: any, res: any, next: any) {
  const adminKey = process.env.ADMIN_KEY;
  
  if (!adminKey) {
    return res.status(500).json({ error: "Admin system not configured" });
  }
  
  const providedKey = req.headers['admin-key'] || req.body.adminKey;
  
  if (providedKey === adminKey) {
    return next();
  }
  
  res.status(403).json({ error: "Admin access required" });
}

// Role-based permission definitions
export const AdminPermissions = {
  // Junior Admin can do basic actions
  junior_admin: [
    'view_users', 'view_items', 'view_transactions', 'view_analytics',
    'tempban', 'give_coins_small', 'kick'
  ],
  
  // Admin can do junior admin actions plus more
  admin: [
    'view_users', 'view_items', 'view_transactions', 'view_analytics',
    'tempban', 'give_coins_small', 'kick', 'unban', 'give_coins_medium'
  ],
  
  // Senior Admin can do admin actions plus dangerous ones
  senior_admin: [
    'view_users', 'view_items', 'view_transactions', 'view_analytics',
    'tempban', 'give_coins_small', 'kick', 'unban', 'give_coins_medium',
    'ban', 'remove_coins', 'manage_items'
  ],
  
  // Lead Admin can do senior admin actions plus system commands
  lead_admin: [
    'view_users', 'view_items', 'view_transactions', 'view_analytics',
    'tempban', 'give_coins_small', 'kick', 'unban', 'give_coins_medium',
    'ban', 'remove_coins', 'manage_items', 'give_coins_large', 'reset_user',
    'set_level', 'give_all_limited', 'give_admin_roles'
  ],
  
  // Owner can do everything
  owner: [
    'view_users', 'view_items', 'view_transactions', 'view_analytics',
    'tempban', 'give_coins_small', 'kick', 'unban', 'give_coins_medium',
    'ban', 'remove_coins', 'manage_items', 'give_coins_large', 'reset_user',
    'set_level', 'give_all_limited', 'give_admin_roles', 'reset_economy',
    'clear_transactions', 'give_all_unlimited', 'remove_admin_roles'
  ]
};

// Middleware to check role-based permissions (session-based)
export function requirePermission(permission: string) {
  return async (req: any, res: any, next: any) => {
    try {
      // First check if they have basic admin access (session-based)
      if (!req.session || !req.session.isAdmin) {
        return res.status(403).json({ error: "Admin authentication required" });
      }
      
      // Check session timeout (24 hours)
      if (req.session.adminAuthTime) {
        const authTime = new Date(req.session.adminAuthTime);
        const now = new Date();
        const hoursSinceAuth = (now.getTime() - authTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceAuth > 24) {
          req.session.isAdmin = false;
          req.session.adminAuthTime = null;
          return res.status(403).json({ error: "Admin session expired. Please re-authenticate." });
        }
      }

      // For role-based permissions, we need the user to be authenticated
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: "User authentication required for role-based permissions" });
      }

      const storage = require('./storage').storage;
      const user = await storage.getUserByUsername(req.user.username);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user has owners badge (special permissions)
      const EconomyService = require('./services/economyService').EconomyService;
      const hasOwnersBadge = await EconomyService.hasOwnersBadge(user.username);

      // Get user's permissions based on their admin role
      const userPermissions = AdminPermissions[user.adminRole as keyof typeof AdminPermissions] || [];
      
      // Check if user has the required permission
      const hasPermission = userPermissions.includes(permission) || hasOwnersBadge;
      
      if (!hasPermission) {
        return res.status(403).json({ 
          error: `Insufficient permissions: ${permission} required`,
          userRole: user.adminRole,
          hasOwnersBadge 
        });
      }

      // Attach user role info to request for use in endpoints
      req.adminRole = user.adminRole;
      req.hasOwnersBadge = hasOwnersBadge;
      
      return next();
    } catch (error) {
      return res.status(500).json({ error: "Permission check failed: " + (error as Error).message });
    }
  };
}
