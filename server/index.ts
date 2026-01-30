import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// --- Pet Decay Logic ---
// We moved this out of the IIFE so it can be called by the cron route
async function processPetStatDecay() {
  try {
    const allPets = await storage.getAllPets();
    const petTypes = await storage.getAllPetTypes();
    
    for (const pet of allPets) {
      if (pet.isDead) continue;
      
      const petType = petTypes.find((pt) => pt.id === pet.petTypeId);
      if (!petType) continue;
      
      const decayedPet = storage.calculateStatDecay(pet, petType);
      
      if (decayedPet.hunger !== pet.hunger || 
          decayedPet.hygiene !== pet.hygiene || 
          decayedPet.fun !== pet.fun || 
          decayedPet.energy !== pet.energy) {
        await storage.updatePet(pet.id, {
          hunger: decayedPet.hunger,
          hygiene: decayedPet.hygiene,
          fun: decayedPet.fun,
          energy: decayedPet.energy,
          lastFed: decayedPet.lastFed,
          lastCleaned: decayedPet.lastCleaned,
          lastPlayed: decayedPet.lastPlayed,
          lastSlept: decayedPet.lastSlept,
        });
        
        await storage.checkAndHandlePetDeath(decayedPet);
      }
    }
    log('Pet stat decay processed successfully');
  } catch (error) {
    log(`Error processing pet stat decay: ${(error as Error).message}`);
  }
}

// --- Initialization Wrapper ---
let serverInitialized = false;

// We export this so api/index.ts can call it
export const setupApp = async () => {
  if (serverInitialized) return app;
  serverInitialized = true;

  const server = await registerRoutes(app);

  // Vercel Cron Route - This replaces your setInterval
  app.get('/api/cron', async (req, res) => {
    await processPetStatDecay();
    res.json({ status: "Decay processed" });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Only setup Vite in development
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  }

  return server;
};

// --- Execution ---
// This runs ONLY on your local machine. Vercel skips this.
if (process.env.NODE_ENV !== "production") {
  (async () => {
    const server = await setupApp();
    
    // Local Cron Simulation (so it still works on your laptop)
    setInterval(processPetStatDecay, 60 * 60 * 1000);
    log('Pet stat decay system initialized (runs every hour)');

    const port = parseInt(process.env.PORT || "5000", 10);
    server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
      log(`serving on port ${port}`);
    });
  })();
}

// Export the app for Vercel
export default app;
