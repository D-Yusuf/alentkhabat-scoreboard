import { defineConfig } from "vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "::",
    port: 8000,
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["Full-Logo.png","/files/game-manual.pdf"],
      manifest: {
        name: "القيد",
        short_name: "القيد",
        description: "تطبيق لحساب القيد في لعبة الانتخابات وغيرها",
        theme_color: "#3255a6",
        background_color: "#3255a6",
        display: "standalone",
        start_url: "./",
        scope: "./",
        icons: [
          { src: "Full-Logo.png", sizes: "192x192", type: "image/png" },
        ],
     
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
