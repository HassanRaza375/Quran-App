import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    // The rebuild (revamp-quran/) has its own Vitest setup.
    exclude: ["revamp-quran/**", "node_modules/**"],
  },
});
