import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// `base: '/enough/'` for production builds so assets resolve correctly when
// served at https://TohzKai.github.io/enough/. Local dev keeps the default '/'.
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/enough/" : "/",
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
