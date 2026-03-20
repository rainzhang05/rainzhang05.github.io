import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        environment: "happy-dom",
        setupFiles: ["./tests/setup/vitest-setup.js"],
        exclude: ["**/node_modules/**", "**/dist/**", "tests/e2e/**"],
        coverage: {
            provider: "v8",
            include: ["js/**/*.js", "tests/**/*.js", "tests/**/*.mjs"],
            reporter: ["text", "lcov"],
            // Portfolio scripts run via inline classic <script> in happy-dom; lines are exercised but not file-mapped to v8 coverage.
        },
    },
})
