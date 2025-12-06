import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routesDirectory: "./src/ui/routes",
      generatedRouteTree: "./src/ui/routeTree.gen.ts",
    }),
  ],
  base: "./",
  build: {
    outDir: "dist-react",
  },
  server: {
    port: 5123,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
