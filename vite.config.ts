import { defineConfig } from "vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["Full-Logo.png"],
      manifest: {
        name: "Scoreboard",
        short_name: "Scoreboard",
        description: "A simple scoreboard app.",
        theme_color: "#3255a6",
        background_color: "#3255a6",
        display: "standalone",
        display_override: ["standalone"],
        start_url: "./",
        scope: "./",
        icons: [
          { src: "Full-Logo.png", sizes: "192x192", type: "image/png" },
          // { src: "Full-Logo.png", sizes: "512x512", type: "image/png" },
          // { src: "Full-Logo.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));