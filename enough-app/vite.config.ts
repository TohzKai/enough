import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// Asset base path per host:
//  - GitHub Pages serves the app under https://TohzKai.github.io/enough/ → `/enough/`
//  - Vercel serves the app at the site root (https://<project>.vercel.app/) → `/`
// Vercel injects VERCEL=1 during builds, so the same config works on both hosts.
// Local dev keeps the default '/'.
export default defineConfig(({ mode }) => ({
  base: process.env.VERCEL ? "/" : mode === "production" ? "/enough/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // Note: this is a OneDrive-synced folder mounted in WSL, where native fs
    // events don't reach Vite — so HMR won't auto-reload on edit. Restart the
    // dev server after code changes (a fresh start reads current files from
    // disk). Polling the whole tree here is worse: it starves the server on
    // this mount's node_modules, so it is deliberately NOT enabled.
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
}));
