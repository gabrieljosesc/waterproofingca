import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure-logic unit tests (the pricing engine). Node environment, no DOM.
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
