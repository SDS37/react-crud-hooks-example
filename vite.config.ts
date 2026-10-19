import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vitest/config";

const apiServer = "http://localhost:5001";

export default defineConfig({
  // Vitest tests no routes, and the router plugin expects its own CLI.
  plugins: [!process.env.VITEST && reactRouter()],
  optimizeDeps: {
    // Found late otherwise, which reloads the page during the first visit.
    include: [
      "@emotion/react",
      "@emotion/react/jsx-runtime",
      "@emotion/react/jsx-dev-runtime",
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom",
      "react-dom/client",
      "react-router",
      "react-router/dom",
    ],
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: { "/api": apiServer },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
