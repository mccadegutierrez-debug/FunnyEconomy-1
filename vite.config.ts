import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Compatible with Node.js 12+
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ mode }) => {
  const isReplit = process.env.REPLIT === "true";
  
  return {
    plugins: [
      react(),
      // Only load Replit plugins in development on Replit
      ...(mode === "development" && isReplit
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
      outDir: path.resolve(__dirname, "dist/client"),
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
```

### **File 3: .nvmrc** ⚠️ (Recommended)

Create this file in your project root:
```
20
