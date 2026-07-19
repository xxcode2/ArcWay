import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  define: {
    // viem / app-kit occasionally probe for `global`
    global: "globalThis",
  },
});
