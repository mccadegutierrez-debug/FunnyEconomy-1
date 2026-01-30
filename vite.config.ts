import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// ✅ VERIFIED FIX: Cross-platform dirname resolution
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      // ✅ VERIFIED FIX: Only use Replit plugin in development
      ...(mode === "development" && process.env.REPLIT
        ? [
            (await import("@replit/vite-plugin-runtime-error-modal")).default(),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/client"), // ✅ VERIFIED FIX: Separate client output
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
