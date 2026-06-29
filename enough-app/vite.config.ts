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
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
}));
