import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.next/**", "tests/e2e/**"],
    css: false,
    coverage: {
      provider: "v8",
      include: ["components/**", "sections/**", "lib/**", "app/**"],
      exclude: ["**/*.d.ts", "app/**/layout.tsx", "tests/**"],
      reporter: ["text", "lcov"],
    },
  },
});
