// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "https://thinking-tester-contact-list.herokuapp.com",
  },
  projects: [
    {
      name: "API Tests",
      testMatch: /.*\.spec\.ts/,
    },
  ],
  reporter: [
    ["json", { outputFile: "test-results/results.json" }],
    ["html", { outputFolder: "test-results/html" }],
  ],
});
