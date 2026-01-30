import app, { setupApp } from "../server/index";

// Vercel Serverless Handler
export default async function handler(req, res) {
  // Ensure the app is initialized (routes registered) before handling request
  await setupApp();
  
  // Hand off the request to Express
  app(req, res);
}
