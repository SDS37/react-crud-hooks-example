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
      jsx: { runtime: "automatic" },
    });
    return { code: result.code, map: result.map };
  },
};

export default defineConfig({
  plugins: [jsxInJsFiles],
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
