import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    dyadComponentTagger(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["Full-Logo.png", "robots.txt"],
      manifest: {
        name: "Scoreboard",
        short_name: "Scoreboard",
        description: "A simple scoreboard app.",
        theme_color: "#3255a6",
        background_color: "#3255a6",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "Full-Logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "Full-Logo.png",
            sizes: "512x512",
            type: "image/png",
          },
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