import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Absolut, bukan "./" — SPA di Vercel di-serve dari path apa pun (mis. /dashboard),
  // jadi path relatif akan salah resolve.
  base: "/",
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: "dist",
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
