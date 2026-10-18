import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, transformWithOxc } from "vite";

const apiServer = "http://localhost:5001";
const appSourceDir = path.resolve("src") + path.sep;
const isAppSourceFile = (id) =>
  id.startsWith(appSourceDir) &&
  !id.includes("/node_modules/") &&
  id.endsWith(".js");

// The app keeps JSX in .js files, and Vite only compiles JSX in .jsx files.
// The React Router plugin parses .js route modules with Babel, which rejects
// JSX, so this must run first. It outlives React 16: drop it only by renaming
// the files to .jsx. The automatic runtime needs no React import in each file.
const jsxInJsFiles = {
  name: "jsx-in-js-files",
  enforce: "pre",
  async transform(code, id) {
    if (!isAppSourceFile(id)) {
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
    include: [
      "@emotion/react",
      "@emotion/react/jsx-runtime",
      "@emotion/react/jsx-dev-runtime",
      "prop-types",
    ],
    // Dependency pre-bundling and its scan do not run the plugin above.
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
