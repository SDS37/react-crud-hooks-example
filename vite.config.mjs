import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, transformWithOxc } from "vite";

const apiServer = "http://localhost:5001";
const appSourceFile = /\/src\/.*\.js$/;

// The app keeps JSX in .js files, and Vite only compiles JSX in .jsx files.
// The automatic runtime needs no React import in each file.
const jsxInJsFiles = {
  name: "jsx-in-js-files",
  enforce: "pre",
  async transform(code, id) {
    if (!appSourceFile.test(id)) {
      return null;
    }
    const result = await transformWithOxc(code, id, {
      lang: "jsx",
      jsx: { runtime: "automatic", importSource: "@emotion/react" },
    });
    return { code: result.code, map: result.map };
  },
};

export default defineConfig({
  // Vitest tests no routes, and the router plugin expects its own CLI.
  plugins: [jsxInJsFiles, !process.env.VITEST && reactRouter()],
  optimizeDeps: {
    // Found late otherwise, which reloads the page during the first visit.
    include: ["@emotion/react/jsx-runtime", "@emotion/react/jsx-dev-runtime"],
    // The dependency scanner does not run the plugin above.
    rolldownOptions: {
      moduleTypes: { ".js": "jsx" },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: { "/api": apiServer },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/setupTests.js"],
    include: ["src/**/*.test.js"],
  },
});
