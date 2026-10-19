import { defineConfig, devices } from "@playwright/test";

const appUrl = "http://localhost:3000";
const apiUrl = "http://localhost:5001/api/menu";

export default defineConfig({
  testDir: "./e2e",
  // The tests share one in-memory menu, so they run one at a time.
  workers: 1,
  fullyParallel: false,
  forbidOnly: true,
  use: {
    baseURL: appUrl,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // A fresh API server per run starts every suite from the seed menu.
  webServer: [
    {
      command: "npm run start-server",
      url: apiUrl,
      reuseExistingServer: false,
    },
    {
      command: "npm start",
      url: appUrl,
      reuseExistingServer: false,
    },
  ],
});
